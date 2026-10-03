import { z } from "zod";

const paymentMethodSchema = z.enum(["BANK_TRANSFER", "CASH", "OTHER"]);

const paymentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "RETURNED",
  "CANCELLED",
]);

export const paymentProofSchema = z.object({
  id: z.string().min(1),

  fileName: z.string().trim().min(1, "Thiếu tên file minh chứng."),

  mimeType: z.string().trim().min(1, "Thiếu định dạng file."),

  url: z.string().trim().min(1, "Thiếu đường dẫn minh chứng."),

  uploadedAt: z.string().min(1),
});

export const paymentAllocationSchema = z.object({
  id: z.string().min(1),

  paymentId: z.string().min(1),

  enrollmentItemId: z.string().min(1, "Chưa chọn khóa nhận tiền."),

  amount: z.number().positive("Số tiền phân bổ phải lớn hơn 0."),
});

export const paymentSchema = z
  .object({
    id: z.string().min(1),

    paymentCode: z.string().min(1),

    studentId: z.string().min(1, "Thiếu học viên."),

    enrollmentId: z.string().min(1, "Thiếu hồ sơ ghi danh."),

    amount: z.number().positive("Số tiền giao dịch phải lớn hơn 0."),

    method: paymentMethodSchema,

    paidAt: z.string().min(1, "Vui lòng nhập ngày nhận tiền."),

    proof: paymentProofSchema.optional(),

    status: paymentStatusSchema,

    note: z.string().optional(),

    allocations: z.array(paymentAllocationSchema),

    createdByUserId: z.string().optional(),

    createdByName: z.string().optional(),

    createdAt: z.string().min(1),

    updatedAt: z.string().min(1),

    confirmedAt: z.string().optional(),

    confirmedByUserId: z.string().optional(),

    confirmedByName: z.string().optional(),

    returnedAt: z.string().optional(),

    returnedReason: z.string().optional(),

    cancelledAt: z.string().optional(),

    cancelledReason: z.string().optional(),

    replacementPaymentId: z.string().optional(),

    replacesPaymentId: z.string().optional(),
  })
  .superRefine((payment, context) => {
    /*
     * BANK TRANSFER
     * cần proof trước khi ghi nhận
     * thành Payment PENDING.
     */
    if (payment.method === "BANK_TRANSFER" && !payment.proof) {
      context.addIssue({
        code: "custom",

        path: ["proof"],

        message: "Thanh toán chuyển khoản cần ảnh minh chứng.",
      });
    }

    /*
     * Payment phải có allocation.
     */
    if (payment.allocations.length === 0) {
      context.addIssue({
        code: "custom",

        path: ["allocations"],

        message: "Phải phân bổ giao dịch vào ít nhất một khóa.",
      });
    }

    /*
     * Không cho cùng một Course
     * xuất hiện hai allocation trong
     * cùng Payment.
     */
    const allocatedItems = new Set<string>();

    payment.allocations.forEach((allocation, index) => {
      if (allocatedItems.has(allocation.enrollmentItemId)) {
        context.addIssue({
          code: "custom",

          path: ["allocations", index, "enrollmentItemId"],

          message: "Một khóa chỉ được xuất hiện một lần trong cùng giao dịch.",
        });
      }

      allocatedItems.add(allocation.enrollmentItemId);

      if (allocation.paymentId !== payment.id) {
        context.addIssue({
          code: "custom",

          path: ["allocations", index, "paymentId"],

          message: "Allocation không thuộc giao dịch hiện tại.",
        });
      }
    });

    /*
     * Toàn bộ Payment phải được phân bổ.
     */
    const allocatedTotal = payment.allocations.reduce(
      (total, allocation) => total + allocation.amount,
      0
    );

    if (allocatedTotal !== payment.amount) {
      context.addIssue({
        code: "custom",

        path: ["allocations"],

        message: "Tổng tiền phân bổ phải bằng đúng số tiền giao dịch.",
      });
    }

    /*
     * RETURNED phải có lý do.
     */
    if (payment.status === "RETURNED" && !payment.returnedReason?.trim()) {
      context.addIssue({
        code: "custom",

        path: ["returnedReason"],

        message: "Giao dịch bị trả lại phải có lý do.",
      });
    }

    /*
     * CANCELLED phải giữ lý do adjustment.
     */
    if (payment.status === "CANCELLED" && !payment.cancelledReason?.trim()) {
      context.addIssue({
        code: "custom",

        path: ["cancelledReason"],

        message: "Giao dịch bị hủy phải có lý do.",
      });
    }
  });

/*
 * ============================================================
 * CROSS-AGGREGATE VALIDATION
 *
 * Schema factory dùng khi UI đã biết
 * các EnrollmentItem hợp lệ của Enrollment.
 * ============================================================
 */

export function createPaymentRecordSchema(allowedEnrollmentItemIds: string[]) {
  const allowedIds = new Set(allowedEnrollmentItemIds);

  return paymentSchema.superRefine((payment, context) => {
    payment.allocations.forEach((allocation, index) => {
      if (!allowedIds.has(allocation.enrollmentItemId)) {
        context.addIssue({
          code: "custom",

          path: ["allocations", index, "enrollmentItemId"],

          message: "Khóa nhận tiền không thuộc Enrollment hiện tại.",
        });
      }
    });
  });
}

export const paymentRecordBaseSchema = z
  .object({
    studentId: z.string().min(1, "Vui lòng chọn học viên."),

    enrollmentId: z.string().min(1, "Vui lòng chọn hồ sơ ghi danh."),

    amount: z.number().positive("Số tiền giao dịch phải lớn hơn 0."),

    method: paymentMethodSchema,

    paidAt: z.string().min(1, "Vui lòng nhập thời điểm nhận tiền."),

    proof: paymentProofSchema.optional(),

    note: z.string().optional(),
  })
  .superRefine((payment, context) => {
    if (payment.method === "BANK_TRANSFER" && !payment.proof) {
      context.addIssue({
        code: "custom",

        path: ["proof"],

        message: "Thanh toán chuyển khoản cần ảnh minh chứng.",
      });
    }
  });

export type PaymentRecordBaseValues = z.infer<typeof paymentRecordBaseSchema>;

export const paymentCancelSchema = z.object({
  paymentId: z.string().min(1),

  reason: z.string().trim().min(5, "Vui lòng nhập lý do điều chỉnh rõ ràng."),

  replacementPaymentId: z.string().optional(),
});

export type PaymentValues = z.infer<typeof paymentSchema>;

export type PaymentCancelValues = z.infer<typeof paymentCancelSchema>;
