import React from "react";
import { MdEdit, MdDelete } from "react-icons/md"

interface Siswa {
  id: number;
  name: string;
  gender: string;
  tanggalLahir: string;
  alamat: string;
}

const genderColors: Record<string, string> = {
    LAKI: "#3e89c6",
    PEREMPUAN: "#b34a97"
};

interface TableSiswaProps {
    allSiswa: Siswa[];

    onEditSiswa: (siswa: Siswa) => void; 
    onDeleteSiswa?: (siswaId: number) => void;
    activeGender: string; 
}

const TableSiswa: React.FC<TableSiswaProps> = ({ allSiswa, onEditSiswa, onDeleteSiswa, activeGender }) => {
    
    return (
        <section className="bg-white rounded-lg shadow-lg p-0 border border-gray-100">
            <div className="bg-white rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-[#3f9065] text-gray-600 border-b">
                        <tr>
                            <th className="px-4 py-3 text-white text-left font-semibold whitespace-nowrap">Nama Lengkap</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Siswa</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Jenis Kelamin</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Tanggal Lahir</th>
                            <th className="px-4 py-3 text-white text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSiswa.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                    Tidak ada data siswa yang tersedia untuk role **{activeGender}**.
                                </td>
                            </tr>
                        ) : (
                            allSiswa.map((siswa) => (
                                <tr key={siswa.id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium whitespace-nowrap">{siswa.name}</td>
                                    <td className="px-4 py-3">{siswa.gender}</td>
                                    <td className="px-4 py-3">{siswa.tanggalLahir}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase`} 
                                            style={{
                                                backgroundColor: genderColors[siswa.gender.toUpperCase()] || genderColors.ADMIN, 
                                                color: siswa.gender.toUpperCase() === "LAKI" ? "#FFFFFF" : "#282828" 
                                            }}>
                                            {siswa.gender}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex justify-center sm:justify-start gap-3">
                                           <button 
                                            onClick={() => onEditSiswa(siswa)}
                                            className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-blue-500 hover:bg-blue-50"
                                            title="Edit Siswa"
                                        >
                                            <MdEdit className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => onDeleteSiswa && onDeleteSiswa(siswa.id)}
                                            className="cursor-pointer hover:scale-110 transition-transform p-1 rounded-full text-red-500 hover:bg-red-50"
                                            title="Delete Siswa"
                                        >
                                            <MdDelete className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default TableSiswa;