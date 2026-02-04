'use server';

import { getAcademicYears, createAcademicYear, deleteAcademicYear, setActiveAcademicYear, AcademicYear } from '@/lib/db/academic-years';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllAcademicYears() {
    return await getAcademicYears();
}

export async function createAcademicYearAction(formData: FormData) {
    const year = formData.get('year') as string;
    const semester = formData.get('semester') as 'Ganjil' | 'Genap';
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    if (!year || !semester || !startDate || !endDate) {
        throw new Error('All fields are required');
    }

    const newAcademicYear: AcademicYear = {
        id: uuidv4(),
        year,
        semester,
        startDate,
        endDate,
        isActive: false,
    };

    await createAcademicYear(newAcademicYear);
    revalidatePath('/dashboard/academic-years');
}

export async function deleteAcademicYearAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteAcademicYear(id);
    revalidatePath('/dashboard/academic-years');
}

export async function setActiveAcademicYearAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await setActiveAcademicYear(id);
    revalidatePath('/dashboard/academic-years');
}
