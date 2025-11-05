import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/auth.service";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username dan password wajib diisi");
          }

          const data = await authService.login({
            username: credentials.username,
            password: credentials.password
          });

          if (data.success && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              username: data.user.username,
              role: data.user.role,
              picture: data.user.picture,
              accessToken: data.token
            };
          }

          throw new Error("Login gagal");
        } catch (error) {
          console.error("Credentials authorize error:", error);
          throw error;
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const googleProfile = profile as { 
            email?: string; 
            name?: string; 
            sub?: string; 
            picture?: string; 
          };

          const data = await authService.googleAuth({
            email: googleProfile.email || "",
            name: googleProfile.name || "",
            googleId: googleProfile.sub || "",
            picture: googleProfile.picture
          });

          if (data.success && data.user) {
            user.id = data.user.id;
            user.username = data.user.username;
            user.role = data.user.role;
            user.accessToken = data.token;
            return true;
          }

          console.error("Google auth failed:", data.message);
          return false;
        } catch (error) {
          console.error("Google signIn callback error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as "ADMIN" | "TEACHER" | "PARENT";
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  },

  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };