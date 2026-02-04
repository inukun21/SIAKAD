'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 rounded-xl border border-red-100">
            <div className="p-4 bg-red-100 rounded-full text-red-600 mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Terjadi Kesalahan!</h2>
            <p className="text-gray-600 text-center max-w-md mb-6">
                Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
                Coba Lagi
            </button>
        </div>
    );
}
