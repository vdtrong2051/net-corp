import { studentListMock } from "@/modules/students/data/student.mock";
import { StudentManagement } from "@/modules/students/ui/student-management";

export default function StudentsPage() {
  return <StudentManagement initialData={studentListMock} />;
}
