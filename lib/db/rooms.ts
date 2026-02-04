import fs from 'fs/promises';
import path from 'path';

export type Room = {
    id: string;
    code: string;
    name: string;
    type: 'Kelas' | 'Laboratorium' | 'Bengkel';
    capacity?: number;
    facilities?: string;
};

const DB_PATH = path.join(process.cwd(), 'data/rooms.json');

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

export async function getRooms(): Promise<Room[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Room[];
}

export async function createRoom(room: Room): Promise<void> {
    const rooms = await getRooms();
    rooms.push(room);
    await fs.writeFile(DB_PATH, JSON.stringify(rooms, null, 2));
}

export async function deleteRoom(id: string): Promise<void> {
    const rooms = await getRooms();
    const filtered = rooms.filter((r) => r.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}
