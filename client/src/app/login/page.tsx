"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import FaceLogin from "@/components/auth/FaceLogin";

function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const [activeForm, setActiveForm] = useState<"login" | "face">("login");

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "authenticated") {
    return null;
  }

  return (
    <section className="px-4 flex flex-col items-center gap-3">
      <div className="bg-(--color-orange-light) py-2 px-2 rounded-xl flex gap-2">
        <button
          className={`px-2 py-1 rounded-lg font-semibold cursor-pointer border border-background text-background hover:bg-background hover:text-foreground transition duration-200 ${activeForm === "login" ? "bg-background text-foreground" : ""}`}
          onClick={() => setActiveForm("login")}
        >
          Form atau Google
        </button>
        <button
          className={`px-2 py-1 rounded-lg font-semibold cursor-pointer border border-background text-background hover:bg-background hover:text-foreground transition duration-200 ${activeForm === "face" ? "bg-background text-foreground" : ""}`}
          onClick={() => setActiveForm("face")}
        >
          Face Recognition
        </button>
      </div>
      {activeForm === "login" ? <LoginForm /> : <FaceLogin />}
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