import type {
  CourseDeliveryMode,
  CourseTrack,
} from "@/modules/courses/model/course.types";
import type {
  EnrollmentHistoryStatus,
  ProgramCode,
} from "@/modules/students/model/student.types";

export type EnrollmentStatus = EnrollmentHistoryStatus;

export type EnrollmentProgramSelection = {
  program: ProgramCode;

  inputAssessmentUrl?: string;

  outputGoal: string;
};

export type DiscountValueType = "PERCENT" | "FIXED_AMOUNT";

export type ScholarshipSelection = {
  id: string;

  label: string;

  valueType: DiscountValueType;

  /*
   * PERCENT:
   * 70 = học bổng 70%
   *
   * FIXED_AMOUNT:
   * 500000 = giảm 500.000đ
   */
  value: number;

  /*
   * Số tiền giảm đã được tính tại thời điểm ghi danh.
   * Đây là snapshot.
   */
  discountAmount: number;

  /*
   * Dùng cho các trường hợp cần cấp trên duyệt.
   */
  approvedBy?: string;

  note?: string;
};

export type VoucherSelection = {
  code: string;

  label: string;

  valueType: DiscountValueType;

  value: number;

  /*
   * Snapshot số tiền voucher thực tế đã giảm.
   */
  discountAmount: number;

  note?: string;
};

export type EnrollmentItemClassMode = "CLASS" | "EXPECTED_START";

export type EnrollmentItemDraft = {
  id: string;

  /*
   * Tham chiếu tới CourseCatalogItem.
   */
  courseCatalogId: string;

  /*
   * Snapshot khóa học tại thời điểm ghi danh.
   */
  program: ProgramCode;

  track: CourseTrack;

  deliveryMode: CourseDeliveryMode;

  courseName: string;

  /*
   * CLASS:
   * đã có mã lớp.
   *
   * EXPECTED_START:
   * chưa có lớp, chỉ biết thời gian dự kiến.
   */
  classMode: EnrollmentItemClassMode;

  classCode?: string;

  expectedStart?: string;

  /*
   * Giá catalog tại thời điểm ghi danh.
   */
  baseTuition: number;

  scholarship?: ScholarshipSelection;

  voucher?: VoucherSelection;

  /*
   * Giá cuối cùng học viên phải trả
   * sau scholarship + voucher.
   *
   * GĐ6.6 mới khóa công thức tính tự động.
   */
  finalTuition: number;
};

export type PaymentPlanMode =
  "FULL" | "INSTALLMENTS" | "DEPOSIT_THEN_INSTALLMENTS";

export type PaymentPlanLineType = "FULL" | "DEPOSIT" | "INSTALLMENT";

export type PaymentPlanLine = {
  id: string;

  type: PaymentPlanLineType;

  /*
   * Số thứ tự với INSTALLMENT.
   * Deposit không tính vào số đợt.
   */
  sequence?: number;

  label: string;

  amount: number;

  /*
   * GĐ6 chưa cần ngày thực thu.
   * Chỉ lưu deadline / mô tả dự kiến.
   */
  dueDate?: string;
};

export type EnrollmentItemPaymentPlan = {
  enrollmentItemId: string;

  mode: PaymentPlanMode;

  lines: PaymentPlanLine[];

  note?: string;
};

export type EnrollmentPaymentPlan = {
  /*
   * Payment plan được lập theo từng EnrollmentItem.
   */
  items: EnrollmentItemPaymentPlan[];
};

export type EnrollmentContractStatus = "DRAFT" | "PENDING_SIGNATURE";

export type EnrollmentContractDraft = {
  contractCode?: string;

  documentUrl?: string;

  status: EnrollmentContractStatus;
};

export type EnrollmentDraft = {
  id: string;

  enrollmentCode: string;

  /*
   * Student luôn tồn tại độc lập.
   */
  studentId: string;

  programs: EnrollmentProgramSelection[];

  items: EnrollmentItemDraft[];

  paymentPlan: EnrollmentPaymentPlan;

  /*
   * Hiện UI mock dùng cả ID + name.
   * Khi có DB, saleName chỉ là dữ liệu hiển thị
   * từ relation User.
   */
  salesPersonId?: string;

  salesName?: string;

  specialRequirements?: string;

  contract?: EnrollmentContractDraft;

  status: EnrollmentStatus;

  createdAt: string;

  updatedAt: string;

  submittedAt?: string;
};

export type EnrollmentListItem = {
  id: string;

  enrollmentCode: string;

  studentId: string;

  studentCode: string;

  studentName: string;

  programs: ProgramCode[];

  itemCount: number;

  totalFinalTuition: number;

  status: EnrollmentStatus;

  salesName?: string;

  createdAt: string;

  updatedAt: string;
};

export type EnrollmentSalesOption = {
  id: string;

  name: string;
};
