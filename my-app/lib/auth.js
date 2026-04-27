import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found. Please register.");
        }

        if (!user.password) {
          throw new Error("Invalid login method. Please sign in using Google.");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email to login. Use the sign-up page or verify email page.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();

        if (!user?.email) {
          return false;
        }

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || profile?.name || user.email.split("@")[0],
            email: user.email,
            avatar: user.image || profile?.picture || "",
            password: null,
            isVerified: true,
          });
        } else {
          // Update avatar if it exists
          if ((user.image || profile?.picture) && !dbUser.avatar) {
            dbUser.avatar = user.image || profile?.picture;
            await dbUser.save();
          }
        }

        if (!dbUser) return false;
        
        // Mutate the user object so the JWT callback gets the MongoDB ID
        user.id = dbUser._id.toString();
        // user.role = dbUser.role; // Add this if you introduce roles in User Schema
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        // token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        // session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function verifyToken() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) return null;

    return { ...session.user, userId: session.user.id };
  } catch {
    return null;
  }
}