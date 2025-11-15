import React from 'react';

interface DeleteConfirmationProps {
    deleted: string;
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    deleted,
    open,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow p-6 w-full min-w-[300px]">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Hapus</h2>
                <p className="mb-4 text-gray-700">
                    Apakah Anda yakin ingin menghapus <strong>{deleted}</strong>?
                </p>
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition cursor-pointer">
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition shadow-md cursor-pointer">
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;