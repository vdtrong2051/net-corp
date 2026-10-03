import { EnrollmentCreateFlow } from "@/modules/enrollments/ui/enrollment-create-flow";
import { studentListMock } from "@/modules/students/data/student.mock";

export default function CreateEnrollmentPage() {
  return <EnrollmentCreateFlow initialStudents={studentListMock} />;
}
