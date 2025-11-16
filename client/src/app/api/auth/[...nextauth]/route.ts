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
        password: { label: "Password", type: "password" },
        faceToken: { label: "Face Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          // Face Token Login
          if (credentials?.faceToken) {
            const data = await authService.verifyFaceToken(credentials.faceToken);
            if (data.success && data.user) {
              return {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                username: data.user.username,
                role: data.user.role,
                image: data.user.picture,
                accessToken: data.token,
                isPasswordReset: data.user.isPasswordReset
              };
            }
            throw new Error(data.message || "Face login gagal");
          }

          // Credentials Login
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username dan password wajib diisi");
          }

          const data = await authService.login({
            username: credentials.username,
            password: credentials.password
          });

          if (data.success && data.user) {
            console.log("✅ Login success, token:", data.token?.substring(0, 20));
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              username: data.user.username,
              role: data.user.role,
              image: data.user.picture,
              accessToken: data.token,
              isPasswordReset: data.user.isPasswordReset
            };
          }

          throw new Error(data.message || "Login gagal");
        } catch (error) {
          console.error("❌ Credentials authorize error:", error);
          throw error;
        }
      }
    })
  ],

  callbacks: {
    // SIGN-IN CALLBACK
    async signIn({ user, account: _account, profile }) {
      if (_account?.provider === "google") {
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

          if (!data.success) {
            user.loginErrorMessage = data.message;
            return false;
          }

          if (data.user) {
            user.id = data.user.id;
            user.username = data.user.username;
            user.role = data.user.role;
            user.accessToken = data.token;
            user.isPasswordReset = data.user.isPasswordReset;
            console.log("✅ Google login success, token:", data.token?.substring(0, 20));
            return true;
          }

          return false;
        } catch (error) {
          console.error("❌ Google signIn error:", error);
          user.loginErrorMessage = "Terjadi kesalahan pada server";
          return false;
        }
      }

      return true;
    },

    // JWT CALLBACK
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.isPasswordReset = user.isPasswordReset;
        console.log("✅ JWT callback - Token stored:", !!token.accessToken);
      }
      return token;
    },

    // SESSION CALLBACK
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as "ADMIN" | "TEACHER" | "PARENT";
        session.accessToken = token.accessToken as string;
        session.user.isPasswordReset = token.isPasswordReset as boolean;
        console.log("✅ Session callback - accessToken exists:", !!session.accessToken);
      }
      return session;
    }
  },

  pages: {
    signIn: "/login",
    error: "/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
});

export { handler as GET, handler as POST };