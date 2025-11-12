"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import LoginGoogleButton from "@/components/auth/LoginGoogleButton";
// import FaceLogin from "@/components/auth/FaceLogin";

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
    <div className="flex flex-col min-h-screen bg-[#FFF7EB] font-sans">
      <div className="mx-auto w-full max-w-md mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow hover:bg-gray-50 transition text-gray-700 font-medium"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>

          {loginError && (
            <div className="mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center animate-fade-in">
                <span className="block sm:inline">{loginError}</span>
              </div>
            </div>
          )}

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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}