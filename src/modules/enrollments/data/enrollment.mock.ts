import { getCourseCatalogItem } from "@/modules/courses/data/course-catalog.mock";
import type {
  EnrollmentDraft,
  EnrollmentItemDraft,
  EnrollmentListItem,
  EnrollmentSalesOption,
  ScholarshipSelection,
  VoucherSelection,
} from "@/modules/enrollments/model/enrollment.types";
import { studentListMock } from "@/modules/students/data/student.mock";

function requireCourseCatalogItem(courseCatalogId: string) {
  const course = getCourseCatalogItem(courseCatalogId);

  if (!course) {
    throw new Error(`Missing course catalog item: ${courseCatalogId}`);
  }

  return course;
}

type BuildEnrollmentItemOptions = {
  id: string;

  courseCatalogId: string;

  classCode?: string;

  expectedStart?: string;

  scholarship?: ScholarshipSelection;

  voucher?: VoucherSelection;

  finalTuition: number;
};

function buildEnrollmentItem({
  id,
  courseCatalogId,
  classCode,
  expectedStart,
  scholarship,
  voucher,
  finalTuition,
}: BuildEnrollmentItemOptions): EnrollmentItemDraft {
  const course = requireCourseCatalogItem(courseCatalogId);

  return {
    id,

    courseCatalogId,

    program: course.program,

    track: course.track,

    deliveryMode: course.deliveryMode,

    courseName: course.name,

    classMode: classCode ? "CLASS" : "EXPECTED_START",

    classCode,

    expectedStart,

    baseTuition: course.baseTuition,

    scholarship,

    voucher,

    finalTuition,
  };
}

/*
 * ============================================================
 * SALES MOCK
 * ============================================================
 */

export const enrollmentSalesOptionsMock: EnrollmentSalesOption[] = [
  {
    id: "staff-001",
    name: "Nguyễn Minh Nhân Viên",
  },

  {
    id: "staff-002",
    name: "Phạm Minh Tuấn",
  },
];

/*
 * ============================================================
 * DISCOUNT MOCK
 *
 * Đây là dữ liệu mock phục vụ UI.
 * Chưa phải chính sách học bổng / voucher chính thức.
 * ============================================================
 */

function scholarship70(baseTuition: number): ScholarshipSelection {
  return {
    id: "scholarship-hb70",

    label: "HB 70%",

    valueType: "PERCENT",

    value: 70,

    discountAmount: Math.round(baseTuition * 0.7),
  };
}

function scholarship60(baseTuition: number): ScholarshipSelection {
  return {
    id: "scholarship-hb60",

    label: "HB 60%",

    valueType: "PERCENT",

    value: 60,

    discountAmount: Math.round(baseTuition * 0.6),
  };
}

const demoVoucher300k: VoucherSelection = {
  /*
   * Chưa có danh mục voucher chính thức
   * từ trung tâm nên đây chỉ là mock UI.
   */
  code: "VC-DEMO-300K",

  label: "Voucher demo 300.000đ",

  valueType: "FIXED_AMOUNT",

  value: 300000,

  discountAmount: 300000,

  note: "Voucher mock phục vụ GĐ6 UI; thay bằng policy thật khi trung tâm cung cấp.",
};

/*
 * ============================================================
 * COURSE REFERENCES
 * ============================================================
 */

const hsk3Catalog = requireCourseCatalogItem("course-small-group-hsk-3-3-0");

const hsk4Catalog = requireCourseCatalogItem("course-small-group-hsk-4-3-0");

const hsk1Catalog = requireCourseCatalogItem("course-small-group-hsk-1-3-0");

const ieltsFoundationCatalog = requireCourseCatalogItem(
  "course-small-group-ielts-foundation"
);

const ielts45Catalog = requireCourseCatalogItem("course-small-group-ielts-4-5");

/*
 * ============================================================
 * ENROLLMENT MOCK
 * ============================================================
 */

export const enrollmentDraftsMock: EnrollmentDraft[] = [
  /*
   * ----------------------------------------------------------
   * CASE 1
   * HSK ONLY + nhiều khóa + draft
   * ----------------------------------------------------------
   */
  {
    id: "enrollment-draft-001",

    enrollmentCode: "ENR-2026-0201",

    studentId: "student-001",

    programs: [
      {
        program: "NET_HSK",

        inputAssessmentUrl: "https://example.com/tests/minh-anh-hsk",

        outputGoal: "Hoàn thành HSK 4 và đủ nền tảng tiếp tục HSK 5.",
      },
    ],

    items: [
      buildEnrollmentItem({
        id: "enrollment-item-001",

        courseCatalogId: hsk3Catalog.id,

        classCode: "HSK3-A01",

        scholarship: scholarship70(hsk3Catalog.baseTuition),

        finalTuition: 1794000,
      }),

      buildEnrollmentItem({
        id: "enrollment-item-002",

        courseCatalogId: hsk4Catalog.id,

        expectedStart: "2026-12",

        scholarship: scholarship70(hsk4Catalog.baseTuition),

        finalTuition: 3894000,
      }),
    ],

    paymentPlan: {
      items: [
        {
          enrollmentItemId: "enrollment-item-001",

          mode: "FULL",

          lines: [
            {
              id: "plan-line-001",

              type: "FULL",

              label: "Thanh toán toàn bộ HSK 3 3.0",

              amount: 1794000,
            },
          ],
        },

        {
          enrollmentItemId: "enrollment-item-002",

          mode: "DEPOSIT_THEN_INSTALLMENTS",

          lines: [
            {
              id: "plan-line-002",

              type: "DEPOSIT",

              label: "Cọc HSK 4 3.0",

              amount: 500000,
            },

            {
              id: "plan-line-003",

              type: "INSTALLMENT",

              sequence: 1,

              label: "Đợt 1",

              amount: 1131333,
            },

            {
              id: "plan-line-004",

              type: "INSTALLMENT",

              sequence: 2,

              label: "Đợt 2",

              amount: 1131333,
            },

            {
              id: "plan-line-005",

              type: "INSTALLMENT",

              sequence: 3,

              label: "Đợt 3",

              amount: 1131334,
            },
          ],

          note: "Cọc không tính vào số đợt đóng học phí.",
        },
      ],
    },

    salesPersonId: "staff-001",

    salesName: "Nguyễn Minh Nhân Viên",

    specialRequirements: "Ưu tiên học sau 18:00.",

    contract: {
      status: "DRAFT",
    },

    status: "DRAFT",

    createdAt: "2026-10-03T07:30:00+07:00",

    updatedAt: "2026-10-03T07:50:00+07:00",
  },

  /*
   * ----------------------------------------------------------
   * CASE 2
   * ENGLISH ONLY + voucher + submitted
   * ----------------------------------------------------------
   */
  {
    id: "enrollment-draft-002",

    enrollmentCode: "ENR-2026-0202",

    studentId: "student-002",

    programs: [
      {
        program: "NET_ENGLISH",

        inputAssessmentUrl: "https://example.com/tests/hoang-nam-english",

        outputGoal: "IELTS 6.5.",
      },
    ],

    items: [
      buildEnrollmentItem({
        id: "enrollment-item-003",

        courseCatalogId: ieltsFoundationCatalog.id,

        classCode: "FOUND.14",

        scholarship: scholarship70(ieltsFoundationCatalog.baseTuition),

        voucher: demoVoucher300k,

        /*
         * 9.960.000
         * - HB70% = 2.988.000 còn lại
         * - voucher 300.000
         * = 2.688.000
         */
        finalTuition: 2688000,
      }),

      buildEnrollmentItem({
        id: "enrollment-item-004",

        courseCatalogId: ielts45Catalog.id,

        expectedStart: "2027-01",

        scholarship: scholarship70(ielts45Catalog.baseTuition),

        finalTuition: 2394000,
      }),
    ],

    paymentPlan: {
      items: [
        {
          enrollmentItemId: "enrollment-item-003",

          mode: "FULL",

          lines: [
            {
              id: "plan-line-006",

              type: "FULL",

              label: "Thanh toán IELTS Foundation",

              amount: 2688000,
            },
          ],
        },

        {
          enrollmentItemId: "enrollment-item-004",

          mode: "DEPOSIT_THEN_INSTALLMENTS",

          lines: [
            {
              id: "plan-line-007",

              type: "DEPOSIT",

              label: "Cọc IELTS 4.5",

              amount: 500000,
            },

            {
              id: "plan-line-008",

              type: "INSTALLMENT",

              sequence: 1,

              label: "Đợt 1",

              amount: 947000,
            },

            {
              id: "plan-line-009",

              type: "INSTALLMENT",

              sequence: 2,

              label: "Đợt 2",

              amount: 947000,
            },
          ],
        },
      ],
    },

    salesPersonId: "staff-001",

    salesName: "Nguyễn Minh Nhân Viên",

    specialRequirements: "Không học được tối thứ Ba và thứ Năm.",

    contract: {
      contractCode: "HD-2026-0202",

      documentUrl: "https://docs.google.com/document/d/example-enrollment-0202",

      status: "PENDING_SIGNATURE",
    },

    status: "SUBMITTED",

    createdAt: "2026-10-02T13:00:00+07:00",

    updatedAt: "2026-10-02T15:40:00+07:00",

    submittedAt: "2026-10-02T15:40:00+07:00",
  },

  /*
   * ----------------------------------------------------------
   * CASE 3
   * MIXED ENROLLMENT:
   * NET English + NET HSK
   * ----------------------------------------------------------
   */
  {
    id: "enrollment-draft-003",

    enrollmentCode: "ENR-2026-0203",

    studentId: "student-004",

    programs: [
      {
        program: "NET_ENGLISH",

        inputAssessmentUrl: "https://example.com/tests/thu-ha-english",

        outputGoal: "IELTS 7.0.",
      },

      {
        program: "NET_HSK",

        inputAssessmentUrl: "https://example.com/tests/thu-ha-hsk",

        outputGoal: "Đạt HSK 3.",
      },
    ],

    items: [
      buildEnrollmentItem({
        id: "enrollment-item-005",

        courseCatalogId: ieltsFoundationCatalog.id,

        expectedStart: "2026-11",

        scholarship: scholarship70(ieltsFoundationCatalog.baseTuition),

        finalTuition: 2988000,
      }),

      buildEnrollmentItem({
        id: "enrollment-item-006",

        courseCatalogId: hsk1Catalog.id,

        expectedStart: "2026-12",

        scholarship: scholarship70(hsk1Catalog.baseTuition),

        finalTuition: 1314000,
      }),
    ],

    paymentPlan: {
      items: [
        {
          enrollmentItemId: "enrollment-item-005",

          mode: "DEPOSIT_THEN_INSTALLMENTS",

          lines: [
            {
              id: "plan-line-010",

              type: "DEPOSIT",

              label: "Cọc IELTS Foundation",

              amount: 500000,
            },

            {
              id: "plan-line-011",

              type: "INSTALLMENT",

              sequence: 1,

              label: "Đợt 1",

              amount: 1244000,
            },

            {
              id: "plan-line-012",

              type: "INSTALLMENT",

              sequence: 2,

              label: "Đợt 2",

              amount: 1244000,
            },
          ],
        },

        {
          enrollmentItemId: "enrollment-item-006",

          mode: "FULL",

          lines: [
            {
              id: "plan-line-013",

              type: "FULL",

              label: "Thanh toán HSK 1 3.0",

              amount: 1314000,
            },
          ],
        },
      ],
    },

    salesPersonId: "staff-001",

    salesName: "Nguyễn Minh Nhân Viên",

    specialRequirements: "Ưu tiên học buổi tối, không học tối thứ Sáu.",

    contract: {
      contractCode: "HD-2026-0203",

      documentUrl: "https://docs.google.com/document/d/example-enrollment-0203",

      status: "PENDING_SIGNATURE",
    },

    status: "SUBMITTED",

    createdAt: "2026-10-03T08:00:00+07:00",

    updatedAt: "2026-10-03T08:45:00+07:00",

    submittedAt: "2026-10-03T08:45:00+07:00",
  },

  /*
   * ----------------------------------------------------------
   * CASE 4
   * DRAFT CHƯA HOÀN THIỆN
   *
   * Dùng test Resume Draft.
   * ----------------------------------------------------------
   */
  {
    id: "enrollment-draft-004",

    enrollmentCode: "ENR-2026-0204",

    studentId: "student-003",

    programs: [
      {
        program: "NET_HSK",

        /*
         * Draft được phép chưa có test.
         */
        inputAssessmentUrl: undefined,

        outputGoal: "Đạt HSK 4.",
      },
    ],

    items: [
      buildEnrollmentItem({
        id: "enrollment-item-007",

        courseCatalogId: hsk4Catalog.id,

        /*
         * Chưa chọn lớp hoặc thời gian.
         * Draft được phép.
         */
        finalTuition: Math.round(hsk4Catalog.baseTuition * 0.4),

        scholarship: scholarship60(hsk4Catalog.baseTuition),
      }),
    ],

    paymentPlan: {
      items: [],
    },

    salesPersonId: "staff-002",

    salesName: "Phạm Minh Tuấn",

    specialRequirements: undefined,

    contract: undefined,

    status: "DRAFT",

    createdAt: "2026-10-03T09:00:00+07:00",

    updatedAt: "2026-10-03T09:10:00+07:00",
  },
];

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

export function getEnrollmentMock(enrollmentId: string) {
  return enrollmentDraftsMock.find(
    (enrollment) => enrollment.id === enrollmentId
  );
}

export function getEnrollmentByCodeMock(enrollmentCode: string) {
  return enrollmentDraftsMock.find(
    (enrollment) => enrollment.enrollmentCode === enrollmentCode
  );
}

export const enrollmentListMock: EnrollmentListItem[] =
  enrollmentDraftsMock.map((enrollment) => {
    const student = studentListMock.find(
      (item) => item.id === enrollment.studentId
    );

    const programs = Array.from(
      new Set(enrollment.programs.map((item) => item.program))
    );

    const totalFinalTuition = enrollment.items.reduce(
      (total, item) => total + item.finalTuition,
      0
    );

    return {
      id: enrollment.id,

      enrollmentCode: enrollment.enrollmentCode,

      studentId: enrollment.studentId,

      studentCode: student?.studentCode ?? "—",

      studentName: student?.fullName ?? "Không xác định",

      programs,

      itemCount: enrollment.items.length,

      totalFinalTuition,

      status: enrollment.status,

      salesName: enrollment.salesName,

      createdAt: enrollment.createdAt,

      updatedAt: enrollment.updatedAt,
    };
  });
