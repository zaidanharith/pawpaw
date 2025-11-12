"use client";

import { useState } from 'react';
import { signIn } from "next-auth/react";

const LoginForm = ({ setLoginError }: { setLoginError: (msg: string | null) => void }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<"Guru" | "Orang Tua" | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
            callbackUrl: "/dashboard"
        });


        if (result && !result.ok) {
            setLoginError("Username atau password salah.");
        }
    };

      return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="text-left">
        <label className="block font-semibold mb-1" htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full p-2 border border-[#f5bb00] rounded-lg outline-none focus:border-2 focus:border-[#f5bb00]"
        />
      </div>

      <div className="text-left">
        <label className="block font-semibold mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-[#f5bb00] rounded-lg outline-none focus:border-2 focus:border-[#f5bb00]"
        />
      </div>
      <div>
        <button
          type="button"
          className="text-sm underline cursor-pointer focus:outline-none"
        >
          Forgot Password?
        </button>
      </div>
      <button type="submit" className="bg-(--color-orange-light) hover:bg-(--color-orange-dark) cursor-pointer text-white font-bold py-2 rounded-lg">
        MASUK
      </button>
    </form>
    );
};

export default LoginForm;