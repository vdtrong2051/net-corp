import type { EnrollmentDraft } from "@/modules/enrollments/model/enrollment.types";
import type {
  EnrollmentFinancialSummary,
  EnrollmentItemFinancialSummary,
  Payment,
  PaymentFinancialBreakdown,
} from "@/modules/payments/model/payment.types";

export function getPaymentAllocatedAmount(payment: Payment) {
  return payment.allocations.reduce(
    (total, allocation) => total + allocation.amount,
    0
  );
}

export function getPaymentFinancialBreakdown(
  payment: Payment
): PaymentFinancialBreakdown {
  const allocatedAmount = getPaymentAllocatedAmount(payment);

  return {
    paymentId: payment.id,

    paymentAmount: payment.amount,

    allocatedAmount,

    unallocatedAmount: payment.amount - allocatedAmount,
  };
}

function getAllocationAmountForItem(
  payments: Payment[],
  enrollmentItemId: string,
  status: "CONFIRMED" | "PENDING"
) {
  return payments
    .filter((payment) => payment.status === status)
    .reduce((total, payment) => {
      const allocatedToItem = payment.allocations
        .filter(
          (allocation) => allocation.enrollmentItemId === enrollmentItemId
        )
        .reduce(
          (allocationTotal, allocation) => allocationTotal + allocation.amount,
          0
        );

      return total + allocatedToItem;
    }, 0);
}

export function getConfirmedAllocatedAmountForItem(
  payments: Payment[],
  enrollmentItemId: string
) {
  return getAllocationAmountForItem(payments, enrollmentItemId, "CONFIRMED");
}

export function getPendingAllocatedAmountForItem(
  payments: Payment[],
  enrollmentItemId: string
) {
  return getAllocationAmountForItem(payments, enrollmentItemId, "PENDING");
}

export function buildEnrollmentFinancialSummary(
  enrollment: EnrollmentDraft,
  allPayments: Payment[]
): EnrollmentFinancialSummary {
  /*
   * Chỉ dùng Payment thuộc đúng Enrollment.
   *
   * RETURNED / CANCELLED không được tính
   * vào confirmedPaid hoặc pendingAmount.
   */
  const payments = allPayments.filter(
    (payment) => payment.enrollmentId === enrollment.id
  );

  const items: EnrollmentItemFinancialSummary[] = enrollment.items.map(
    (item) => {
      const confirmedPaid = getConfirmedAllocatedAmountForItem(
        payments,
        item.id
      );

      const pendingAmount = getPendingAllocatedAmountForItem(payments, item.id);

      const rawRemaining = item.finalTuition - confirmedPaid;

      return {
        enrollmentItemId: item.id,

        courseName: item.courseName,

        finalTuition: item.finalTuition,

        confirmedPaid,

        pendingAmount,

        remainingAmount: Math.max(rawRemaining, 0),

        overpaidAmount: Math.max(-rawRemaining, 0),
      };
    }
  );

  const totalTuition = items.reduce(
    (total, item) => total + item.finalTuition,
    0
  );

  const confirmedPaid = items.reduce(
    (total, item) => total + item.confirmedPaid,
    0
  );

  const pendingAmount = items.reduce(
    (total, item) => total + item.pendingAmount,
    0
  );

  const remainingAmount = items.reduce(
    (total, item) => total + item.remainingAmount,
    0
  );

  const overpaidAmount = items.reduce(
    (total, item) => total + item.overpaidAmount,
    0
  );

  return {
    enrollmentId: enrollment.id,

    totalTuition,

    confirmedPaid,

    pendingAmount,

    remainingAmount,

    overpaidAmount,

    items,
  };
}
