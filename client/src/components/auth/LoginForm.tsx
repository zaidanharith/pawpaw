"use client";

import { useState } from 'react';
import { signIn } from "next-auth/react";

const LoginForm = ({ setLoginError }: { setLoginError: (msg: string | null) => void }) => {
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="border"
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="border"
                />
            </div>
            <button type="submit" className="bg-blue-300 cursor-pointer"> Login</button>
        </form>
    );
};

export default LoginForm;