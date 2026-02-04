'use server';

import { getRooms, createRoom, deleteRoom, Room } from '@/lib/db/rooms';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllRooms() {
    return await getRooms();
}

export async function createRoomAction(formData: FormData) {
    const code = formData.get('code') as string;
    const name = formData.get('name') as string;
    const type = formData.get('type') as 'Kelas' | 'Laboratorium' | 'Bengkel';
    const capacity = formData.get('capacity') as string;
    const facilities = formData.get('facilities') as string;

    if (!code || !name || !type) {
        throw new Error('Code, Name, and Type are required');
    }

    const newRoom: Room = {
        id: uuidv4(),
        code: code.toUpperCase(),
        name,
        type,
        capacity: capacity ? parseInt(capacity) : undefined,
        facilities: facilities || undefined,
    };

    await createRoom(newRoom);
    revalidatePath('/dashboard/rooms');
}

export async function deleteRoomAction(id: string) {
    if (!id) throw new Error('Missing ID');
    await deleteRoom(id);
    revalidatePath('/dashboard/rooms');
}
