import { notFound } from "next/navigation";

import { getEnrollmentMock } from "@/modules/enrollments/data/enrollment.mock";
import { EnrollmentCreateFlow } from "@/modules/enrollments/ui/enrollment-create-flow";
import { studentListMock } from "@/modules/students/data/student.mock";

type EditEnrollmentPageProps = {
  params: Promise<{
    enrollmentId: string;
  }>;
};

export default async function EditEnrollmentPage({
  params,
}: EditEnrollmentPageProps) {
  const { enrollmentId } = await params;

  const enrollment = getEnrollmentMock(enrollmentId);

  /*
   * GĐ6.9 chỉ cho tiếp tục DRAFT.
   *
   * RETURNED sẽ được xử lý rõ hơn
   * ở GĐ8 Manager Review.
   */
  if (!enrollment || enrollment.status !== "DRAFT") {
    notFound();
  }

  return (
    <EnrollmentCreateFlow
      initialStudents={studentListMock}
      initialEnrollment={enrollment}
    />
  );
}
