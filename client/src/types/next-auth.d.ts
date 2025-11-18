import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "TEACHER" | "PARENT";
      picture?: string | null;
      phoneNumber?: string | null;
      isPasswordReset?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    picture?: string | null;
    phoneNumber?: string | null;
    accessToken?: string;
    loginErrorMessage?: string;
    isPasswordReset?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    picture?: string | null;
    phoneNumber?: string | null;
    accessToken?: string;
    isPasswordReset?: boolean;
  }
}