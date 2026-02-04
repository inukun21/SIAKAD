'use server';

import { getClasses, createClass, deleteClass, Class } from '@/lib/db/classes';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllClasses() {
    return await getClasses();
}

export async function createClassAction(formData: FormData) {
    const name = formData.get('name') as string;
    const majorId = formData.get('majorId') as string;
    const homeroom = formData.get('homeroom') as string;
    const capacity = formData.get('capacity') as string;
    const academicYear = formData.get('academicYear') as string;

    if (!name || !majorId) {
        throw new Error('Name and Major are required');
    }

    const newClass: Class = {
        id: uuidv4(),
        name,
        majorId,
        homeroom: homeroom || undefined,
        capacity: capacity ? parseInt(capacity) : undefined,
        academicYear: academicYear || undefined,
    };

    await createClass(newClass);
    revalidatePath('/dashboard/classes');
}

export async function deleteClassAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteClass(id);
    revalidatePath('/dashboard/classes');
}
