import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: "ADMIN" | "TEACHER" | "PARENT";
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    accessToken?: string;
    loginErrorMessage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    role: "ADMIN" | "TEACHER" | "PARENT";
    accessToken?: string;
  }
}