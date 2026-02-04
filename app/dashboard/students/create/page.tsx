import StudentForm from "@/components/StudentForm";
import { createStudentAction } from "@/lib/actions";

export default function CreateStudentPage() {
    return (
        <StudentForm
            title="Tambah Siswa Baru"
            action={createStudentAction}
        />
    );
}
