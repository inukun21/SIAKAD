'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Users, Plus, Trash2, X } from 'lucide-react';
import { getAllClasses, createClassAction, deleteClassAction } from '@/lib/actions/classes';
import { getAllMajors } from '@/lib/actions/majors';
import { Class } from '@/lib/db/classes';
import { Major } from '@/lib/db/majors';

export default function ClassesPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        const [classesData, majorsData] = await Promise.all([
            getAllClasses(),
            getAllMajors()
        ]);
        setClasses(classesData);
        setMajors(majorsData);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createClassAction(formData);
        setShowModal(false);
        loadData();
    }, [loadData]);

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Yakin ingin menghapus kelas ini?')) {
            await deleteClassAction(id);
            loadData();
        }
    }, [loadData]);

    // Memoize major lookup
    const majorMap = useMemo(() => {
        return new Map(majors.map(m => [m.id, m.code]));
    }, [majors]);

    const getMajorName = useCallback((majorId: string) => {
        return majorMap.get(majorId) || majorId;
    }, [majorMap]);

    const classesList = useMemo(() => (
        classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{cls.name}</h3>
                            <span className="text-xs font-semibold bg-blue-100 px-2 py-1 rounded text-blue-600">
                                {getMajorName(cls.majorId)}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(cls.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        aria-label="Hapus kelas"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                {cls.homeroom && (
                    <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Wali Kelas:</span> {cls.homeroom}
                    </p>
                )}
                {cls.capacity && (
                    <p className="text-sm text-gray-500">Kapasitas: {cls.capacity} siswa</p>
                )}
            </div>
        ))
    ), [classes, getMajorName, handleDelete]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Data Kelas & Wali Kelas</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kelas
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : classes.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-500">Belum ada data kelas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classesList}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Kelas Baru</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full" aria-label="Tutup modal">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Kelas *</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Contoh: X RPL 1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="majorId" className="block text-sm font-medium text-gray-700">Jurusan *</label>
                                <select
                                    id="majorId"
                                    name="majorId"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Pilih Jurusan</option>
                                    {majors.map(major => (
                                        <option key={major.id} value={major.id}>{major.code} - {major.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="homeroom" className="block text-sm font-medium text-gray-700">Wali Kelas</label>
                                <input
                                    id="homeroom"
                                    type="text"
                                    name="homeroom"
                                    placeholder="Nama Guru Wali Kelas"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Kapasitas</label>
                                <input
                                    id="capacity"
                                    type="number"
                                    name="capacity"
                                    placeholder="32"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">Tahun Akademik</label>
                                <input
                                    id="academicYear"
                                    type="text"
                                    name="academicYear"
                                    placeholder="2024/2025"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
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
