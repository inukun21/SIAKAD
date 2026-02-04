'use server';

import { getSubjects, createSubject, deleteSubject, Subject } from '@/lib/db/subjects';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllSubjects() {
    return await getSubjects();
}

export async function createSubjectAction(formData: FormData) {
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'Umum' | 'Produktif';
    const credits = formData.get('credits') as string;

    if (!code || !name || !type) {
        throw new Error('Code, Name, and Type are required');
    }

    const newSubject: Subject = {
        id: uuidv4(),
        code: code.toUpperCase(),
        name,
        type,
        credits: credits ? parseInt(credits) : undefined,
    };

    await createSubject(newSubject);
    revalidatePath('/dashboard/subjects');
}

export async function deleteSubjectAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteSubject(id);
    revalidatePath('/dashboard/subjects');
}
