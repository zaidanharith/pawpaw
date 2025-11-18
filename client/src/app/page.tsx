import Navbar from '@/components/layout/Navbar';
import FeatureCard from '../components/ui/FeatureCard';
import Gallery from '@/components/ui/Gallery';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen items-center font-sans">
        <section id="hero" className="px-4">
          <h1 className="text-3xl text-center font-bold text-black">
            Tetap <span className="text-(--color-green-admin)">Terhubung</span> dengan Kegiatan Belajar Anak Anda
          </h1>
          <p className="mt-4 text-center">
            Pantau kehadiran, perkembangan, dan kegiatan anak, serta berkomunikasi langsung dengan guru.
          </p>
          <div>
            <Gallery />
          </div>
        </section>
        <section id="feature" className="w-full my-5 px-4 py-7 bg-(--color-yellow-light)">
          <p className='text-center max-w-7xl mx-auto'>Beberapa hal yang Anda butuhkan untuk mendampingi perjalanan belajar anak.</p>
          <div className='my-7 max-w-7xl mx-auto flex flex-col md:flex-row gap-5 justify-center'>
            <FeatureCard
              title="Live Report"
              description="Guru mengirimkan laporan kegiatan harian siswa lengkap dengan foto atau video, sehingga orang tua dapat memantau perkembangan anak secara langsung."
              imageAlt="Attendance"
            />
            <FeatureCard
              title="Live Chat"
              description="Berkomunikasi langsung dengan guru untuk mendukung perkembangan anak."
              imageAlt="Attendance"
            />
            <FeatureCard
              title="Announcement"
              description="Dapatkan pengumuman penting dari sekolah secara langsung dan real-time."
              imageAlt="Attendance"
            />
          </div>
          <p className='text-center max-w-7xl mx-auto'>
            Masih ada fitur lainnya yang bisa Anda coba. <a href="/login" className='font-semibold text-blue-500 hover:underline'>Login</a> untuk mulai menggunakan KidConnect sekarang!
          </p>
        </section>
        <section id="contact" className="px-4 py-7 max-w-7xl mx-auto">
          <h1 className='text-center font-bold text-3xl mb-5'>Tech Stack</h1>
          <p className='text-center'>
            KidConnect dibangun menggunakan teknologi modern terkemuka.
          </p>
          <div className='flex justify-center mt-5 gap-7 items-center flex-wrap'>
            <Image src="/nodejs.svg" alt="Tech Stack" width={100} height={100} />
            <Image src="/expressjs.png" alt="Tech Stack" width={60} height={60} />
            <Image src="/mongodb.png" alt="Tech Stack" width={60} height={60} />
            <Image src="/cloudinary.png" alt="Tech Stack" width={60} height={60} />
            <Image src="/google.svg" alt="Tech Stack" width={60} height={60} />
            <Image src="/next.svg" alt="Tech Stack" width={150} height={150} />
            <Image src="/tailwindcss.svg" alt="Tech Stack" width={60} height={60} />
            <Image src="/vercel.png" alt="Tech Stack" width={60} height={60} />
          </div>
        </section>
      </main>
    </>
  );
}