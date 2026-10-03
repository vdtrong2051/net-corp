export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "OTHER";

export type PaymentStatus = "PENDING" | "CONFIRMED" | "RETURNED" | "CANCELLED";

export type PaymentProof = {
  id: string;

  fileName: string;

  mimeType: string;

  /*
   * GĐ7 hiện chỉ dùng mock URL.
   * GĐ21 mới nối Private Blob thật.
   */
  url: string;

  uploadedAt: string;
};

export type PaymentAllocation = {
  id: string;

  paymentId: string;

  enrollmentItemId: string;

  amount: number;
};

export type Payment = {
  id: string;

  paymentCode: string;

  /*
   * Payment thuộc một Student
   * và một Enrollment cụ thể.
   */
  studentId: string;

  enrollmentId: string;

  /*
   * Tổng số tiền thực tế trung tâm nhận.
   */
  amount: number;

  method: PaymentMethod;

  /*
   * Thời điểm thực tế nhận tiền.
   */
  paidAt: string;

  proof?: PaymentProof;

  status: PaymentStatus;

  note?: string;

  /*
   * Xác định tiền của Payment
   * được tính vào khóa nào.
   */
  allocations: PaymentAllocation[];

  createdByUserId?: string;

  createdByName?: string;

  createdAt: string;

  updatedAt: string;

  confirmedAt?: string;

  confirmedByUserId?: string;

  confirmedByName?: string;

  returnedAt?: string;

  returnedReason?: string;

  cancelledAt?: string;

  cancelledReason?: string;

  /*
   * Quan hệ adjustment.
   *
   * Payment cũ:
   * replacementPaymentId -> Payment mới
   *
   * Payment mới:
   * replacesPaymentId -> Payment cũ
   */
  replacementPaymentId?: string;

  replacesPaymentId?: string;
};

/*
 * ============================================================
 * LIST VIEW MODEL
 *
 * Projection cho /payments.
 * Không phải entity DB.
 * ============================================================
 */

export type PaymentListItem = {
  id: string;

  paymentCode: string;

  studentId: string;

  studentCode: string;

  studentName: string;

  enrollmentId: string;

  enrollmentCode: string;

  /*
   * Lấy từ Enrollment.
   * Không phải field thuộc Payment entity.
   */
  salesName?: string;

  amount: number;

  allocatedAmount: number;

  allocationCount: number;

  allocatedCourseNames: string[];

  method: PaymentMethod;

  status: PaymentStatus;

  paidAt: string;

  hasProof: boolean;

  createdByName?: string;
};

/*
 * ============================================================
 * FINANCIAL PROJECTIONS
 *
 * Không lưu DB như source of truth.
 * Tính từ EnrollmentItem + PaymentAllocation.
 * ============================================================
 */

export type EnrollmentItemFinancialSummary = {
  enrollmentItemId: string;

  courseName: string;

  finalTuition: number;

  confirmedPaid: number;

  pendingAmount: number;

  remainingAmount: number;

  overpaidAmount: number;
};

export type EnrollmentFinancialSummary = {
  enrollmentId: string;

  totalTuition: number;

  confirmedPaid: number;

  pendingAmount: number;

  remainingAmount: number;

  overpaidAmount: number;

  items: EnrollmentItemFinancialSummary[];
};

export type PaymentFinancialBreakdown = {
  paymentId: string;

  paymentAmount: number;

  allocatedAmount: number;

  unallocatedAmount: number;
};

export type PaymentRecordDraft = {
  studentId: string;

  enrollmentId: string;

  amount: number;

  method: PaymentMethod;

  paidAt: string;

  proof?: PaymentProof;

  note?: string;
};
