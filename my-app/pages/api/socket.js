import { Server } from "socket.io";
import { getToken, decode } from "next-auth/jwt";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import User from "@/models/User";
import Transaction from "@/models/Transaction";



export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Fix Hot-Module-Reload caching: if old socket instance exists on the wrong path, clear it out.
  if (res.socket.server.io && res.socket.server.io._path !== "/api/socket_io") {
    console.log("Cleaning up old socket attached to wrong path...");
    res.socket.server.io.close();
    delete res.socket.server.io;
  }

  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");
    const io = new Server(res.socket.server, {
  path: "/api/socket_io",
  addTrailingSlash: false,
  cors: {
    origin: "*",
    credentials: true,
  },
});

    // Middleware for authentication
    io.use(async (socket, next) => {
  try {
    console.log("👉 Cookies:", socket.request.headers.cookie)
    console.log("👉 Headers:", socket.request.headers)

    let token = await getToken({
      req: socket.request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("👉 Token from getToken:", token); // ✅ ADD

    if (!token) {
      const cookieHeader = socket.request.headers.cookie || "";
      const match = cookieHeader.match(/(?:__Secure-)?next-auth\.session-token=([^;]+)/);

      if (match) {
        token = await decode({
          token: match[1],
          secret: process.env.NEXTAUTH_SECRET,
        });
        console.log("👉 Token from manual decode:", token); // ✅ ADD
      }
    }

    if (token) {
      socket.userId = token.id || token.userId || token.sub;
    }

    next();
  } catch (err) {
    console.error("Socket Auth Error:", err);
    next();
  }
});

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id} (User: ${socket.userId || 'Guest'})`);

      socket.on("joinAuction", (auctionId) => {
        const roomName = `auction_${auctionId}`;
        socket.join(roomName);
        console.log(`Socket ${socket.id} joined room ${roomName}`);
      });

      socket.on("placeBid", async (data, callback) => {
        try {
          await connectDB();
          
          const userId = socket.userId;
          if (!userId) {
            return callback && callback({ error: "Authentication required to place a bid" });
          }

          const { auctionId, amount } = data;

          if (!auctionId || !amount) {
            return callback && callback({ error: "Missing fields" });
          }

          const bidAmount = Number(amount);

          if (isNaN(bidAmount) || bidAmount <= 0) {
            return callback && callback({ error: "Invalid amount" });
          }

          const dbUser = await User.findById(userId);
          if (!dbUser) {
            return callback && callback({ error: "User not found" });
          }

          if (dbUser.balance < bidAmount) {
            return callback && callback({ error: "Insufficient balance. Please add funds to your wallet." });
          }

          const auction = await Auction.findById(auctionId);

          if (!auction) {
            return callback && callback({ error: "Auction not found" });
          }

          if (auction.status !== "active" || new Date() > new Date(auction.endTime)) {
            return callback && callback({ error: "Auction ended" });
          }

          if (auction.seller.toString() === userId) {
            return callback && callback({ error: "You cannot bid on your own auction" });
          }

          const minBid = auction.currentBid || auction.startingPrice;
          const hasBids = auction.bids && auction.bids.length > 0;

          // If there are no bids, allow exactly the starting price. Otherwise must be strictly strictly higher.
          if (hasBids ? bidAmount <= minBid : bidAmount < minBid) {
            return callback && callback({ error: `Bid must be at least ₹${hasBids ? minBid + 1 : minBid}` });
          }

          // --- Previous highest bidder to refund ---
          const prevHighestBidder = auction.highestBidder
            ? auction.highestBidder.toString()
            : null;
          const prevBidAmount = auction.currentBid || 0;

          // Debit the bid amount from the current bidder's wallet
          await User.findByIdAndUpdate(userId, { $inc: { balance: -bidAmount } });

          await Transaction.create({
            user: userId,
            type: "Bid Placed",
            amount: -bidAmount,
            reference: auctionId,
          });

          // If there was a previous highest bidder (and it's a different user), refund them
          if (prevHighestBidder && prevHighestBidder !== userId && prevBidAmount > 0) {
            await User.findByIdAndUpdate(prevHighestBidder, {
              $inc: { balance: prevBidAmount },
            });

            await Transaction.create({
              user: prevHighestBidder,
              type: "Outbid Refund",
              amount: prevBidAmount,
              reference: auctionId,
            });

            // Notify the outbid user
            const sockets = await io.in(`auction_${auctionId}`).fetchSockets();
            for (const clientSocket of sockets) {
              if (clientSocket.userId === prevHighestBidder) {
                clientSocket.emit("outbidNotification", { auctionId, newBid: bidAmount });
              }
            }
          }

          // If the same user is raising their own bid, refund their previous bid first
          if (prevHighestBidder && prevHighestBidder === userId && prevBidAmount > 0) {
            await User.findByIdAndUpdate(userId, {
              $inc: { balance: prevBidAmount },
            });

            await Transaction.create({
              user: userId,
              type: "Previous Bid Refund",
              amount: prevBidAmount,
              reference: auctionId,
            });
          }

          // Update auction
          // If there are no bids, we allow updating where currentBid could equal bidAmount.
          const updatedAuction = await Auction.findOneAndUpdate(
            {
              _id: auctionId,
              $or: [
                { currentBid: { $lt: bidAmount } },
                { bids: { $size: 0 } }
              ]
            },
            {
              $set: {
                currentBid: bidAmount,
                highestBidder: userId,
              },
              $push: {
                bids: {
                  user: userId,
                  amount: bidAmount,
                },
              },
            },
            { new: true }
          )
            .populate("highestBidder", "name")
            .populate("bids.user", "name");

          if (!updatedAuction) {
            // Race condition: someone else placed a higher bid at the same time — refund this user
            await User.findByIdAndUpdate(userId, { $inc: { balance: bidAmount } });
            return callback && callback({ error: "Bid must be higher than current bid" });
          }

          // Return updated balance to the user who placed the bid
          const updatedUser = await User.findById(userId).select("balance");

          // Broadcast to everyone in the room (including sender)
          io.to(`auction_${auctionId}`).emit("bidUpdate", {
            auction: updatedAuction
          });

          // Callback success just for the sender
          if (callback) {
            callback({ success: true, balance: updatedUser.balance });
          }

        } catch (error) {
          console.error("Bid error:", error);
          if (callback) callback({ error: error.message });
        }
      });

      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });

    res.socket.server.io = io;
  }
  
  res.status(200).send("Socket Initialized");
}
