"use client";

import { signIn, useSession } from "next-auth/react";

const LoginGoogleButton = ({ setLoginError }: { setLoginError: (msg: string | null) => void }) => {
  const { status } = useSession();

  const handleGoogleLogin = async () => {
    setLoginError(null);
    const result = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
    if (result && !result.ok) {
      setLoginError("Email tidak terdaftar.");
    }
  };

  if (status === "authenticated") {
    return null;
  }

  return (
    <button onClick={handleGoogleLogin} className="bg-blue-400 cursor-pointer">Login dengan Google</button>
  );
};

export default LoginGoogleButton;