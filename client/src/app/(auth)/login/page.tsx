"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
    setLoading(false);

    if (result && !result.ok) {
      setLoginError("Login gagal. Email tidak terdaftar atau akun dinonaktifkan.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {loginError && (
          <div className="mb-4 text-red-600 text-center">{loginError}</div>
        )}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login dengan Google"}
        </button>
      </div>
    </div>
  );
}