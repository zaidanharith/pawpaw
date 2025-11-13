"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import LoginGoogleButton from "@/components/auth/LoginGoogleButton";
import { MdArrowBack } from "react-icons/md";
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
    <section className="bg-white rounded-xl shadow p-7">
      <Link href="/" className="flex justify-center items-center gap-2 mb-7 text-blue-500 underline font-semibold">
        <MdArrowBack size={20} />
        <p>Kembali ke Beranda</p>
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6  text-center">Login</h1>

      {loginError && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center font-semibold animate-fade-in">
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
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}