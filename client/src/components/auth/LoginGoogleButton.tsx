"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

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
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center cursor-pointer justify-center w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-semibold" >
        <Image
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
        Masuk dengan Google
      </button>
    </div>
  );
};

export default LoginGoogleButton;