import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='px-4 py-7 flex flex-col font-sans bg-(--color-yellow-light)'>
      <Link href="/" className="flex items-center justify-center mb-3 gap-2">
        <Image
          src="/logo.svg"
          alt="KidConnect Logo"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
        <p className="font-bold text-3xl text-gray-800">KidConnect</p>
      </Link>
      <div className="flex flex-wrap justify-center gap-2 my-2">
        <Link href="/privacy-policy" className="text-sm font-semibold text-blue-600 hover:underline">
          Privacy Policy
        </Link>
        <span className="text-gray-500">|</span>
        <Link href="/terms-of-service" className="text-sm font-semibold text-blue-600 hover:underline">
          Terms of Service
        </Link>
      </div>
      <p className="text-sm text-gray-500 text-center">&copy;2025 KidConnect. All rights reserved.</p>
    </footer>
  );
}