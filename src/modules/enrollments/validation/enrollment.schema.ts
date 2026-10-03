import { z } from "zod";

const programSchema = z.enum(["NET_HSK", "NET_ENGLISH"]);

const courseTrackSchema = z.enum([
  "IELTS",
  "HSK_3_0",
  "TOEIC",
  "COMMUNICATION",
]);

const deliveryModeSchema = z.enum(["SMALL_GROUP", "ONE_TO_ONE"]);

const enrollmentStatusSchema = z.enum([
  "DRAFT",
  "SUBMITTED",
  "RETURNED",
  "APPROVED",
  "COMPLETED",
  "CANCELLED",
]);

const optionalUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => value.length === 0 || /^https?:\/\/.+/i.test(value),
    "Link không hợp lệ."
  )
  .optional();

const enrollmentProgramDraftSchema = z.object({
  program: programSchema,

  inputAssessmentUrl: optionalUrlSchema,

  outputGoal: z.string().trim().default(""),
});

const discountValueTypeSchema = z.enum(["PERCENT", "FIXED_AMOUNT"]);

const scholarshipSchema = z.object({
  id: z.string().min(1),

  label: z.string().min(1),

  valueType: discountValueTypeSchema,

  value: z.number().nonnegative(),

  discountAmount: z.number().nonnegative(),

  approvedBy: z.string().optional(),

  note: z.string().optional(),
});

const voucherSchema = z.object({
  code: z.string().min(1),

  label: z.string().min(1),

  valueType: discountValueTypeSchema,

  value: z.number().nonnegative(),

  discountAmount: z.number().nonnegative(),

  note: z.string().optional(),
});

const enrollmentItemDraftSchema = z.object({
  id: z.string().min(1),

  courseCatalogId: z.string().min(1),

  program: programSchema,

  track: courseTrackSchema,

  deliveryMode: deliveryModeSchema,

  courseName: z.string().min(1),

  classMode: z.enum(["CLASS", "EXPECTED_START"]),

  classCode: z.string().optional(),

  expectedStart: z.string().optional(),

  baseTuition: z.number().nonnegative(),

  scholarship: scholarshipSchema.optional(),

  voucher: voucherSchema.optional(),

  finalTuition: z.number().nonnegative(),
});

const paymentPlanLineSchema = z.object({
  id: z.string().min(1),

  type: z.enum(["FULL", "DEPOSIT", "INSTALLMENT"]),

  sequence: z.number().int().positive().optional(),

  label: z.string().min(1),

  amount: z.number().positive(),

  dueDate: z.string().optional(),
});

const itemPaymentPlanSchema = z.object({
  enrollmentItemId: z.string().min(1),

  mode: z.enum(["FULL", "INSTALLMENTS", "DEPOSIT_THEN_INSTALLMENTS"]),

  lines: z.array(paymentPlanLineSchema),

  note: z.string().optional(),
});

const paymentPlanSchema = z.object({
  items: z.array(itemPaymentPlanSchema),
});

const contractDraftSchema = z.object({
  contractCode: z.string().optional(),

  documentUrl: optionalUrlSchema,

  status: z.enum(["DRAFT", "PENDING_SIGNATURE"]),
});

/*
 * ============================================================
 * SAVE DRAFT
 *
 * Draft được phép thiếu gần như toàn bộ dữ liệu nghiệp vụ,
 * nhưng phải xác định được Student.
 * ============================================================
 */

export const enrollmentSaveDraftSchema = z.object({
  id: z.string().min(1),

  enrollmentCode: z.string().min(1),

  studentId: z.string().min(1, "Vui lòng chọn học viên."),

  programs: z.array(enrollmentProgramDraftSchema).default([]),

  items: z.array(enrollmentItemDraftSchema).default([]),

  paymentPlan: paymentPlanSchema.default({
    items: [],
  }),

  salesPersonId: z.string().optional(),

  salesName: z.string().optional(),

  specialRequirements: z.string().optional(),

  contract: contractDraftSchema.optional(),

  status: enrollmentStatusSchema,

  createdAt: z.string().min(1),

  updatedAt: z.string().min(1),

  submittedAt: z.string().optional(),
});

/*
 * ============================================================
 * SUBMIT
 *
 * Gửi duyệt yêu cầu hồ sơ hoàn chỉnh.
 * ============================================================
 */

export const enrollmentSubmitSchema = enrollmentSaveDraftSchema.superRefine(
  (enrollment, context) => {
    /*
     * --------------------------------------------------------
     * PROGRAM
     * --------------------------------------------------------
     */

    if (enrollment.programs.length === 0) {
      context.addIssue({
        code: "custom",

        path: ["programs"],

        message: "Phải chọn ít nhất một chương trình.",
      });
    }

    const selectedPrograms = new Set<string>();

    enrollment.programs.forEach((programInfo, index) => {
      if (selectedPrograms.has(programInfo.program)) {
        context.addIssue({
          code: "custom",

          path: ["programs", index, "program"],

          message: "Chương trình bị trùng.",
        });
      }

      selectedPrograms.add(programInfo.program);

      if (!programInfo.inputAssessmentUrl?.trim()) {
        context.addIssue({
          code: "custom",

          path: ["programs", index, "inputAssessmentUrl"],

          message: "Vui lòng nhập link kết quả đầu vào.",
        });
      }

      if (!programInfo.outputGoal.trim()) {
        context.addIssue({
          code: "custom",

          path: ["programs", index, "outputGoal"],

          message: "Vui lòng nhập mục tiêu đầu ra.",
        });
      }
    });

    /*
     * --------------------------------------------------------
     * COURSE ITEMS
     * --------------------------------------------------------
     */

    if (enrollment.items.length === 0) {
      context.addIssue({
        code: "custom",

        path: ["items"],

        message: "Phải có ít nhất một khóa học.",
      });
    }

    enrollment.items.forEach((item, index) => {
      if (!selectedPrograms.has(item.program)) {
        context.addIssue({
          code: "custom",

          path: ["items", index, "program"],

          message: "Khóa học thuộc chương trình chưa được chọn.",
        });
      }

      if (item.classMode === "CLASS" && !item.classCode?.trim()) {
        context.addIssue({
          code: "custom",

          path: ["items", index, "classCode"],

          message: "Vui lòng chọn lớp.",
        });
      }

      if (item.classMode === "EXPECTED_START" && !item.expectedStart?.trim()) {
        context.addIssue({
          code: "custom",

          path: ["items", index, "expectedStart"],

          message: "Vui lòng nhập thời gian dự kiến học.",
        });
      }

      if (item.finalTuition > item.baseTuition) {
        context.addIssue({
          code: "custom",

          path: ["items", index, "finalTuition"],

          message: "Học phí cuối không được lớn hơn học phí gốc.",
        });
      }
    });

    /*
     * --------------------------------------------------------
     * PAYMENT PLAN
     * --------------------------------------------------------
     */

    enrollment.items.forEach((item, itemIndex) => {
      const plan = enrollment.paymentPlan.items.find(
        (candidate) => candidate.enrollmentItemId === item.id
      );

      if (!plan) {
        context.addIssue({
          code: "custom",

          path: ["paymentPlan", "items"],

          message: `Khóa ${item.courseName} chưa có kế hoạch thanh toán.`,
        });

        return;
      }

      if (plan.lines.length === 0) {
        context.addIssue({
          code: "custom",

          path: ["paymentPlan", "items", itemIndex, "lines"],

          message: "Kế hoạch thanh toán chưa có đợt đóng.",
        });

        return;
      }

      const installmentLines = plan.lines.filter(
        (line) => line.type === "INSTALLMENT"
      );

      if (installmentLines.length > 3) {
        context.addIssue({
          code: "custom",

          path: ["paymentPlan", "items", itemIndex, "lines"],

          message: "Mỗi khóa chỉ được chia tối đa 3 đợt, không tính tiền cọc.",
        });
      }

      const plannedTotal = plan.lines.reduce(
        (total, line) => total + line.amount,
        0
      );

      if (plannedTotal !== item.finalTuition) {
        context.addIssue({
          code: "custom",

          path: ["paymentPlan", "items", itemIndex],

          message: `Tổng kế hoạch thanh toán của ${item.courseName} phải bằng học phí cuối cùng.`,
        });
      }
    });

    /*
     * --------------------------------------------------------
     * SALE
     * --------------------------------------------------------
     */

    if (!enrollment.salesPersonId?.trim()) {
      context.addIssue({
        code: "custom",

        path: ["salesPersonId"],

        message: "Vui lòng chọn sale phụ trách.",
      });
    }

    /*
     * --------------------------------------------------------
     * SPECIAL REQUIREMENTS
     *
     * Google Form cũ bắt buộc field này.
     * Nếu không có yêu cầu thì nhân viên có thể nhập
     * "Không có".
     * --------------------------------------------------------
     */

    if (!enrollment.specialRequirements?.trim()) {
      context.addIssue({
        code: "custom",

        path: ["specialRequirements"],

        message: "Vui lòng nhập yêu cầu riêng hoặc ghi 'Không có'.",
      });
    }

    /*
     * --------------------------------------------------------
     * CONTRACT
     * --------------------------------------------------------
     */

    if (!enrollment.contract) {
      context.addIssue({
        code: "custom",

        path: ["contract"],

        message: "Vui lòng bổ sung hợp đồng.",
      });
    } else if (!enrollment.contract.documentUrl?.trim()) {
      context.addIssue({
        code: "custom",

        path: ["contract", "documentUrl"],

        message: "Vui lòng nhập link hợp đồng.",
      });
    }
  }
);

export type EnrollmentSaveDraftValues = z.infer<
  typeof enrollmentSaveDraftSchema
>;

export type EnrollmentSubmitValues = z.infer<typeof enrollmentSubmitSchema>;
