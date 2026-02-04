'use server';

import {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    Student
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';

export async function getAllStudents() {
    return await getStudents();
}

export async function getStudent(id: string) {
    return await getStudentById(id);
}

export async function createStudentAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    if (!data.nis || !data.name || !data.class || !data.major) {
        throw new Error('Missing required fields');
    }

    const newStudent: Student = {
        id: uuidv4(),
        // Data Pribadi
        nis: data.nis as string,
        nisn: data.nisn as string,
        nik: data.nik as string,
        name: data.name as string,
        placeOfBirth: data.placeOfBirth as string,
        dateOfBirth: data.dateOfBirth as string,
        gender: data.gender as 'L' | 'P',
        religion: data.religion as string,

        // Data Akademik
        class: data.class as string,
        major: data.major as string,
        dateOfEntry: data.dateOfEntry as string,
        entryPath: data.entryPath as string,

        // Data Keluarga
        fatherName: data.fatherName as string,
        motherName: data.motherName as string,
        guardianName: data.guardianName as string,
        parentJob: data.parentJob as string,
        parentAddress: data.parentAddress as string,
        parentPhone: data.parentPhone as string,

        // Data Pendukung
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        diseaseHistory: data.diseaseHistory as string,
        distanceToSchool: data.distanceToSchool ? Number(data.distanceToSchool) : undefined,

        // Contact
        email: (data.email as string) || undefined,
        phone: (data.phone as string) || undefined,
        address: (data.address as string) || undefined,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await createStudent(newStudent);
    revalidatePath('/dashboard/students');
    redirect('/dashboard/students');
}

export async function bulkCreateStudents(studentsData: any[]) {
    // Simple validation and ID assignment
    for (const data of studentsData) {
        if (!data.name || !data.nis || !data.class || !data.major) {
            continue; // Skip invalid rows or handle errors
        }

        const newStudent: Student = {
            id: uuidv4(),
            nis: String(data.nis),
            name: String(data.name),
            class: String(data.class),
            major: String(data.major),
            // Optional fields mapping
            nisn: data.nisn ? String(data.nisn) : undefined,
            email: data.email ? String(data.email) : undefined,
            phone: data.phone ? String(data.phone) : undefined,
            // Add defaults for others
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await createStudent(newStudent);
    }
    revalidatePath('/dashboard/students');
}

export async function updateStudentAction(id: string, formData: FormData) {
    if (!id) throw new Error('Missing ID');

    const data = Object.fromEntries(formData.entries());

    await updateStudent(id, {
        // Data Pribadi
        nis: data.nis as string,
        nisn: data.nisn as string,
        nik: data.nik as string,
        name: data.name as string,
        placeOfBirth: data.placeOfBirth as string,
        dateOfBirth: data.dateOfBirth as string,
        gender: data.gender as 'L' | 'P',
        religion: data.religion as string,

        // Data Akademik
        class: data.class as string,
        major: data.major as string,
        dateOfEntry: data.dateOfEntry as string,
        entryPath: data.entryPath as string,

        // Data Keluarga
        fatherName: data.fatherName as string,
        motherName: data.motherName as string,
        guardianName: data.guardianName as string,
        parentJob: data.parentJob as string,
        parentAddress: data.parentAddress as string,
        parentPhone: data.parentPhone as string,

        // Data Pendukung
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        diseaseHistory: data.diseaseHistory as string,
        distanceToSchool: data.distanceToSchool ? Number(data.distanceToSchool) : undefined,

        // Contact
        email: (data.email as string) || undefined,
        phone: (data.phone as string) || undefined,
        address: (data.address as string) || undefined,

        updatedAt: new Date().toISOString(),
    });

    revalidatePath('/dashboard/students');
    redirect('/dashboard/students');
}

export async function deleteStudentAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteStudent(id);
    revalidatePath('/dashboard/students');
}
