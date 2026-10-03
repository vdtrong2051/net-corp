import type {
  EnrollmentItemPaymentPlan,
  PaymentPlanLine,
  PaymentPlanMode,
} from "@/modules/enrollments/model/enrollment.types";

function createLineId() {
  return `payment-plan-line-${crypto.randomUUID()}`;
}

function normalizeInstallmentCount(count: number) {
  return Math.min(Math.max(Math.trunc(count), 1), 3);
}

function splitAmount(amount: number, count: number) {
  const safeCount = normalizeInstallmentCount(count);

  const baseAmount = Math.floor(amount / safeCount);

  const remainder = amount - baseAmount * safeCount;

  return Array.from(
    {
      length: safeCount,
    },
    (_, index) =>
      index === safeCount - 1 ? baseAmount + remainder : baseAmount
  );
}

type BuildPaymentPlanInput = {
  enrollmentItemId: string;

  courseName: string;

  finalTuition: number;

  mode: PaymentPlanMode;

  installmentCount?: number;

  depositAmount?: number;
};

export function buildPaymentPlan({
  enrollmentItemId,
  courseName,
  finalTuition,
  mode,
  installmentCount = 2,
  depositAmount = 500000,
}: BuildPaymentPlanInput): EnrollmentItemPaymentPlan {
  if (mode === "FULL") {
    return {
      enrollmentItemId,

      mode,

      lines: [
        {
          id: createLineId(),

          type: "FULL",

          label: `Thanh toán toàn bộ ${courseName}`,

          amount: finalTuition,
        },
      ],
    };
  }

  const safeCount = normalizeInstallmentCount(installmentCount);

  if (mode === "INSTALLMENTS") {
    const amounts = splitAmount(finalTuition, safeCount);

    return {
      enrollmentItemId,

      mode,

      lines: amounts.map((amount, index): PaymentPlanLine => ({
        id: createLineId(),

        type: "INSTALLMENT",

        sequence: index + 1,

        label: `Đợt ${index + 1}`,

        amount,
      })),
    };
  }

  const safeDeposit = Math.min(
    Math.max(Math.trunc(depositAmount), 0),
    finalTuition
  );

  const remainingAmount = finalTuition - safeDeposit;

  const installmentAmounts =
    remainingAmount > 0 ? splitAmount(remainingAmount, safeCount) : [];

  return {
    enrollmentItemId,

    mode,

    lines: [
      {
        id: createLineId(),

        type: "DEPOSIT",

        label: `Cọc ${courseName}`,

        amount: safeDeposit,
      },

      ...installmentAmounts.map((amount, index): PaymentPlanLine => ({
        id: createLineId(),

        type: "INSTALLMENT",

        sequence: index + 1,

        label: `Đợt ${index + 1}`,

        amount,
      })),
    ],

    note: "Tiền cọc không tính vào số đợt đóng học phí.",
  };
}

export function getPlannedTotal(plan?: EnrollmentItemPaymentPlan) {
  if (!plan) {
    return 0;
  }

  return plan.lines.reduce((total, line) => total + line.amount, 0);
}

export function getInstallmentCount(plan?: EnrollmentItemPaymentPlan) {
  if (!plan) {
    return 2;
  }

  const count = plan.lines.filter((line) => line.type === "INSTALLMENT").length;

  return count > 0 ? count : 2;
}

export function getDepositAmount(plan?: EnrollmentItemPaymentPlan) {
  return plan?.lines.find((line) => line.type === "DEPOSIT")?.amount ?? 500000;
}
