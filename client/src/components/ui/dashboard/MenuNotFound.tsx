import React from 'react';
import Link from 'next/link';

interface MenuNotFoundProps {
    page: string;
}

const MenuNotFound: React.FC<MenuNotFoundProps> = ({ page }) => {
    return (
        <section className="bg-white rounded-xl shadow p-5">
            <div className="text-center flex flex-col gap-4">
                <p>Menu <strong>{page}</strong> tidak ditemukan.</p>
                <Link href="/dashboard" className="text-blue-500 hover:underline">Kembali ke Dashboard</Link>
            </div>
        </section>
    );
};

export default MenuNotFound;