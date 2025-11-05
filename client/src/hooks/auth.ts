"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return {
    session,
    user: session?.user,
    accessToken: session?.accessToken,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout
  };
}

export function useRequireAuth(redirectUrl = "/auth/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && !isAuthenticated) {
    router.push(redirectUrl);
  }

  return { isAuthenticated, isLoading };
}

export function useRequireRole(allowedRoles: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (!isLoading && isAuthenticated && user) {
    if (!allowedRoles.includes(user.role)) {
      router.push("/dashboard");
    }
  }

  return { hasAccess: user ? allowedRoles.includes(user.role) : false };
}