'use client';

import { useFormStatus } from "react-dom";
import { Student } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Save, User, GraduationCap, Users, Activity } from "lucide-react";
import { useState } from "react";

interface StudentFormProps {
    initialData?: Student;
    action: (formData: FormData) => Promise<void>;
    title: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={cn(
                "flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all",
                pending && "opacity-70 cursor-not-allowed"
            )}
        >
            <Save className="w-4 h-4 mr-2" />
            {pending ? "Menyimpan Data..." : "Simpan Data Siswa"}
        </button>
    );
}

const TABS = [
    { id: 'pribadi', label: 'Data Pribadi', icon: User },
    { id: 'akademik', label: 'Data Akademik', icon: GraduationCap },
    { id: 'keluarga', label: 'Data Keluarga', icon: Users },
    { id: 'pendukung', label: 'Data Pendukung', icon: Activity },
] as const;

type TabId = typeof TABS[number]['id'];

export default function StudentForm({ initialData, action, title }: StudentFormProps) {
    const [activeTab, setActiveTab] = useState<TabId>('pribadi');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href="/dashboard/students"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                {/* Tabs Header */}
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    isActive
                                        ? "border-blue-600 text-blue-600 bg-blue-50/50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 mr-2", isActive ? "text-blue-600" : "text-gray-400")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <form action={action} className="p-6">
                    {/* DATA PRIBADI */}
                    <div className={cn("space-y-6", activeTab !== 'pribadi' && "hidden")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Lengkap *</label>
                                <input type="text" name="name" required defaultValue={initialData?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nama Lengkap Siswa" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">NIS *</label>
                                <input type="text" name="nis" required defaultValue={initialData?.nis} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nomor Induk Siswa" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">NISN</label>
                                <input type="text" name="nisn" defaultValue={initialData?.nisn} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nomor Induk Siswa Nasional" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">NIK</label>
                                <input type="text" name="nik" defaultValue={initialData?.nik} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Nomor Induk Kependudukan" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tempat Lahir</label>
                                <input type="text" name="placeOfBirth" defaultValue={initialData?.placeOfBirth} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Kota Kelahiran" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                <input type="date" name="dateOfBirth" defaultValue={initialData?.dateOfBirth} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <select name="gender" defaultValue={initialData?.gender || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option value="" disabled>Pilih Jenis Kelamin</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Agama</label>
                                <select name="religion" defaultValue={initialData?.religion || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option value="" disabled>Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katholik">Katholik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                    <option value="Konghucu">Konghucu</option>
                                </select>
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                                <textarea name="address" rows={3} defaultValue={initialData?.address} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Alamat domisili saat ini" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" defaultValue={initialData?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                                <input type="tel" name="phone" defaultValue={initialData?.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* DATA AKADEMIK */}
                    <div className={cn("space-y-6", activeTab !== 'akademik' && "hidden")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jurusan (Kompetensi Keahlian) *</label>
                                <select name="major" required defaultValue={initialData?.major || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option value="" disabled>Pilih Jurusan</option>
                                    <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
                                    <option value="TKJ">TKJ (Teknik Komputer & Jaringan)</option>
                                    <option value="DKV">DKV (Desain Komunikasi Visual)</option>
                                    <option value="AK">AK (Akuntansi)</option>
                                    <option value="OTKP">OTKP (Perkantoran)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Kelas *</label>
                                <input type="text" name="class" required defaultValue={initialData?.class} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Contoh: X RPL 1" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tanggal Masuk</label>
                                <input type="date" name="dateOfEntry" defaultValue={initialData?.dateOfEntry} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jalur Masuk</label>
                                <select name="entryPath" defaultValue={initialData?.entryPath || ""} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                                    <option value="" disabled>Pilih Jalur</option>
                                    <option value="Reguler">Reguler</option>
                                    <option value="Prestasi">Prestasi</option>
                                    <option value="Afirmasi">Afirmasi</option>
                                    <option value="Pindahan">Pindahan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* DATA KELUARGA */}
                    <div className={cn("space-y-6", activeTab !== 'keluarga' && "hidden")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Ayah</label>
                                <input type="text" name="fatherName" defaultValue={initialData?.fatherName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Ibu</label>
                                <input type="text" name="motherName" defaultValue={initialData?.motherName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nama Wali (Opsional)</label>
                                <input type="text" name="guardianName" defaultValue={initialData?.guardianName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Pekerjaan Orang Tua/Wali</label>
                                <input type="text" name="parentJob" defaultValue={initialData?.parentJob} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">No. Telepon Orang Tua</label>
                                <input type="tel" name="parentPhone" defaultValue={initialData?.parentPhone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-gray-700">Alamat Orang Tua</label>
                                <textarea name="parentAddress" rows={2} defaultValue={initialData?.parentAddress} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* DATA PENDUKUNG */}
                    <div className={cn("space-y-6", activeTab !== 'pendukung' && "hidden")}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
                                <input type="number" name="height" defaultValue={initialData?.height} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Berat Badan (kg)</label>
                                <input type="number" name="weight" defaultValue={initialData?.weight} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jarak ke Sekolah (km)</label>
                                <input type="number" name="distanceToSchool" step="0.1" defaultValue={initialData?.distanceToSchool} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                            </div>
                            <div className="col-span-full space-y-2">
                                <label className="text-sm font-medium text-gray-700">Riwayat Penyakit</label>
                                <textarea name="diseaseHistory" rows={2} defaultValue={initialData?.diseaseHistory} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Tulis '-' jika tidak ada" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                        <div className="text-sm text-gray-400">
                            * Wajib diisi
                        </div>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
