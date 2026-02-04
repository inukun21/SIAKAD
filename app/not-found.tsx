import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
            <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-4">
                <FileQuestion size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-6">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
            <Link
                href="/dashboard"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
                Kembali ke Dashboard
            </Link>
        </div>
    );
}
