"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import LoginGoogleButton from "@/components/auth/LoginGoogleButton";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const error = searchParams.get("error");
    let message: string | null = null;
    if (error === "AccessDenied") {
      message = "Login gagal. Email tidak terdaftar atau akun dinonaktifkan.";
    } else if (error) {
      message = "Login gagal.";
    }
    if (loginError !== message) {
      setLoginError(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (status === "authenticated") {
    return null;
  }

  return (
      <div>
        <Link href="/">← Kembali ke Dashboard</Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {loginError && (
          <div className="mb-4 text-red-600 text-center">{loginError}</div>
        )}
        <LoginForm setLoginError={setLoginError} />
        <LoginGoogleButton setLoginError={setLoginError} />
      </div>
  );
}