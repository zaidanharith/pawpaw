import Image from "next/image";

const Gallery = () => {
  const photos = [
    { id: 1, src: "https://res.cloudinary.com/daaeu39vt/image/upload/v1763342257/uploads/KidConnect-lingkungan-TK-1-1763342250416.jpg", alt: "Foto Lingkungan TK" },
    { id: 2, src: "https://res.cloudinary.com/daaeu39vt/image/upload/v1763342493/uploads/KidConnect-anak-TK-1-1763342485653.jpg", alt: "Foto Anak-Anak" },
    { id: 3, src: "https://res.cloudinary.com/daaeu39vt/image/upload/v1763342562/uploads/KidConnect-anak-TK-2-1763342555269.jpg", alt: "Foto Anak-Anak" },
    { id: 4, src: "https://res.cloudinary.com/daaeu39vt/image/upload/v1763342438/uploads/KidConnect-lingkungan-TK-2-1763342430401.jpg", alt: "Foto Lingkungan TK" },
  ];

  return (
    <div className="bg-[#FFF9F3] py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Galeri Kegiatan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-xl overflow-hidden shadow-md bg-[#fd875e]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={300}
                height={200}
                className="object-cover w-full h-40"
              />
              <p className="text-center text-sm py-2 font-medium text-(--background-color)">
                {photo.alt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
