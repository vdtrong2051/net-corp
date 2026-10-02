export type StudentStatus = "ACTIVE" | "INACTIVE";

export type StudentSourceCategory =
  "MARKETING" | "EXTERNAL_RELATIONS" | "SELF_SOURCED";

export type StudentSource = {
  category: StudentSourceCategory;
  detail: string;
};

export type Student = {
  id: string;
  studentCode: string;

  fullName: string;
  dateOfBirth: string;

  citizenId: string;
  citizenIdIssuedDate: string;

  phone: string;
  email: string;

  currentAddress: string;
  school?: string;

  source: StudentSource;

  status: StudentStatus;

  createdAt: string;
  updatedAt: string;
};

export type ProgramCode = "NET_HSK" | "NET_ENGLISH";

export type EnrollmentHistoryStatus =
  "DRAFT" | "SUBMITTED" | "RETURNED" | "APPROVED" | "COMPLETED" | "CANCELLED";

export type EnrollmentProgramInfo = {
  program: ProgramCode;

  inputAssessmentUrl?: string;

  outputGoal: string;
};

export type StudentEnrollmentHistoryItem = {
  id: string;
  enrollmentCode: string;

  /*
   * Một lần ghi danh có thể đồng thời chứa:
   * - NET HSK
   * - NET English
   *
   * Mỗi chương trình có đầu vào và mục tiêu riêng.
   */
  programs: EnrollmentProgramInfo[];

  salesName: string;

  specialRequirements?: string;

  status: EnrollmentHistoryStatus;

  createdAt: string;
  approvedAt?: string;
};

export type CourseHistoryStatus =
  "WAITING_CLASS" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type StudentCourseHistoryItem = {
  id: string;

  enrollmentId: string;

  /*
   * Tham chiếu tới CourseCatalogItem.
   *
   * Ví dụ:
   * course-small-group-hsk-3-3-0
   * course-small-group-ielts-foundation
   */
  courseCatalogId: string;

  /*
   * Snapshot nghiệp vụ tại thời điểm ghi danh.
   *
   * Không phụ thuộc hoàn toàn vào catalog hiện tại
   * vì catalog sau này có thể đổi tên hoặc học phí.
   */
  program: ProgramCode;

  courseName: string;

  classCode?: string;
  expectedStart?: string;

  /*
   * Học phí thực tế sau học bổng tại thời điểm
   * học viên đăng ký khóa này.
   */
  tuitionAfterScholarship: number;

  scholarshipNote?: string;

  /*
   * Tổng số tiền đã được ghi nhận cho khóa.
   * Sau này GĐ Payment sẽ thay bằng allocation thật.
   */
  paidAmount: number;

  status: CourseHistoryStatus;
};

export type PaymentMethod = "BANK_TRANSFER" | "CASH" | "OTHER";

export type PaymentHistoryStatus =
  "PENDING" | "CONFIRMED" | "RETURNED" | "CANCELLED";

export type StudentPaymentHistoryItem = {
  id: string;

  enrollmentId: string;

  installmentLabel: string;

  amount: number;

  method: PaymentMethod;

  status: PaymentHistoryStatus;

  paidAt?: string;

  proofUrl?: string;
};

export type ContractStatus =
  "DRAFT" | "PENDING_SIGNATURE" | "SIGNED" | "CANCELLED";

export type StudentContractHistoryItem = {
  id: string;

  enrollmentId: string;

  contractCode: string;

  status: ContractStatus;

  documentUrl: string;

  createdAt: string;
  signedAt?: string;
};

export type AuditActorRole = "OWNER" | "MANAGER" | "STAFF";

export type StudentAuditHistoryItem = {
  id: string;

  actorName: string;
  actorRole: AuditActorRole;

  action: string;
  description: string;

  occurredAt: string;
};

/*
 * View tổng hợp cho Student 360°.
 *
 * Không có nghĩa DB sau này sẽ có
 * một bảng Student chứa tất cả dữ liệu này.
 */
export type StudentProfile360 = {
  student: Student;

  enrollments: StudentEnrollmentHistoryItem[];

  courses: StudentCourseHistoryItem[];

  payments: StudentPaymentHistoryItem[];

  contracts: StudentContractHistoryItem[];

  auditHistory: StudentAuditHistoryItem[];
};

/*
 * View model dành cho /students.
 *
 * latestPrograms được derive từ Enrollment gần nhất.
 */
export type StudentListItem = Student & {
  latestPrograms: ProgramCode[];

  latestEnrollmentStatus?: EnrollmentHistoryStatus;

  latestEnrollmentAt?: string;

  assignedSalesName?: string;
};
