import { Building2 } from 'lucide-react';

export default function PartnersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Mitra Dunia Industri (DUDI)</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tambah Mitra</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <p>Database Perusahaan Mitra PKL.</p>
            </div>
        </div>
    );
}
