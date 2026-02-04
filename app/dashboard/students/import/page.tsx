'use client';

import { useState } from 'react';
import { read, utils } from 'xlsx';
import { bulkCreateStudents } from '@/lib/actions';
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = read(e.target?.result, { type: 'array' });
                const sheetName = wb.SheetNames[0];
                const sheet = wb.Sheets[sheetName];
                const jsonData = utils.sheet_to_json(sheet);
                setData(jsonData);
            } catch (err) {
                setError("Gagal membaca file. Pastikan format Excel benar.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        if (data.length === 0) return;
        setLoading(true);
        try {
            await bulkCreateStudents(data);
            alert('Data berhasil diimport!');
            router.push('/dashboard/students');
        } catch (err) {
            setError("Gagal menyimpan data ke database.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/students" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Import Data Siswa</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center space-y-4 bg-gray-50">
                    <div className="p-3 bg-green-100 rounded-full text-green-600">
                        <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-gray-700 font-medium">Upload File Excel (.xlsx / .csv)</p>
                        <p className="text-sm text-gray-500 mb-4">Pastikan kolom: nis, name, class, major, email, phone</p>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    mx-auto max-w-xs
                "
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center p-4 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {data.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Preview Data ({data.length} baris)</h3>
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Mengimport...' : 'Simpan ke Database'}
                            {!loading && <Check className="w-4 h-4 ml-2" />}
                        </button>
                    </div>
                    <div className="overflow-x-auto max-h-[400px]">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-50 text-gray-700 sticky top-0">
                                <tr>
                                    {Object.keys(data[0] || {}).map((key) => (
                                        <th key={key} className="px-6 py-3 border-b">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, i) => (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        {Object.values(row).map((cell: any, j) => (
                                            <td key={j} className="px-6 py-3">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
