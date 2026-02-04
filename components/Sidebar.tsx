'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Database,
    Users,
    UserCheck,
    ClipboardList,
    GraduationCap,
    Briefcase,
    Building2,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    FileText,
    Import,
    Upload,
    History,
    BookOpen,
    School,
    CalendarDays,
    DoorOpen,
    Wrench,
    Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type MenuItem = {
    name: string;
    icon: any;
    href?: string;
    submenu?: { name: string; href: string; icon?: any }[];
};

// Helper icons
const usersIcon = Users;
const ActivityIcon = ClipboardList;

const MENU_ITEMS: MenuItem[] = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },
    {
        name: 'Data Master',
        icon: Database,
        submenu: [
            { name: 'Program Keahlian', href: '/dashboard/majors', icon: GraduationCap },
            { name: 'Kelas & Wali', href: '/dashboard/classes', icon: usersIcon }, // usersIcon handled below
            { name: 'Mata Pelajaran', href: '/dashboard/subjects', icon: BookOpen },
            { name: 'Ruangan & Lab', href: '/dashboard/rooms', icon: DoorOpen },
            { name: 'Tahun Akademik', href: '/dashboard/academic-years', icon: CalendarDays },
        ]
    },
    {
        name: 'Informasi Siswa',
        icon: Users,
        submenu: [
            { name: 'Input Siswa Baru', href: '/dashboard/students/create', icon: FileText },
            { name: 'Import Data Siswa', href: '/dashboard/students/import', icon: Import },
            { name: 'Validasi Dokumen', href: '/dashboard/students/validation', icon: Upload },
            { name: 'Riwayat Mutasi', href: '/dashboard/students/mutation', icon: History },
            { name: 'Data Siswa', href: '/dashboard/students', icon: Users }, // Added to keep list view accessible
        ]
    },
    {
        name: 'Personalia',
        icon: UserCheck,
        submenu: [
            { name: 'Data Guru & Staf', href: '/dashboard/teachers', icon: Users },
            { name: 'Instruktur Industri', href: '/dashboard/instructors', icon: Wrench },
            { name: 'Direktori Siswa', href: '/dashboard/students/directory', icon: BookOpen },
            { name: 'Alumni & BKK', href: '/dashboard/alumni', icon: GraduationCap },
        ]
    },
    {
        name: 'Sistem Absensi',
        icon: ClipboardList,
        submenu: [
            { name: 'Presensi Harian', href: '/dashboard/attendance/daily', icon: CalendarDays },
            { name: 'Presensi Praktik', href: '/dashboard/attendance/practical', icon: Wrench },
            { name: 'Monitoring PKL', href: '/dashboard/attendance/internship', icon: Monitor },
            { name: 'Rekap Kehadiran', href: '/dashboard/attendance/report', icon: FileText },
        ]
    },
    {
        name: 'Evaluasi & Nilai',
        icon: School,
        submenu: [
            { name: 'Nilai Teori', href: '/dashboard/grades/theory', icon: BookOpen },
            { name: 'Nilai Praktik', href: '/dashboard/grades/practical', icon: Wrench },
            { name: 'Nilai PKL', href: '/dashboard/grades/internship', icon: Briefcase },
            { name: 'UKK', href: '/dashboard/grades/ukk', icon: GraduationCap },
            { name: 'Rapor Digital', href: '/dashboard/grades/report', icon: FileText },
        ]
    },
    {
        name: 'Hubungan Industri',
        icon: Briefcase,
        submenu: [
            { name: 'Mitra DUDI', href: '/dashboard/industrial/partners', icon: Building2 },
            { name: 'Penempatan PKL', href: '/dashboard/industrial/placement', icon: Users },
            { name: 'Jurnal PKL', href: '/dashboard/industrial/journal', icon: BookOpen },
        ]
    },
    {
        name: 'Sarana Prasarana',
        icon: Wrench,
        submenu: [
            { name: 'Inventaris Alat', href: '/dashboard/inventory', icon: ClipboardList },
            { name: 'Peminjaman', href: '/dashboard/inventory/loans', icon: History },
            { name: 'Bahan Pakai', href: '/dashboard/inventory/consumables', icon: Database },
        ]
    },
    {
        name: 'Pengaturan Sistem',
        icon: Settings,
        submenu: [
            { name: 'Manajemen User', href: '/dashboard/users', icon: Users },
            { name: 'Log Aktivitas', href: '/dashboard/logs', icon: ActivityIcon },
            { name: 'Backup & Restore', href: '/dashboard/backup', icon: Database },
            { name: 'Pengaturan Umum', href: '/dashboard/settings', icon: Settings },
        ]
    },
];



export default function Sidebar() {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    return (
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-center p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex flex-col items-center">
                    <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 mb-2">
                        S
                    </div>
                    <span className="text-lg font-bold text-gray-800 tracking-tight">SIAKAD SMK</span>
                    <span className="text-xs text-gray-400 font-medium">Sistem Informasi Akademik</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                <nav>
                    {MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const hasSubmenu = item.submenu && item.submenu.length > 0;
                        const isActive = item.href ? pathname === item.href : false;
                        // Check if any submenu item is active to keep parent open
                        const isChildActive = item.submenu?.some(sub => pathname === sub.href);
                        const isOpen = openMenus[item.name] || isChildActive;

                        return (
                            <div key={item.name} className="mb-2">
                                {hasSubmenu ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={cn(
                                                "w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                                isChildActive
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <Icon className={cn("mr-3 h-5 w-5", isChildActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                                                {item.name}
                                            </div>
                                            {isOpen ? (
                                                <ChevronDown className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1">
                                                {item.submenu!.map((sub) => {
                                                    const SubIcon = sub.icon || ChevronRight;
                                                    const isSubActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={cn(
                                                                "group flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                                                                isSubActive
                                                                    ? "text-blue-600 bg-blue-50/50 font-medium"
                                                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <SubIcon className={cn("mr-2 h-3.5 w-3.5", isSubActive ? "text-blue-500" : "text-gray-300 group-hover:text-gray-500")} />
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        className={cn(
                                            "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-blue-100" : "text-gray-400 group-hover:text-gray-600")} />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
                    <LogOut className="mr-3 h-5 w-5" />
                    Keluar Sistem
                </button>
            </div>
        </div>
    );
}
