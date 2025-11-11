"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 bg-background/70 backdrop-blur-md z-50 max-w-screen">
            <Link href="/" className="flex items-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="KidConnect Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                    priority
                />
                <p className="font-bold text-xl text-gray-800">KidConnect</p>
            </Link>
            {status === "authenticated" && session?.user ? (
            <Link href="/dashboard" className='flex items-center gap-1'>
                <p className="font-semibold text-lg text-gray-800 truncate max-w-[168px]">
                    Halo, {session.user.name || "User"}!
                </p>
                <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                    <Image
                        src={session.user.image || "/default-profile.png"}
                        alt={session.user.name || "Profile"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        priority
                    />
                </div>
            </Link>
            ) : (
            <Link href="/login">
                <button className="px-4 py-2 rounded-xl bg-(--color-orange-light) font-semibold transition cursor-pointer text-foreground hover:bg-(--color-orange-dark)">
                Masuk
                </button>
            </Link>
            )}
        </nav>
    );
};

export default Navbar;