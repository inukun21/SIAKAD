'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, User, QrCode } from 'lucide-react';
import QRScanner from '@/components/QRScanner';
import { createAttendanceAction } from '@/lib/actions/attendance';

export default function OnlineAttendancePage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scannedData, setScannedData] = useState<any>(null);
    const [attendanceStatus, setAttendanceStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleScanSuccess = useCallback(async (decodedText: string) => {
        try {
            // Parse QR code data
            const studentData = JSON.parse(decodedText);
            setScannedData(studentData);

            // Create attendance record
            const formData = new FormData();
            formData.append('studentId', studentData.id);
            formData.append('date', new Date().toISOString().split('T')[0]);
            formData.append('status', 'Hadir');
            formData.append('time', new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));

            await createAttendanceAction(formData);

            // Update UI
            setAttendanceStatus('success');
            setMessage(`Absensi berhasil untuk ${studentData.name}`);

            // Add to recent attendance
            setRecentAttendance(prev => [{
                ...studentData,
                time: new Date().toLocaleTimeString('id-ID'),
                status: 'Hadir'
            }, ...prev.slice(0, 9)]);

            // Reset after 3 seconds
            setTimeout(() => {
                setAttendanceStatus('idle');
                setScannedData(null);
                setMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error processing QR code:', error);
            setAttendanceStatus('error');
            setMessage('QR Code tidak valid atau terjadi kesalahan');

            setTimeout(() => {
                setAttendanceStatus('idle');
                setMessage('');
            }, 3000);
        }
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Clock */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Absensi Online</h1>
                    <p className="text-gray-600 mb-6">Scan QR Code untuk melakukan absensi</p>

                    {/* Real-time Clock */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Clock className="w-6 h-6" />
                            <span className="text-sm font-medium">Waktu Saat Ini</span>
                        </div>
                        <div className="text-5xl font-bold mb-2 font-mono" suppressHydrationWarning>
                            {formatTime(currentTime)}
                        </div>
                        <div className="flex items-center justify-center gap-2 text-blue-100" suppressHydrationWarning>
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(currentTime)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* QR Scanner Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <QrCode className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">QR Scanner</h2>
                                <p className="text-sm text-gray-600">Arahkan kamera ke QR Code siswa</p>
                            </div>
                        </div>

                        <QRScanner onScanSuccess={handleScanSuccess} />

                        {/* Status Message */}
                        {attendanceStatus !== 'idle' && (
                            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${attendanceStatus === 'success'
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                                }`}>
                                {attendanceStatus === 'success' ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                )}
                                <div>
                                    <p className={`font-semibold ${attendanceStatus === 'success' ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        {attendanceStatus === 'success' ? 'Berhasil!' : 'Gagal!'}
                                    </p>
                                    <p className={`text-sm ${attendanceStatus === 'success' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {message}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Scanned Student Info */}
                        {scannedData && attendanceStatus === 'success' && (
                            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <User className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900">Data Siswa</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">NIS:</span>
                                        <span className="font-mono font-semibold text-blue-700">{scannedData.nis}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Nama:</span>
                                        <span className="font-semibold text-gray-900">{scannedData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kelas:</span>
                                        <span className="text-gray-900">{scannedData.class}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Jurusan:</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                            {scannedData.major}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Absensi Terbaru</h2>

                        {recentAttendance.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Belum ada absensi hari ini</p>
                                <p className="text-sm">Scan QR code untuk memulai</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {recentAttendance.map((record, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <span className="font-semibold text-gray-900">{record.name}</span>
                                            </div>
                                            <span className="text-xs font-mono bg-white px-2 py-1 rounded text-gray-600">
                                                {record.time}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="font-mono">{record.nis}</span>
                                            <span>•</span>
                                            <span>{record.class}</span>
                                            <span>•</span>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                {record.major}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">📋 Petunjuk Penggunaan:</h3>
                    <ol className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">1.</span>
                            <span>Pastikan kamera perangkat Anda aktif dan izin akses kamera telah diberikan</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">2.</span>
                            <span>Arahkan kamera ke QR Code yang ada pada kartu siswa</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">3.</span>
                            <span>Tunggu hingga QR Code terbaca otomatis (ditandai dengan notifikasi hijau)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-semibold text-blue-600">4.</span>
                            <span>Absensi akan tercatat secara otomatis dengan waktu saat ini</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
