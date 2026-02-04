'use client';

import { useState, useEffect } from 'react';
import { DoorOpen, Plus, Trash2, X } from 'lucide-react';
import { getAllRooms, createRoomAction, deleteRoomAction } from '@/lib/actions/rooms';
import { Room } from '@/lib/db/rooms';

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createRoomAction(formData);
        setShowModal(false);
        loadRooms();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Yakin ingin menghapus ruangan ini?')) {
            await deleteRoomAction(id);
            loadRooms();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Ruangan & Laboratorium</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Ruangan
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-lg ${room.type === 'Laboratorium' ? 'bg-green-100 text-green-600' :
                                            room.type === 'Bengkel' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        <DoorOpen size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                                            {room.code}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-600">
                                    <span className="font-medium">Jenis:</span> {room.type}
                                </p>
                                {room.capacity && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Kapasitas:</span> {room.capacity} orang
                                    </p>
                                )}
                                {room.facilities && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Fasilitas:</span> {room.facilities}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Ruangan</h2>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Kode Ruangan *</label>
                                <input
                                    type="text"
                                    name="code"
                                    required
                                    placeholder="R101"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nama Ruangan *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="Ruang Kelas 101"
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
                                    <option value="Kelas">Kelas</option>
                                    <option value="Laboratorium">Laboratorium</option>
                                    <option value="Bengkel">Bengkel</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    placeholder="32"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Fasilitas</label>
                                <textarea
                                    name="facilities"
                                    rows={2}
                                    placeholder="Proyektor, AC, Whiteboard"
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
