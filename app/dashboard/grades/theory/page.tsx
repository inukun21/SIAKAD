import { BookOpen } from 'lucide-react';

export default function GradingPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Input Nilai Teori</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center py-12">
                <div className="p-4 bg-blue-100 rounded-full text-blue-600 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Modul Penilaian</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Fitur input nilai, e-rapor, dan transkrip nilai akan tersedia pada update berikutnya.
                </p>
            </div>
        </div>
    );
}
