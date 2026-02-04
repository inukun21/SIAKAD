import fs from 'fs/promises';
import path from 'path';

export type Subject = {
    id: string;
    code: string;
    name: string;
    type: 'Umum' | 'Produktif';
    credits?: number;
};

const DB_PATH = path.join(process.cwd(), 'data/subjects.json');

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

export async function getSubjects(): Promise<Subject[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Subject[];
}

export async function createSubject(subject: Subject): Promise<void> {
    const subjects = await getSubjects();
    subjects.push(subject);
    await fs.writeFile(DB_PATH, JSON.stringify(subjects, null, 2));
}

export async function deleteSubject(id: string): Promise<void> {
    const subjects = await getSubjects();
    const filtered = subjects.filter((s) => s.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}
