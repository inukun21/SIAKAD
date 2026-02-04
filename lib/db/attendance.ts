import fs from 'fs/promises';
import path from 'path';

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export type Attendance = {
    id: string;
    studentId: string;
    date: string; // YYYY-MM-DD
    status: AttendanceStatus;
    time?: string; // HH:mm
    notes?: string;
};

const DB_PATH = path.join(process.cwd(), 'data/attendance.json');
let cachedAttendance: Attendance[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 3000; // 3 seconds cache for real-time feel

async function ensureDb() {
    const dir = path.dirname(DB_PATH);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
    }
}

export async function getAttendance(): Promise<Attendance[]> {
    const now = Date.now();

    if (cachedAttendance && (now - cacheTime) < CACHE_TTL) {
        return cachedAttendance;
    }

    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    cachedAttendance = JSON.parse(data) as Attendance[];
    cacheTime = now;

    return cachedAttendance;
}

export async function getAttendanceByDate(date: string): Promise<Attendance[]> {
    const allAttendance = await getAttendance();
    return allAttendance.filter(a => a.date === date);
}

export async function getAttendanceByStudent(studentId: string, date?: string): Promise<Attendance[]> {
    const allAttendance = await getAttendance();
    let filtered = allAttendance.filter(a => a.studentId === studentId);

    if (date) {
        filtered = filtered.filter(a => a.date === date);
    }

    return filtered;
}

export async function createAttendance(attendance: Attendance): Promise<void> {
    const allAttendance = await getAttendance();
    allAttendance.push(attendance);
    await fs.writeFile(DB_PATH, JSON.stringify(allAttendance, null, 2));
    cachedAttendance = null;
}

export async function updateAttendance(id: string, data: Partial<Attendance>): Promise<void> {
    const allAttendance = await getAttendance();
    const index = allAttendance.findIndex(a => a.id === id);

    if (index !== -1) {
        allAttendance[index] = { ...allAttendance[index], ...data };
        await fs.writeFile(DB_PATH, JSON.stringify(allAttendance, null, 2));
        cachedAttendance = null;
    }
}

export async function deleteAttendance(id: string): Promise<void> {
    const allAttendance = await getAttendance();
    const filtered = allAttendance.filter(a => a.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
    cachedAttendance = null;
}

export async function bulkCreateAttendance(attendanceList: Attendance[]): Promise<void> {
    const allAttendance = await getAttendance();
    allAttendance.push(...attendanceList);
    await fs.writeFile(DB_PATH, JSON.stringify(allAttendance, null, 2));
    cachedAttendance = null;
}
