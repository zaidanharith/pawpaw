"use client";

import { useState } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Image from "next/image";
<<<<<<< HEAD
=======
import BurgerButton from '../ui/BurgerButton';
import Sidebar from "./Sidebar";
>>>>>>> fd75aace72734087945a777ace3f6805675b1a77
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { data: session, status } = useSession();
<<<<<<< HEAD
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <nav className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 bg-background/70 backdrop-blur-md z-50 max-w-screen">
            {isDashboard && status === "authenticated" && session?.user ? (
                <div className="font-bold text-lg text-gray-800 truncate max-w-[288px]">
                    Halo, {session.user.name || "User"}
                </div>
            ) : (
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
            )}
            {status === "authenticated" && session?.user ? (
                <div className="flex items-center gap-2">
                    {!isDashboard && (
                        <p className="font-semibold text-lg text-gray-800 truncate max-w-[288px] invisible sm:visible">
                            Halo, {session.user.name || "User"}
                        </p>
                    )}
                    <Link href="/dashboard">
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden cursor-pointer">
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
                </div>
            ) : (
                <Link href="/login">
                    <button className="px-4 py-2 rounded-xl bg-(--color-orange-light) font-semibold transition cursor-pointer text-foreground hover:bg-(--color-orange-dark)">
                        Masuk
                    </button>
                </Link>
            )}
        </nav>
=======
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const pathname = usePathname();

    return (
        <>
            <nav className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 bg-background/70 backdrop-blur-md z-50 max-w-screen">
                <div className='flex items-center gap-2'>
                    {status === "authenticated" && session?.user ? (
                        <div className="flex items-center gap-2">
                            <BurgerButton onClick={() => setIsSidebarOpen(true)} />
                            <div className='h-10 w-px bg-gray-500'></div>
                        </div>
                    ) : null}
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
                </div>
                {status === "authenticated" && session?.user ? (
                    <Link href="/profile" className='flex items-center gap-2'>
                        <p className="font-semibold text-lg text-gray-800 truncate max-w-42 hidden sm:block">
                            {session.user.name || "User"}
                        </p>
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                            <Image
                                src={session.user.image || "/images/default-profile.png"}
                                alt={session.user.name || "Profile"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>
                    </Link>
                ) : (
                    (pathname === "/login") ? null : (
                        <Link href="/login">
                            <button className="px-4 py-2 rounded-xl bg-(--color-orange-light) font-semibold transition cursor-pointer text-foreground hover:bg-(--color-orange-dark)">
                                Masuk
                            </button>
                        </Link>
                    )
                )}
            </nav>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activeMenu={activeMenu}
                onSelectMenu={setActiveMenu}
            />
        </>
>>>>>>> fd75aace72734087945a777ace3f6805675b1a77
    );
};

export default Navbar;