'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import Link from 'next/link';

// Dummy data for validation
const MOCK_DOCUMENTS = [
    { id: 1, student: "Ahmad Rizki", nis: "10293", docType: "Kartu Keluarga", status: "pending", date: "2024-02-01" },
    { id: 2, student: "Siti Aminah", nis: "10294", docType: "Ijazah SMP", status: "verified", date: "2024-01-28" },
    { id: 3, student: "Budi Santoso", nis: "10295", docType: "Akte Kelahiran", status: "rejected", date: "2024-02-02" },
];

export default function ValidationPage() {
    const [docs, setDocs] = useState(MOCK_DOCUMENTS);

    const handleVerify = (id: number, status: string) => {
        setDocs(docs.map(d => d.id === id ? { ...d, status } : d));
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Validasi Dokumen Siswa</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">Antrian Dokumen</h2>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Manual
                    </button>
                </div>

                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Siswa</th>
                            <th className="px-6 py-3">Jenis Dokumen</th>
                            <th className="px-6 py-3">Tanggal Upload</th>
                            <th className="px-6 py-3 text-center">Status</th>
                            <th className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map((doc) => (
                            <tr key={doc.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{doc.student}</div>
                                    <div className="text-xs text-gray-400">NIS: {doc.nis}</div>
                                </td>
                                <td className="px-6 py-4 flex items-center">
                                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                                    {doc.docType}
                                </td>
                                <td className="px-6 py-4">{doc.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                                            doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                        {doc.status === 'verified' ? 'Terverifikasi' :
                                            doc.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="Lihat">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {doc.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleVerify(doc.id, 'verified')}
                                                    className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                                    title="Setujui"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleVerify(doc.id, 'rejected')}
                                                    className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                                    title="Tolak"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
