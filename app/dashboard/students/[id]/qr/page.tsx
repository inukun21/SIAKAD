import { getStudent } from "@/lib/actions";
import { notFound } from "next/navigation";
import StudentQRCode from "@/components/StudentQRCode";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StudentQRPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/students"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">QR Code Siswa</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Student Info */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Siswa</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-600">NIS</label>
                                <p className="text-lg font-mono font-semibold text-blue-600">{student.nis}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Nama Lengkap</label>
                                <p className="text-lg font-semibold text-gray-900">{student.name}</p>
                            </div>

                            {student.nisn && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">NISN</label>
                                    <p className="text-gray-900">{student.nisn}</p>
                                </div>
                            )}

                            {student.nik && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">NIK</label>
                                    <p className="text-gray-900">{student.nik}</p>
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-600">Kelas</label>
                                <p className="text-gray-900">{student.class}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Jurusan</label>
                                <p>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {student.major}
                                    </span>
                                </p>
                            </div>

                            {student.dateOfBirth && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Tanggal Lahir</label>
                                    <p className="text-gray-900">
                                        {student.placeOfBirth && `${student.placeOfBirth}, `}
                                        {new Date(student.dateOfBirth).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}

                            {student.gender && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Jenis Kelamin</label>
                                    <p className="text-gray-900">{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                </div>
                            )}

                            {student.phone && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Telepon</label>
                                    <p className="text-gray-900">{student.phone}</p>
                                </div>
                            )}

                            {student.email && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-gray-900">{student.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl" id="qr-container">
                            <StudentQRCode student={student} size={300} />
                        </div>

                        <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg print:hidden">
                            <p className="font-medium mb-1">📱 Cara Menggunakan QR Code:</p>
                            <p className="text-xs">Scan QR code ini untuk melihat data lengkap siswa</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Preview */}
            <div className="bg-gray-50 rounded-xl p-6 print:hidden">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Data dalam QR Code:</h3>
                <pre className="text-xs bg-white p-4 rounded-lg overflow-x-auto border border-gray-200">
                    {JSON.stringify({
                        id: student.id,
                        nis: student.nis,
                        nisn: student.nisn,
                        nik: student.nik,
                        name: student.name,
                        class: student.class,
                        major: student.major,
                        dateOfBirth: student.dateOfBirth,
                        placeOfBirth: student.placeOfBirth,
                        gender: student.gender,
                        phone: student.phone,
                        email: student.email,
                        address: student.address,
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
}
