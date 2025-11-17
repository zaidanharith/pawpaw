import React from 'react';
import Image from 'next/image';
import Link from 'next/dist/client/link';

interface FeatureCardProps {
    title: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
    imageSrc = "https://res.cloudinary.com/daaeu39vt/image/upload/v1759160604/uploads/Makan_Siang-1759160602584.jpg",
    imageAlt = 'Feature image',
}) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col w-full md:w-1/3">
        <div className="w-full h-40 mb-4 relative">
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover rounded-xl"
            />
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Link href="/dashboard" className="mt-4 font-medium inline-block text-blue-500 hover:underline">
            Coba Fitur Ini
        </Link>
    </div>
);

export default FeatureCard;
