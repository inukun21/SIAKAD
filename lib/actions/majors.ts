'use server';

import { getMajors, createMajor, deleteMajor, Major } from '@/lib/db/majors';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllMajors() {
    return await getMajors();
}

export async function createMajorAction(formData: FormData) {
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    if (!code || !name) {
        throw new Error('Code and Name are required');
    }

    const newMajor: Major = {
        id: uuidv4(),
        code: code.toUpperCase(),
        name,
        description: description || undefined,
    };

    await createMajor(newMajor);
    revalidatePath('/dashboard/majors');
}

export async function deleteMajorAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteMajor(id);
    revalidatePath('/dashboard/majors');
}
