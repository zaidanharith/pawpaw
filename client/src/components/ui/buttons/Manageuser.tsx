export default function ButtonExample() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-4">
      {/* Button Kelola Siswa */}
      <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
        Kelola Siswa
      </button>

      {/* Button Kelola Guru */}
      <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
        Kelola Guru
      </button>

      {/* Button Kelola Admin */}
      <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors">
        Kelola Admin
      </button>
    </div>
  );
}