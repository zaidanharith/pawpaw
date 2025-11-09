import Navbar from '../components/layout/Navbar';
import FeatureCard from '../components/ui/FeatureCard';
import Link from 'next/link';
import Gallery from '../components/gallery/gallery';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen pt-24 items-center font-sans">
        <section id="hero" className="px-4">
          <h1 className="text-3xl text-center font-bold text-black">Tetap <span className="text-(--color-green-admin)">Terhubung</span> dengan Kegiatan Belajar Anak Anda</h1>
          <p className="mt-4 text-center">Pantau kehadiran, perkembangan, dan kegiatan anak, serta berkomunikasi langsung dengan guru.</p>
          <div className='mt-8'>
            <Gallery />
          </div>
        </section>
        <section id="feature" className="w-full my-5 px-4 py-7 bg-(--color-yellow-light)">
          <p className='text-center'>Beberapa hal yang Anda butuhkan untuk mendampingi perjalanan belajar anak.</p>
          <div className='mx-60 my-7'>
            <FeatureCard
              title="Live Report"
              description="Guru mengirimkan laporan kegiatan harian siswa lengkap dengan foto atau video, sehingga orang tua dapat memantau perkembangan anak secara langsung."
              imageAlt="Attendance"
            />
            <FeatureCard
              title="Direct Message"
              description="Berkomunikasi langsung dengan guru untuk mendukung perkembangan anak."
              imageAlt="Attendance"
            />
            <FeatureCard
              title="Announcement"
              description="Dapatkan pengumuman penting dari sekolah secara langsung dan real-time."
              imageAlt="Attendance"
            />
          </div>
          <p className='text-center'>Masih ada fitur lainnya yang bisa Anda coba. <a href="/login" className='font-semibold text-blue-500 hover:underline'>Login</a> untuk mulai menggunakan KidConnect sekarang!</p>
        </section>
        <section id="footer"className='px-4 py-7 flex flex-col'>
          <h1 className='text-center font-bold text-3xl mb-5'>Contact Us</h1>
          <p className='text-center'>Jika Anda memiliki pertanyaan atau masukan, jangan ragu untuk menghubungi kami melalui email di <a href="mailto:support@kidconnect.com" className='font-semibold text-blue-500 hover:underline'>kidconnect@gmail.com</a>.</p>
          <Link href="/" className="flex items-center justify-center my-7 gap-4">
            <div className="w-15 h-15 bg-gray-300 rounded-full"></div>
            <p className="font-bold text-4xl text-gray-800">KidConnect</p>
          </Link>
          <p className="text-sm text-gray-500 text-center">&copy;2025 KidConnect. All rights reserved.</p>
        </section>
      </main>
    </>
  );
}
