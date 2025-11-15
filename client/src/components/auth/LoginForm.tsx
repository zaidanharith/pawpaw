"use client";

import { useEffect, useState } from 'react';
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoginGoogleButton from './LoginGoogleButton';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const searchParams = useSearchParams();
    const [loginError, setLoginError] = useState<string | null>(null);
      
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

    return (
      <section className='bg-white rounded-xl shadow p-7 w-full'>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login Form</h1>
        {loginError && (
          <div className="mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center font-semibold animate-fade-in">
              <span className="block sm:inline">{loginError}</span>
            </div>
          </div>
        )}

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
            Masuk
          </button>
        </form>

        <div className="my-4 flex items-center">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">Atau</span>
          <hr className="grow border-gray-300" />
        </div>

        <LoginGoogleButton setLoginError={setLoginError} />

        <div className='mt-5'>
          <p className='text-center text-sm font-semibold'>Belum Punya Akun? <a href="mailto:kidconnect.paw@gmail.com" className="text-blue-600 hover:underline">Hubungi Administrator</a></p>
        </div>
        
      </section>
  );
};

export default LoginForm;