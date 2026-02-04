import { getAllStudents } from "@/lib/actions";
import Link from "next/link";
import { Plus, FileSpreadsheet, QrCode } from "lucide-react";

export default async function StudentsPage() {
    const students = await getAllStudents();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/students/import"
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Import Excel
                    </Link>
                    <Link
                        href="/dashboard/students/create"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Siswa
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">NIS</th>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Kelas</th>
                                <th className="px-6 py-3">Jurusan</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3 text-center">QR Code</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                                        {student.nis}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">{student.class}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {student.major}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{student.email || "-"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Link
                                            href={`/dashboard/students/${student.id}/qr`}
                                            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                        >
                                            <QrCode className="w-4 h-4 mr-1" />
                                            Lihat QR
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                href={`/dashboard/students/${student.id}/edit`}
                                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                const { deleteStudentAction } = await import('@/lib/actions');
                                                await deleteStudentAction(student.id);
                                            }}>
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p>Belum ada data siswa. Klik "Tambah Siswa" untuk menambahkan.</p>
                </div>
            )}
        </div>
    );
}
