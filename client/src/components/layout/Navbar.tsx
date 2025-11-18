"use client";

import Link from 'next/link';
import { useSession } from "next-auth/react";
import Image from "next/image";
import BurgerButton from '../ui/BurgerButton';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavbarProps {
    setIsSidebarOpen?: (isOpen: boolean) => void;
}

const Navbar = ({ setIsSidebarOpen }: NavbarProps) => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [profilePicture, setProfilePicture] = useState<string>("/images/default-profile.png");

    // Minimal type to avoid `any` casts for `session.user`
    type SessionUser = {
        name?: string | null;
        image?: string | null;
        picture?: string | null;
    };

    // Fetch profile picture dari API
    useEffect(() => {
        const fetchProfilePicture = async () => {
            if (session?.accessToken) {
                try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL;
                    const response = await fetch(`${API_URL}/auth/profile`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const userData = data.data || data;
                        
                        if (userData.picture) {
                            console.log("🖼️ Profile picture from API:", userData.picture);
                            setProfilePicture(userData.picture);
                            return;
                        }
                    }
                } catch (error) {
                    console.error("❌ Error fetching profile picture from API:", error);
                }
            }

            // Fallback ke session picture
            if (session?.user) {
                const u = session.user as SessionUser;
                const userPicture = u.picture || u.image || "/images/default-profile.png";
                console.log("🖼️ Profile picture from session:", userPicture);
                setProfilePicture(userPicture);
            }
        };

        if (status === "authenticated") {
            fetchProfilePicture();
        }
    }, [session, status]);

    // Re-fetch ketika ada perubahan session (triggered by update())
    useEffect(() => {
        if (session?.user) {
            const u = session.user as SessionUser;
            const userPicture = u.picture || u.image;
            if (userPicture && userPicture !== profilePicture) {
                console.log("🔄 Session updated, new picture:", userPicture);
                // Avoid synchronous setState directly in effect body to satisfy ESLint rule
                const t = setTimeout(() => {
                    setProfilePicture(userPicture);
                }, 0);
                return () => clearTimeout(t);
            }
        }
    }, [session?.user, profilePicture]);

    const handleImageError = () => {
        console.warn("⚠️ Failed to load profile picture, using default");
        setProfilePicture("/images/default-profile.png");
    };

    return (
        <nav className="px-4 py-3 flex justify-between items-center font-sans fixed inset-x-0 top-0 bg-background/70 backdrop-blur-md z-50">
            <div className='flex items-center justify-between w-full max-w-7xl mx-auto'>
                <div className='flex items-center gap-2'>
                    {(pathname?.startsWith("/dashboard")) && (status === "authenticated") && session?.user ? (
                        <div className="flex items-center gap-2 md:hidden">
                            <BurgerButton onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)} />
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
                    <Link href="/dashboard" className='flex items-center gap-2'>
                        <p className="font-semibold text-lg text-gray-800 truncate max-w-42 hidden sm:block">
                            {session.user.name || "User"}
                        </p>
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border-2 border-gray-200">
                            <Image
                                src={profilePicture}
                                alt={session.user.name || "Profile"}
                                width={40}
                                height={40}
                                className="rounded-full object-cover w-full h-full"
                                priority
                                key={profilePicture} // Force re-render saat picture berubah
                                onError={handleImageError}
                                unoptimized={profilePicture.startsWith('http')} // Untuk URL eksternal (Cloudinary)
                            />
                        </div>
                    </Link>
                ) : (
                    (pathname === "/login") ? (
                        <Link href="/">
                            <button className="px-4 py-2 rounded-xl bg-(--color-orange-light) font-semibold transition cursor-pointer text-background hover:bg-(--color-orange-dark)">
                                Beranda
                            </button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <button className="px-4 py-2 rounded-xl bg-(--color-orange-light) font-semibold transition cursor-pointer text-background hover:bg-(--color-orange-dark)">
                                Masuk
                            </button>
                        </Link>
                    )
                )}
            </div>
        </nav>
    );
};

export default Navbar;