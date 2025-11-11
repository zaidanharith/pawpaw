"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import LoginGoogleButton from "@/components/auth/LoginGoogleButton";
import FaceLogin from "@/components/auth/FaceLogin";

function LoginContent() {
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
    <div className="flex flex-col gap-3 font-sans min-h-screen bg-[#FFF7EB]">
      <div className="mx-5 mt-3">
        <Link href="/">← Kembali ke Dashboard</Link>
      </div>

      {loginError && (
        <div className="mb-4 text-red-600 text-center">{loginError}</div>
      )}

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-[340px]">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
          <LoginForm setLoginError={setLoginError} />

          <div className="my-4 flex items-center">
            <hr className="grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">Atau</span>
            <hr className="grow border-gray-300" />
          </div>

          <LoginGoogleButton setLoginError={setLoginError} />

          {/* <FaceLogin /> */}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}