import { notFound } from "next/navigation";

import { getEnrollmentMock } from "@/modules/enrollments/data/enrollment.mock";
import { EnrollmentFinancialOverview } from "@/modules/payments/ui/enrollment-financial-overview";
import { studentListMock } from "@/modules/students/data/student.mock";

type EnrollmentFinancialPageProps = {
  params: Promise<{
    enrollmentId: string;
  }>;
};

export default async function EnrollmentFinancialPage({
  params,
}: EnrollmentFinancialPageProps) {
  const { enrollmentId } = await params;

  const enrollment = getEnrollmentMock(enrollmentId);

  if (!enrollment) {
    notFound();
  }

  const student = studentListMock.find(
    (item) => item.id === enrollment.studentId
  );

  if (!student) {
    notFound();
  }

  return (
    <EnrollmentFinancialOverview enrollment={enrollment} student={student} />
  );
}
