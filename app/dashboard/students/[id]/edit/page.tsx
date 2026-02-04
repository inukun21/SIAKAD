import { getStudent, updateStudentAction } from "@/lib/actions";
import { notFound } from "next/navigation";
import StudentForm from "@/components/StudentForm";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    const updateAction = async (formData: FormData) => {
        'use server';
        await updateStudentAction(id, formData);
    };

    return (
        <StudentForm
            initialData={student}
            action={updateAction}
            title="Edit Data Siswa"
        />
    );
}
