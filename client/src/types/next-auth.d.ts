import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username?: string;
    role?: "ADMIN" | "TEACHER" | "PARENT";
    accessToken?: string;
    isPasswordReset?: boolean;
    loginErrorMessage?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      role?: "ADMIN" | "TEACHER" | "PARENT";
      isPasswordReset?: boolean;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    role?: "ADMIN" | "TEACHER" | "PARENT";
    accessToken?: string;
    isPasswordReset?: boolean;
  }
}