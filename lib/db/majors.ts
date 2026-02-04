import fs from 'fs/promises';
import path from 'path';

export type Major = {
    id: string;
    code: string;
    name: string;
    description?: string;
};

const MAJORS_DB_PATH = path.join(process.cwd(), 'data/majors.json');
let cachedMajors: Major[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 5000; // 5 seconds cache

async function ensureMajorsDb() {
    const dir = path.dirname(MAJORS_DB_PATH);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }

    try {
        await fs.access(MAJORS_DB_PATH);
    } catch {
        await fs.writeFile(MAJORS_DB_PATH, JSON.stringify([], null, 2));
    }
}

export async function getMajors(): Promise<Major[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedMajors && (now - cacheTime) < CACHE_TTL) {
        return cachedMajors;
    }

    await ensureMajorsDb();
    const data = await fs.readFile(MAJORS_DB_PATH, 'utf-8');
    cachedMajors = JSON.parse(data) as Major[];
    cacheTime = now;

    return cachedMajors;
}

export async function getMajorById(id: string): Promise<Major | undefined> {
    const majors = await getMajors();
    return majors.find((m) => m.id === id);
}

export async function createMajor(major: Major): Promise<void> {
    const majors = await getMajors();
    majors.push(major);
    await fs.writeFile(MAJORS_DB_PATH, JSON.stringify(majors, null, 2));
    cachedMajors = null; // Invalidate cache
}

export async function updateMajor(id: string, data: Partial<Major>): Promise<void> {
    const majors = await getMajors();
    const index = majors.findIndex((m) => m.id === id);
    if (index !== -1) {
        majors[index] = { ...majors[index], ...data };
        await fs.writeFile(MAJORS_DB_PATH, JSON.stringify(majors, null, 2));
        cachedMajors = null; // Invalidate cache
    }
}

export async function deleteMajor(id: string): Promise<void> {
    const majors = await getMajors();
    const filtered = majors.filter((m) => m.id !== id);
    await fs.writeFile(MAJORS_DB_PATH, JSON.stringify(filtered, null, 2));
    cachedMajors = null; // Invalidate cache
}
