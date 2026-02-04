import fs from 'fs/promises';
import path from 'path';

export type AcademicYear = {
    id: string;
    year: string;
    semester: 'Ganjil' | 'Genap';
    startDate: string;
    endDate: string;
    isActive: boolean;
};

const DB_PATH = path.join(process.cwd(), 'data/academic-years.json');

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

export async function getAcademicYears(): Promise<AcademicYear[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as AcademicYear[];
}

export async function createAcademicYear(academicYear: AcademicYear): Promise<void> {
    const academicYears = await getAcademicYears();
    academicYears.push(academicYear);
    await fs.writeFile(DB_PATH, JSON.stringify(academicYears, null, 2));
}

export async function deleteAcademicYear(id: string): Promise<void> {
    const academicYears = await getAcademicYears();
    const filtered = academicYears.filter((ay) => ay.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}

export async function setActiveAcademicYear(id: string): Promise<void> {
    const academicYears = await getAcademicYears();
    const updated = academicYears.map(ay => ({
        ...ay,
        isActive: ay.id === id
    }));
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
}
