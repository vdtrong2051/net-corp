import {
  enrollmentDraftsMock,
  getEnrollmentMock,
} from "@/modules/enrollments/data/enrollment.mock";
import type {
  Payment,
  PaymentAllocation,
  PaymentListItem,
  PaymentProof,
} from "@/modules/payments/model/payment.types";
import { buildEnrollmentFinancialSummary } from "@/modules/payments/service/payment-financial.service";
import { studentListMock } from "@/modules/students/data/student.mock";

function buildProof(
  id: string,
  fileName: string,
  uploadedAt: string
): PaymentProof {
  return {
    id,

    fileName,

    mimeType: "image/jpeg",

    /*
     * Mock URL.
     * GĐ21 mới nối Private Blob.
     */
    url: `https://example.com/payment-proofs/${fileName}`,

    uploadedAt,
  };
}

function allocation(
  id: string,
  paymentId: string,
  enrollmentItemId: string,
  amount: number
): PaymentAllocation {
  return {
    id,

    paymentId,

    enrollmentItemId,

    amount,
  };
}

export const paymentMock: Payment[] = [
  /*
   * ==========================================================
   * PAY 1
   * Confirmed full payment cho HSK 3.
   * ==========================================================
   */
  {
    id: "payment-001",

    paymentCode: "PAY-2026-0001",

    studentId: "student-001",

    enrollmentId: "enrollment-draft-001",

    amount: 1794000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-01T10:15:00+07:00",

    proof: buildProof(
      "proof-001",
      "pay-2026-0001.jpg",
      "2026-10-01T10:20:00+07:00"
    ),

    status: "CONFIRMED",

    note: "Thanh toán toàn bộ khóa HSK 3.",

    allocations: [
      allocation(
        "allocation-001",
        "payment-001",
        "enrollment-item-001",
        1794000
      ),
    ],

    createdByUserId: "staff-001",

    createdByName: "Nguyễn Minh Nhân Viên",

    createdAt: "2026-10-01T10:20:00+07:00",

    updatedAt: "2026-10-01T11:00:00+07:00",

    confirmedAt: "2026-10-01T11:00:00+07:00",

    confirmedByUserId: "manager-001",

    confirmedByName: "Quản lý NET",
  },

  /*
   * ==========================================================
   * PAY 2
   * Pending deposit cho HSK 4.
   *
   * Pending chưa làm giảm Remaining.
   * ==========================================================
   */
  {
    id: "payment-002",

    paymentCode: "PAY-2026-0002",

    studentId: "student-001",

    enrollmentId: "enrollment-draft-001",

    amount: 500000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-02T18:10:00+07:00",

    proof: buildProof(
      "proof-002",
      "pay-2026-0002.jpg",
      "2026-10-02T18:15:00+07:00"
    ),

    status: "PENDING",

    note: "Cọc khóa HSK 4.",

    allocations: [
      allocation(
        "allocation-002",
        "payment-002",
        "enrollment-item-002",
        500000
      ),
    ],

    createdByUserId: "staff-001",

    createdByName: "Nguyễn Minh Nhân Viên",

    createdAt: "2026-10-02T18:15:00+07:00",

    updatedAt: "2026-10-02T18:15:00+07:00",
  },

  /*
   * ==========================================================
   * PAY 3
   * Confirmed full cho IELTS Foundation.
   * ==========================================================
   */
  {
    id: "payment-003",

    paymentCode: "PAY-2026-0003",

    studentId: "student-002",

    enrollmentId: "enrollment-draft-002",

    amount: 2688000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-02T12:30:00+07:00",

    proof: buildProof(
      "proof-003",
      "pay-2026-0003.jpg",
      "2026-10-02T12:35:00+07:00"
    ),

    status: "CONFIRMED",

    allocations: [
      allocation(
        "allocation-003",
        "payment-003",
        "enrollment-item-003",
        2688000
      ),
    ],

    createdByUserId: "staff-001",

    createdByName: "Nguyễn Minh Nhân Viên",

    createdAt: "2026-10-02T12:35:00+07:00",

    updatedAt: "2026-10-02T13:15:00+07:00",

    confirmedAt: "2026-10-02T13:15:00+07:00",

    confirmedByUserId: "manager-001",

    confirmedByName: "Quản lý NET",
  },

  /*
   * ==========================================================
   * PAY 4
   * Returned do proof không rõ.
   *
   * Không tính vào confirmed/pending.
   * ==========================================================
   */
  {
    id: "payment-004",

    paymentCode: "PAY-2026-0004",

    studentId: "student-002",

    enrollmentId: "enrollment-draft-002",

    amount: 500000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-02T14:00:00+07:00",

    proof: buildProof(
      "proof-004",
      "pay-2026-0004.jpg",
      "2026-10-02T14:05:00+07:00"
    ),

    status: "RETURNED",

    allocations: [
      allocation(
        "allocation-004",
        "payment-004",
        "enrollment-item-004",
        500000
      ),
    ],

    createdByUserId: "staff-001",

    createdByName: "Nguyễn Minh Nhân Viên",

    createdAt: "2026-10-02T14:05:00+07:00",

    updatedAt: "2026-10-02T14:40:00+07:00",

    returnedAt: "2026-10-02T14:40:00+07:00",

    returnedReason: "Ảnh chuyển khoản bị mờ, không đọc được số tiền.",
  },

  /*
   * ==========================================================
   * PAY 5
   * Một Payment phân vào HAI COURSE.
   *
   * IELTS Foundation 500k
   * HSK 1             1.314m
   * ==========================================================
   */
  {
    id: "payment-005",

    paymentCode: "PAY-2026-0005",

    studentId: "student-004",

    enrollmentId: "enrollment-draft-003",

    amount: 1814000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-03T08:00:00+07:00",

    proof: buildProof(
      "proof-005",
      "pay-2026-0005.jpg",
      "2026-10-03T08:05:00+07:00"
    ),

    status: "CONFIRMED",

    note: "Một giao dịch thanh toán cho hai khóa.",

    allocations: [
      allocation(
        "allocation-005",
        "payment-005",
        "enrollment-item-005",
        500000
      ),

      allocation(
        "allocation-006",
        "payment-005",
        "enrollment-item-006",
        1314000
      ),
    ],

    createdByUserId: "staff-001",

    createdByName: "Nguyễn Minh Nhân Viên",

    createdAt: "2026-10-03T08:05:00+07:00",

    updatedAt: "2026-10-03T08:20:00+07:00",

    confirmedAt: "2026-10-03T08:20:00+07:00",

    confirmedByUserId: "manager-001",

    confirmedByName: "Quản lý NET",
  },

  /*
   * ==========================================================
   * PAY 6
   * Pending 500k tiếp theo của IELTS.
   * ==========================================================
   */
  {
    id: "payment-006",

    paymentCode: "PAY-2026-0006",

    studentId: "student-004",

    enrollmentId: "enrollment-draft-003",

    amount: 500000,

    method: "CASH",

    paidAt: "2026-10-03T09:00:00+07:00",

    status: "PENDING",

    note: "Thu tiền mặt tại trung tâm.",

    allocations: [
      allocation(
        "allocation-007",
        "payment-006",
        "enrollment-item-005",
        500000
      ),
    ],

    createdByUserId: "staff-002",

    createdByName: "Phạm Minh Tuấn",

    createdAt: "2026-10-03T09:05:00+07:00",

    updatedAt: "2026-10-03T09:05:00+07:00",
  },

  /*
   * ==========================================================
   * PAY 7
   * Giao dịch đã Confirm nhưng phát hiện nhập sai.
   *
   * Giữ lại record, chuyển CANCELLED.
   * ==========================================================
   */
  {
    id: "payment-007",

    paymentCode: "PAY-2026-0007",

    studentId: "student-004",

    enrollmentId: "enrollment-draft-003",

    amount: 2000000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-03T09:30:00+07:00",

    proof: buildProof(
      "proof-007",
      "pay-2026-0007.jpg",
      "2026-10-03T09:35:00+07:00"
    ),

    status: "CANCELLED",

    note: "Giao dịch cũ bị nhập sai số tiền.",

    allocations: [
      allocation(
        "allocation-008",
        "payment-007",
        "enrollment-item-005",
        2000000
      ),
    ],

    createdByUserId: "staff-002",

    createdByName: "Phạm Minh Tuấn",

    createdAt: "2026-10-03T09:35:00+07:00",

    updatedAt: "2026-10-03T10:10:00+07:00",

    confirmedAt: "2026-10-03T09:50:00+07:00",

    confirmedByUserId: "manager-001",

    confirmedByName: "Quản lý NET",

    cancelledAt: "2026-10-03T10:10:00+07:00",

    cancelledReason: "Nhập dư một số 0. Số tiền thực tế là 200.000đ.",

    replacementPaymentId: "payment-008",
  },

  /*
   * ==========================================================
   * PAY 8
   * Payment thay thế PAY-007.
   * ==========================================================
   */
  {
    id: "payment-008",

    paymentCode: "PAY-2026-0008",

    studentId: "student-004",

    enrollmentId: "enrollment-draft-003",

    amount: 200000,

    method: "BANK_TRANSFER",

    paidAt: "2026-10-03T09:30:00+07:00",

    proof: buildProof(
      "proof-008",
      "pay-2026-0008.jpg",
      "2026-10-03T10:12:00+07:00"
    ),

    status: "PENDING",

    note: "Giao dịch thay thế PAY-2026-0007.",

    allocations: [
      allocation(
        "allocation-009",
        "payment-008",
        "enrollment-item-005",
        200000
      ),
    ],

    createdByUserId: "staff-002",

    createdByName: "Phạm Minh Tuấn",

    createdAt: "2026-10-03T10:12:00+07:00",

    updatedAt: "2026-10-03T10:12:00+07:00",

    replacesPaymentId: "payment-007",
  },
];

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

export function getPaymentMock(paymentId: string) {
  return paymentMock.find((payment) => payment.id === paymentId);
}

export function getPaymentByCodeMock(paymentCode: string) {
  return paymentMock.find((payment) => payment.paymentCode === paymentCode);
}

export function getPaymentsByEnrollmentMock(enrollmentId: string) {
  return paymentMock.filter((payment) => payment.enrollmentId === enrollmentId);
}

export function getPaymentsByStudentMock(studentId: string) {
  return paymentMock.filter((payment) => payment.studentId === studentId);
}

/*
 * ============================================================
 * PAYMENT LIST PROJECTION
 * ============================================================
 */

export function buildPaymentListItems(payments: Payment[]): PaymentListItem[] {
  return payments.map((payment) => {
    const student = studentListMock.find(
      (item) => item.id === payment.studentId
    );

    const enrollment = enrollmentDraftsMock.find(
      (item) => item.id === payment.enrollmentId
    );

    const allocatedCourseNames = payment.allocations.map(
      (paymentAllocation) => {
        const course = enrollment?.items.find(
          (item) => item.id === paymentAllocation.enrollmentItemId
        );

        return course?.courseName ?? "Không xác định";
      }
    );

    const allocatedAmount = payment.allocations.reduce(
      (total, paymentAllocation) => total + paymentAllocation.amount,
      0
    );

    return {
      id: payment.id,

      paymentCode: payment.paymentCode,

      studentId: payment.studentId,

      studentCode: student?.studentCode ?? "—",

      studentName: student?.fullName ?? "Không xác định",

      enrollmentId: payment.enrollmentId,

      enrollmentCode: enrollment?.enrollmentCode ?? "—",

      salesName: enrollment?.salesName,

      amount: payment.amount,

      allocatedAmount,

      allocationCount: payment.allocations.length,

      allocatedCourseNames,

      method: payment.method,

      status: payment.status,

      paidAt: payment.paidAt,

      hasProof: Boolean(payment.proof),

      createdByName: payment.createdByName,
    };
  });
}

export const paymentListMock = buildPaymentListItems(paymentMock);

/*
 * ============================================================
 * FINANCIAL SUMMARY MOCK
 * ============================================================
 */

export function getEnrollmentFinancialSummaryMock(enrollmentId: string) {
  const enrollment = getEnrollmentMock(enrollmentId);

  if (!enrollment) {
    return undefined;
  }

  return buildEnrollmentFinancialSummary(enrollment, paymentMock);
}
