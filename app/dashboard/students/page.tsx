import Link from "next/link";
import { getAllStudents, deleteStudentAction } from "@/lib/actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default async function StudentsPage() {
    const students = await getAllStudents();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>
                <Link
                    href="/dashboard/students/create"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Siswa
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {students.length === 0 ? (
                        <div className="p-8 text-center bg-gray-50">
                            <p className="text-gray-500 mb-4">Belum ada data siswa.</p>
                            <Link href="/dashboard/students/create" className="text-blue-600 hover:underline">
                                Buat data siswa pertama
                            </Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">NIS</th>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="px-6 py-3">Kelas</th>
                                    <th className="px-6 py-3">Jurusan</th>
                                    <th className="px-6 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">{student.nis}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 text-gray-700">{student.class}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                                {student.major}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link
                                                    href={`/dashboard/students/${student.id}/edit`}
                                                    className="p-1.5 bg-yellow-50 text-yellow-600 rounded-md hover:bg-yellow-100 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>

                                                <form action={deleteStudentAction.bind(null, student.id)}>
                                                    <button
                                                        type="submit"
                                                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
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
