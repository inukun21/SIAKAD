import { Construction } from 'lucide-react';

export default function UnderConstructionPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 mb-4">
                <Construction size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sedang Dalam Pengembangan</h2>
            <p className="text-gray-600 mb-6 max-w-md">Modul ini sedang disiapkan untuk update berikutnya. Silakan kembali lagi nanti.</p>
        </div>
    );
}
