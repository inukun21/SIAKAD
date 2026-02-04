import { CalendarDays, Check, X, Clock } from 'lucide-react';

export default function AttendancePage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Presensi Harian</h1>
                <div className="flex space-x-2">
                    <input type="date" className="px-3 py-2 border rounded-lg text-sm" />
                    <select className="px-3 py-2 border rounded-lg text-sm">
                        <option>X RPL 1</option>
                        <option>XI TKJ 2</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex space-x-8 mb-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">30</p>
                        <p className="text-sm text-gray-500">Hadir</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-500">1</p>
                        <p className="text-sm text-gray-500">Izin</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">1</p>
                        <p className="text-sm text-gray-500">Alpha</p>
                    </div>
                </div>

                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Nama Siswa</th>
                            <th className="px-6 py-3">Status Kehadiran</th>
                            <th className="px-6 py-3">Jam Masuk</th>
                            <th className="px-6 py-3">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Siswa {i}</td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button className="p-1 bg-green-100 text-green-600 rounded"><Check size={16} /></button>
                                        <button className="p-1 bg-yellow-100 text-yellow-600 rounded"><Clock size={16} /></button>
                                        <button className="p-1 bg-red-100 text-red-600 rounded"><X size={16} /></button>
                                    </div>
                                </td>
                                <td className="px-6 py-4">07:00</td>
                                <td className="px-6 py-4 text-gray-400">-</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
