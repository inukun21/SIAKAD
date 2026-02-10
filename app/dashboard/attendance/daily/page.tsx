'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, Users, RefreshCw, BarChart3 } from 'lucide-react';
import { getAllStudents } from '@/lib/actions';
import { getAttendanceByDateAction, getAllAttendance, createAttendanceAction, updateAttendanceAction } from '@/lib/actions/attendance';
import { Student } from '@/lib/db';
import { Attendance, AttendanceStatus } from '@/lib/db/attendance';

export default function DailyAttendancePage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [allAttendance, setAllAttendance] = useState<Attendance[]>([]); // All attendance records
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const loadData = useCallback(async () => {
        setLoading(true);
        const [studentsData, attendanceData, allAttendanceData] = await Promise.all([
            getAllStudents(),
            getAttendanceByDateAction(selectedDate),
            getAllAttendance() // Load all attendance for statistics
        ]);
        setStudents(studentsData);
        setAttendance(attendanceData);
        setAllAttendance(allAttendanceData);
        setLastUpdate(new Date());
        setLoading(false);
    }, [selectedDate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-refresh every 10 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            loadData();
        }, 10000);

        return () => clearInterval(interval);
    }, [loadData]);

    const handleStatusChange = useCallback(async (studentId: string, status: AttendanceStatus) => {
        setSaving(true);

        const existingAttendance = attendance.find(a => a.studentId === studentId);
        const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('date', selectedDate);
        formData.append('status', status);
        formData.append('time', time);

        try {
            if (existingAttendance) {
                await updateAttendanceAction(existingAttendance.id, formData);
            } else {
                await createAttendanceAction(formData);
            }
            await loadData();
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Gagal menyimpan absensi');
        } finally {
            setSaving(false);
        }
    }, [attendance, selectedDate, loadData]);

    const getStudentAttendance = useCallback((studentId: string): Attendance | undefined => {
        return attendance.find(a => a.studentId === studentId);
    }, [attendance]);

    // Calculate total attendance stats per student
    const getStudentStats = useCallback((studentId: string) => {
        const studentAttendances = allAttendance.filter(a => a.studentId === studentId);
        const hadir = studentAttendances.filter(a => a.status === 'Hadir').length;
        const sakit = studentAttendances.filter(a => a.status === 'Sakit').length;
        const izin = studentAttendances.filter(a => a.status === 'Izin').length;
        const alpa = studentAttendances.filter(a => a.status === 'Alpa').length;
        const total = studentAttendances.length;

        return { hadir, sakit, izin, alpa, total };
    }, [allAttendance]);

    const stats = useMemo(() => {
        const total = students.length;
        const hadir = attendance.filter(a => a.status === 'Hadir').length;
        const sakit = attendance.filter(a => a.status === 'Sakit').length;
        const izin = attendance.filter(a => a.status === 'Izin').length;
        const alpa = attendance.filter(a => a.status === 'Alpa').length;
        const belumAbsen = total - attendance.length;

        // Calculate percentages
        const hadirPercent = total > 0 ? ((hadir / total) * 100).toFixed(1) : '0';
        const sakitPercent = total > 0 ? ((sakit / total) * 100).toFixed(1) : '0';
        const izinPercent = total > 0 ? ((izin / total) * 100).toFixed(1) : '0';
        const alpaPercent = total > 0 ? ((alpa / total) * 100).toFixed(1) : '0';
        const belumAbsenPercent = total > 0 ? ((belumAbsen / total) * 100).toFixed(1) : '0';
        const sudahAbsenPercent = total > 0 ? (((total - belumAbsen) / total) * 100).toFixed(1) : '0';

        return {
            total, hadir, sakit, izin, alpa, belumAbsen,
            hadirPercent, sakitPercent, izinPercent, alpaPercent, belumAbsenPercent, sudahAbsenPercent
        };
    }, [students, attendance]);

    // Check if selected date is today
    const isToday = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return selectedDate === today;
    }, [selectedDate]);

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case 'Hadir': return 'bg-green-100 text-green-700 border-green-300';
            case 'Sakit': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 'Izin': return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'Alpa': return 'bg-red-100 text-red-700 border-red-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Presensi Harian</h1>
                    <p className="text-sm text-gray-500 mt-1" suppressHydrationWarning>
                        Terakhir diperbarui: {lastUpdate.toLocaleTimeString('id-ID')}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        title="Refresh data"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Warning when not viewing today */}
            {!isToday && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-amber-900 text-sm">Mode Hanya Lihat</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Anda sedang melihat data absensi untuk tanggal <strong>{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
                            Perubahan absensi hanya dapat dilakukan untuk hari ini.
                        </p>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Siswa</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-gray-400" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-green-600">Hadir</p>
                            <p className="text-2xl font-bold text-green-700">{stats.hadir}</p>
                            <p className="text-xs text-green-600 mt-1 font-semibold">{stats.hadirPercent}%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-yellow-600">Sakit</p>
                            <p className="text-2xl font-bold text-yellow-700">{stats.sakit}</p>
                            <p className="text-xs text-yellow-600 mt-1 font-semibold">{stats.sakitPercent}%</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-blue-600">Izin</p>
                            <p className="text-2xl font-bold text-blue-700">{stats.izin}</p>
                            <p className="text-xs text-blue-600 mt-1 font-semibold">{stats.izinPercent}%</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-red-600">Alpa</p>
                            <p className="text-2xl font-bold text-red-700">{stats.alpa}</p>
                            <p className="text-xs text-red-600 mt-1 font-semibold">{stats.alpaPercent}%</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">Belum Absen</p>
                            <p className="text-2xl font-bold text-gray-700">{stats.belumAbsen}</p>
                            <p className="text-xs text-gray-600 mt-1 font-semibold">{stats.belumAbsenPercent}%</p>
                        </div>
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Detail Presentasi */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Detail Presentasi Kehadiran</h2>
                        <p className="text-sm text-gray-600">Ringkasan persentase absensi siswa hari ini</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Progress Kehadiran */}
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700">Tingkat Kehadiran</span>
                            <span className="text-2xl font-bold text-blue-600">{stats.sudahAbsenPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${stats.sudahAbsenPercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            {attendance.length} dari {stats.total} siswa sudah melakukan absensi
                        </p>
                    </div>

                    {/* Breakdown Status */}
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Breakdown Status Kehadiran</h3>
                        <div className="space-y-3">
                            {/* Hadir */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Hadir
                                    </span>
                                    <span className="text-xs font-bold text-green-700">{stats.hadirPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.hadirPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Sakit */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-yellow-700 font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Sakit
                                    </span>
                                    <span className="text-xs font-bold text-yellow-700">{stats.sakitPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.sakitPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Izin */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-blue-700 font-medium flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Izin
                                    </span>
                                    <span className="text-xs font-bold text-blue-700">{stats.izinPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.izinPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Alpa */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-red-700 font-medium flex items-center gap-1">
                                        <XCircle className="w-3 h-3" /> Alpa
                                    </span>
                                    <span className="text-xs font-bold text-red-700">{stats.alpaPercent}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.alpaPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">NIS</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nama Siswa</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Kelas</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Jurusan</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-1">
                                        <BarChart3 className="w-4 h-4" />
                                        Statistik Kehadiran
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Waktu</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-500" />
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data siswa
                                    </td>
                                </tr>
                            ) : (
                                students.map((student, index) => {
                                    const studentAttendance = getStudentAttendance(student.id);
                                    const currentStatus = studentAttendance?.status;
                                    const studentStats = getStudentStats(student.id);

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">{student.nis}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.class}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                    {student.major}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex justify-center gap-2 flex-wrap">
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded border border-green-200" title="Total Hadir">
                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                        <span className="text-xs font-semibold text-green-700">{studentStats.hadir}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded border border-yellow-200" title="Total Sakit">
                                                        <AlertCircle className="w-3 h-3 text-yellow-600" />
                                                        <span className="text-xs font-semibold text-yellow-700">{studentStats.sakit}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded border border-blue-200" title="Total Izin">
                                                        <AlertCircle className="w-3 h-3 text-blue-600" />
                                                        <span className="text-xs font-semibold text-blue-700">{studentStats.izin}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded border border-red-200" title="Total Alpa">
                                                        <XCircle className="w-3 h-3 text-red-600" />
                                                        <span className="text-xs font-semibold text-red-700">{studentStats.alpa}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">
                                                {studentAttendance?.time || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex justify-center gap-1">
                                                    {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as AttendanceStatus[]).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusChange(student.id, status)}
                                                            disabled={saving || !isToday}
                                                            title={!isToday ? 'Hanya dapat mengubah absensi hari ini' : ''}
                                                            className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all ${!isToday ? 'cursor-not-allowed opacity-50' : ''
                                                                } ${currentStatus === status
                                                                    ? getStatusColor(status)
                                                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Auto-refresh indicator */}
            <div className="text-center text-xs text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                Data diperbarui otomatis setiap 10 detik
            </div>
        </div>
    );
}
