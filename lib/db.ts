import fs from 'fs/promises';
import path from 'path';

// Define the Student type
export type Student = {
    id: string; // UUID
    // Data Pribadi
    nis: string;
    nisn?: string;
    nik?: string;
    name: string;
    placeOfBirth?: string;
    dateOfBirth?: string; // ISO Date String
    gender?: 'L' | 'P';
    religion?: string;

    // Data Akademik
    class: string;
    major: string;
    dateOfEntry?: string;
    entryPath?: string; // Jalur Masuk

    // Data Keluarga
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    parentJob?: string;
    parentAddress?: string; // Often same as student, but keep separate if needed
    parentPhone?: string;

    // Data Pendukung
    height?: number; // cm
    weight?: number; // kg
    diseaseHistory?: string;
    distanceToSchool?: number; // km

    // Contact (Existing)
    email?: string;
    phone?: string;
    address?: string;

    createdAt: string; // ISO String
    updatedAt: string; // ISO String
};

const DB_PATH = path.join(process.cwd(), 'data/students.json');

// Ensure data directory exists
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

// Read all students
export async function getStudents(): Promise<Student[]> {
    await ensureDb();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Student[];
}

// Get student by ID
export async function getStudentById(id: string): Promise<Student | undefined> {
    const students = await getStudents();
    return students.find((s) => s.id === id);
}

// Create new student
export async function createStudent(student: Student): Promise<void> {
    const students = await getStudents();
    students.push(student);
    await fs.writeFile(DB_PATH, JSON.stringify(students, null, 2));
}

// Update student
export async function updateStudent(id: string, data: Partial<Student>): Promise<void> {
    const students = await getStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...data, updatedAt: new Date().toISOString() };
        await fs.writeFile(DB_PATH, JSON.stringify(students, null, 2));
    }
}

// Delete student
export async function deleteStudent(id: string): Promise<void> {
    const students = await getStudents();
    const filtered = students.filter((s) => s.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
}
