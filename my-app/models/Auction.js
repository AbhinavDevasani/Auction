import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const AuctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    
    image: String,
    startingPrice: {
      type: Number,
      required: true,
    },

    currentBid: {
      type: Number,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bids: [BidSchema],
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },
  },
  { timestamps: true }
);
AuctionSchema.index({ status: 1, endTime: 1 });

export default mongoose.models.Auction ||
  mongoose.model("Auction", AuctionSchema);