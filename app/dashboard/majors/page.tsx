'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GraduationCap, Plus, Trash2, X } from 'lucide-react';
import { getAllMajors, createMajorAction, deleteMajorAction } from '@/lib/actions/majors';
import { Major } from '@/lib/db/majors';

export default function MajorsPage() {
    const [majors, setMajors] = useState<Major[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadMajors = useCallback(async () => {
        setLoading(true);
        const data = await getAllMajors();
        setMajors(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadMajors();
    }, [loadMajors]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createMajorAction(formData);
        setShowModal(false);
        loadMajors();
    }, [loadMajors]);

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Yakin ingin menghapus jurusan ini?')) {
            await deleteMajorAction(id);
            loadMajors();
        }
    }, [loadMajors]);

    const majorsList = useMemo(() => (
        majors.map((major) => (
            <div key={major.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <GraduationCap size={24} />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-bold text-gray-800">{major.code}</h3>
                            </div>
                            <p className="text-sm font-medium text-gray-600">{major.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(major.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        title="Hapus"
                        aria-label="Hapus jurusan"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                {major.description && (
                    <p className="text-sm text-gray-500 mt-2">{major.description}</p>
                )}
            </div>
        ))
    ), [majors, handleDelete]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Program Keahlian (Jurusan)</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Jurusan
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : majors.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">Belum ada data jurusan. Klik "Tambah Jurusan" untuk menambahkan.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {majorsList}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Jurusan Baru</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Tutup modal"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">Kode Jurusan *</label>
                                <input
                                    id="code"
                                    type="text"
                                    name="code"
                                    required
                                    placeholder="Contoh: RPL"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
                                    maxLength={10}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Contoh: Rekayasa Perangkat Lunak"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    placeholder="Deskripsi singkat tentang program keahlian"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
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
