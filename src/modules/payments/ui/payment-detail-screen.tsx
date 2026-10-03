"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getEnrollmentMock } from "@/modules/enrollments/data/enrollment.mock";
import { buildEnrollmentFinancialSummary } from "@/modules/payments/service/payment-financial.service";
import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";
import { PaymentDetailView } from "@/modules/payments/ui/payment-detail-view";
import { studentListMock } from "@/modules/students/data/student.mock";

import { PageContainer } from "@/shared/ui/layout/page-container";

type PaymentDetailScreenProps = {
  paymentId: string;
};

export function PaymentDetailScreen({ paymentId }: PaymentDetailScreenProps) {
  const { payments, updatePayment, applyAdjustment } = usePaymentMockStore();

  const payment = payments.find((item) => item.id === paymentId);

  if (!payment) {
    return (
      <PageContainer
        title="Không tìm thấy giao dịch"
        description="Payment không tồn tại trong dữ liệu thanh toán hiện tại."
      >
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div>
                <p className="font-medium">Không tìm thấy Payment</p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Giao dịch có thể đã bị reset khỏi mock store hoặc đường dẫn
                  không hợp lệ.
                </p>
              </div>

              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/payments" />}
              >
                Quay về thanh toán
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const enrollment = getEnrollmentMock(payment.enrollmentId);

  const student = studentListMock.find((item) => item.id === payment.studentId);

  if (!enrollment || !student) {
    return (
      <PageContainer
        title="Dữ liệu không đầy đủ"
        description="Không tìm thấy Student hoặc Enrollment liên kết với giao dịch."
      >
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div>
                <p className="font-medium">
                  Payment tồn tại nhưng thiếu dữ liệu liên kết
                </p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Kiểm tra studentId và enrollmentId của Payment.
                </p>
              </div>

              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/payments" />}
              >
                Quay về thanh toán
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const financialSummary = buildEnrollmentFinancialSummary(
    enrollment,
    payments
  );

  const replacesPayment = payment.replacesPaymentId
    ? payments.find((item) => item.id === payment.replacesPaymentId)
    : undefined;

  const replacementPayment = payment.replacementPaymentId
    ? payments.find((item) => item.id === payment.replacementPaymentId)
    : undefined;

  return (
    <PaymentDetailView
      payment={payment}
      student={student}
      enrollment={enrollment}
      financialSummary={financialSummary}
      existingPaymentCodes={payments.map((item) => item.paymentCode)}
      replacesPayment={replacesPayment}
      replacementPayment={replacementPayment}
      onPersistPending={updatePayment}
      onPersistAdjustment={applyAdjustment}
    />
  );
}
