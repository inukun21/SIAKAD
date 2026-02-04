import { getAllStudents } from "@/lib/actions";
import { Users, GraduationCap, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
    const students = await getAllStudents();
    const totalStudents = students.length;
    // Unique majors
    const majors = new Set(students.map(s => s.major)).size;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Siswa</p>
                        <h3 className="text-2xl font-bold text-gray-800">{totalStudents}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Jurusan</p>
                        <h3 className="text-2xl font-bold text-gray-800">{majors}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Baru Ditambahkan</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {students.length > 0 ? 1 : 0} <span className="text-xs font-normal text-gray-400">(Dummy)</span>
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Siswa Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    {students.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">Belum ada data siswa.</div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Jurusan</th>
                                    <th className="px-6 py-3">Tanggal Daftar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.slice(0, 5).map((student) => (
                                    <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4">{student.class}</td>
                                        <td className="px-6 py-4">{student.major}</td>
                                        <td className="px-6 py-4">{new Date(student.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
