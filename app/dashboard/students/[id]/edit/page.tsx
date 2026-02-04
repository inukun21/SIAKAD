import StudentForm from "@/components/StudentForm";
import { updateStudentAction, getStudent } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function EditStudentPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const student = await getStudent(id);

    if (!student) {
        notFound();
    }

    const updateAction = updateStudentAction.bind(null, student.id);

    return (
        <StudentForm
            title="Edit Data Siswa"
            initialData={student}
            action={updateAction}
        />
    );
}
