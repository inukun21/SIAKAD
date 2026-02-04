'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Trash2, X, CheckCircle } from 'lucide-react';
import { getAllAcademicYears, createAcademicYearAction, deleteAcademicYearAction, setActiveAcademicYearAction } from '@/lib/actions/academic-years';
import { AcademicYear } from '@/lib/db/academic-years';

export default function AcademicYearsPage() {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAcademicYears();
    }, []);

    const loadAcademicYears = async () => {
        setLoading(true);
        const data = await getAllAcademicYears();
        setAcademicYears(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createAcademicYearAction(formData);
        setShowModal(false);
        loadAcademicYears();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus tahun akademik ini?')) {
            await deleteAcademicYearAction(id);
            loadAcademicYears();
        }
    };

    const handleSetActive = async (id: string) => {
        await setActiveAcademicYearAction(id);
        loadAcademicYears();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Tahun Akademik</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tahun Akademik
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {academicYears.map((ay) => (
                        <div key={ay.id} className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all ${ay.isActive ? 'border-green-500' : 'border-gray-100'
                            }`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${ay.isActive ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        <CalendarDays size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{ay.year}</h3>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${ay.semester === 'Ganjil' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            Semester {ay.semester}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(ay.id)}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mb-4">
                                <p>
                                    <span className="font-medium">Mulai:</span> {new Date(ay.startDate).toLocaleDateString('id-ID')}
                                </p>
                                <p>
                                    <span className="font-medium">Selesai:</span> {new Date(ay.endDate).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            {ay.isActive ? (
                                <div className="flex items-center text-green-600 text-sm font-semibold">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Tahun Akademik Aktif
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSetActive(ay.id)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Aktifkan Tahun Ini
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Tahun Akademik</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Tahun Akademik *</label>
                                <input
                                    type="text"
                                    name="year"
                                    required
                                    placeholder="2024/2025"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Semester *</label>
                                <select
                                    name="semester"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Pilih Semester</option>
                                    <option value="Ganjil">Ganjil</option>
                                    <option value="Genap">Genap</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai *</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Tanggal Selesai *</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    required
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
