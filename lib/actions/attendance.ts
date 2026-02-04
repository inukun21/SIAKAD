'use server';

import {
    getAttendance,
    getAttendanceByDate,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    bulkCreateAttendance,
    Attendance,
    AttendanceStatus
} from '@/lib/db/attendance';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllAttendance() {
    return await getAttendance();
}

export async function getAttendanceByDateAction(date: string) {
    return await getAttendanceByDate(date);
}

export async function createAttendanceAction(formData: FormData) {
    const studentId = formData.get('studentId') as string;
    const date = formData.get('date') as string;
    const status = formData.get('status') as AttendanceStatus;
    const time = formData.get('time') as string;
    const notes = formData.get('notes') as string;

    if (!studentId || !date || !status) {
        throw new Error('Student, Date, and Status are required');
    }

    const newAttendance: Attendance = {
        id: uuidv4(),
        studentId,
        date,
        status,
        time: time || undefined,
        notes: notes || undefined,
    };

    await createAttendance(newAttendance);
    revalidatePath('/dashboard/attendance/daily');
}

export async function updateAttendanceAction(id: string, formData: FormData) {
    const status = formData.get('status') as AttendanceStatus;
    const time = formData.get('time') as string;
    const notes = formData.get('notes') as string;

    await updateAttendance(id, {
        status,
        time: time || undefined,
        notes: notes || undefined,
    });

    revalidatePath('/dashboard/attendance/daily');
}

export async function deleteAttendanceAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteAttendance(id);
    revalidatePath('/dashboard/attendance/daily');
}

export async function bulkMarkAttendanceAction(studentIds: string[], date: string, status: AttendanceStatus) {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });

    const attendanceList: Attendance[] = studentIds.map(studentId => ({
        id: uuidv4(),
        studentId,
        date,
        status,
        time,
    }));

    await bulkCreateAttendance(attendanceList);
    revalidatePath('/dashboard/attendance/daily');
}
