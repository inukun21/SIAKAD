import { UserCheck, Mail, Phone } from 'lucide-react';

export default function TeachersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Data Guru & Staf</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tambah Guru</button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Nama Guru</th>
                            <th className="px-6 py-3">NIP/NUPTK</th>
                            <th className="px-6 py-3">Jabatan</th>
                            <th className="px-6 py-3">Kontak</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-xs font-bold">G{i}</div>
                                    Guru {i}
                                </td>
                                <td className="px-6 py-4 font-mono">19800101200501100{i}</td>
                                <td className="px-6 py-4">Guru Mapel</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="flex items-center text-xs"><Mail size={12} className="mr-1" /> guru{i}@smk.id</span>
                                        <span className="flex items-center text-xs"><Phone size={12} className="mr-1" /> 08123456789</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Aktif</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
