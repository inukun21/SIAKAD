import fs from 'fs/promises';
import path from 'path';

export type Class = {
    id: string;
    name: string;
    majorId: string;
    homeroom?: string;
    capacity?: number;
    academicYear?: string;
};

const DB_PATH = path.join(process.cwd(), 'data/classes.json');
let cachedClasses: Class[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 5000; // 5 seconds cache

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

export async function getClasses(): Promise<Class[]> {
    const now = Date.now();

    if (cachedClasses && (now - cacheTime) < CACHE_TTL) {
        return cachedClasses;
    }

    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    cachedClasses = JSON.parse(data) as Class[];
    cacheTime = now;

    return cachedClasses;
}

export async function createClass(classData: Class): Promise<void> {
    const classes = await getClasses();
    classes.push(classData);
    await fs.writeFile(DB_PATH, JSON.stringify(classes, null, 2));
    cachedClasses = null;
}

export async function deleteClass(id: string): Promise<void> {
    const classes = await getClasses();
    const filtered = classes.filter((c) => c.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
    cachedClasses = null;
}
