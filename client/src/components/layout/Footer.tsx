import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='px-4 py-7 flex flex-col font-sans'>
      <h1 className='text-center font-bold text-3xl mb-5'>Contact Us</h1>
      <p className='text-center'>
        Jika Anda memiliki pertanyaan atau masukan, jangan ragu untuk menghubungi kami melalui email di{" "}
        <a href="mailto:kidconnect.paw@gmail.com" className='font-semibold text-blue-500 hover:underline'>
          kidconnect.paw@gmail.com
        </a>.
      </p>
      <Link href="/" className="flex items-center justify-center my-7 gap-4">
        <Image
          src="/logo.svg"
          alt="KidConnect Logo"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
        <p className="font-bold text-4xl text-gray-800">KidConnect</p>
      </Link>
      <div className="flex flex-wrap justify-center gap-4 my-2">
        <Link href="/privacy-policy" className="text-sm text-blue-500 hover:underline">
          Privacy Policy
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="/terms-of-service" className="text-sm text-blue-500 hover:underline">
          Terms of Service
        </Link>
      </div>
      <p className="text-sm text-gray-500 text-center">&copy;2025 KidConnect. All rights reserved.</p>
    </footer>
  );
}