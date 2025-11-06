export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-white">Welcome to KidConnect.</h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">[INI HALAMAN UTAMA YA]</p>
      <a href="http://localhost:3000/dashboard" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Dashboard</a>
    </div>
  );
}
