import { enrollmentDraftsMock } from "@/modules/enrollments/data/enrollment.mock";
import { PaymentRecordFlow } from "@/modules/payments/ui/payment-record-flow";
import { studentListMock } from "@/modules/students/data/student.mock";

type CreatePaymentPageProps = {
  searchParams: Promise<{
    enrollmentId?: string;
  }>;
};

export default async function CreatePaymentPage({
  searchParams,
}: CreatePaymentPageProps) {
  const { enrollmentId } = await searchParams;

  return (
    <PaymentRecordFlow
      students={studentListMock}
      enrollments={enrollmentDraftsMock}
      initialEnrollmentId={enrollmentId}
    />
  );
}
