'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, X } from 'lucide-react';
import { getAllSubjects, createSubjectAction, deleteSubjectAction } from '@/lib/actions/subjects';
import { Subject } from '@/lib/db/subjects';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        setLoading(true);
        const data = await getAllSubjects();
        setSubjects(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createSubjectAction(formData);
        setShowModal(false);
        loadSubjects();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus mata pelajaran ini?')) {
            await deleteSubjectAction(id);
            loadSubjects();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Mata Pelajaran</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Mapel
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Kode</th>
                                <th className="px-6 py-3">Nama Mata Pelajaran</th>
                                <th className="px-6 py-3">Jenis</th>
                                <th className="px-6 py-3">SKS</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono font-semibold text-blue-600">{subject.code}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{subject.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${subject.type === 'Produktif' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {subject.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{subject.credits || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(subject.id)}
                                            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Mata Pelajaran</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Kode Mapel *</label>
                                <input
                                    type="text"
                                    name="code"
                                    required
                                    placeholder="MTK"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Matematika"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Jenis *</label>
                                <select
                                    name="type"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Pilih Jenis</option>
                                    <option value="Umum">Umum</option>
                                    <option value="Produktif">Produktif</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">SKS</label>
                                <input
                                    type="number"
                                    name="credits"
                                    placeholder="4"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                    Batal
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
