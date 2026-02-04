import { createStudentAction } from "@/lib/actions";
import StudentForm from "@/components/StudentForm";

export default function CreateStudentPage() {
    return (
        <StudentForm
            action={createStudentAction}
            title="Tambah Siswa Baru"
        />
    );
}
