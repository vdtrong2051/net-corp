"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ImagePlus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { EnrollmentDraft } from "@/modules/enrollments/model/enrollment.types";

import type {
  EnrollmentFinancialSummary,
  Payment,
  PaymentAllocation,
  PaymentMethod,
  PaymentProof,
} from "@/modules/payments/model/payment.types";

import { createMockPaymentProof } from "@/modules/payments/service/payment-proof.mock";

import {
  createPaymentRecordSchema,
  paymentCancelSchema,
} from "@/modules/payments/validation/payment.schema";

export type PaymentCorrectionMode = "EDIT_PENDING" | "ADJUST_CONFIRMED";

type PaymentCorrectionPanelProps = {
  mode: PaymentCorrectionMode;

  payment: Payment;

  enrollment: EnrollmentDraft;

  financialSummary: EnrollmentFinancialSummary;

  existingPaymentCodes: string[];

  onClose: () => void;

  onEditPending: (payment: Payment) => void;

  onCreateAdjustment: (
    cancelledPayment: Payment,
    replacementPayment: Payment
  ) => void;
};

const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Chuyển khoản",

  CASH: "Tiền mặt",

  OTHER: "Khác",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

function getNextPaymentCode(existingCodes: string[]) {
  const year = new Date().getFullYear();

  const prefix = `PAY-${year}-`;

  const max = existingCodes.reduce((currentMax, code) => {
    if (!code.startsWith(prefix)) {
      return currentMax;
    }

    const value = Number.parseInt(code.slice(prefix.length), 10);

    if (Number.isNaN(value)) {
      return currentMax;
    }

    return Math.max(currentMax, value);
  }, 0);

  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export function PaymentCorrectionPanel({
  mode,
  payment,
  enrollment,
  financialSummary,
  existingPaymentCodes,
  onClose,
  onEditPending,
  onCreateAdjustment,
}: PaymentCorrectionPanelProps) {
  const [amount, setAmount] = useState(payment.amount);

  const [method, setMethod] = useState<PaymentMethod>(payment.method);

  const [paidAt, setPaidAt] = useState(toDateTimeLocal(payment.paidAt));

  const [note, setNote] = useState(payment.note ?? "");

  const [proof, setProof] = useState<PaymentProof | undefined>(payment.proof);

  const [reason, setReason] = useState("");

  const [allocations, setAllocations] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      payment.allocations.map((allocation) => [
        allocation.enrollmentItemId,
        allocation.amount,
      ])
    )
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allocationTotal = Object.values(allocations).reduce(
    (total, value) => total + value,
    0
  );

  /*
   * Nếu đang adjustment một Payment
   * CONFIRMED, Payment cũ sẽ bị CANCELLED.
   *
   * Allocation CONFIRMED cũ vì thế
   * không còn làm giảm công nợ.
   *
   * Giới hạn allocation mới phải:
   *
   * current remaining
   * +
   * old confirmed allocation
   */
  const itemLimits = useMemo(
    () =>
      new Map(
        financialSummary.items.map((financial) => {
          const oldAllocation =
            payment.allocations.find(
              (allocation) =>
                allocation.enrollmentItemId === financial.enrollmentItemId
            )?.amount ?? 0;

          const limit =
            mode === "ADJUST_CONFIRMED"
              ? financial.remainingAmount + oldAllocation
              : financial.remainingAmount;

          return [financial.enrollmentItemId, limit] as const;
        })
      ),
    [financialSummary, payment.allocations, mode]
  );

  const hasCourseOverflow = Object.entries(allocations).some(
    ([enrollmentItemId, value]) =>
      value > (itemLimits.get(enrollmentItemId) ?? 0)
  );

  const unallocated = amount - allocationTotal;

  function updateAllocation(enrollmentItemId: string, nextAmount: number) {
    const safe = Number.isFinite(nextAmount)
      ? Math.max(Math.trunc(nextAmount), 0)
      : 0;

    setAllocations((current) => {
      const next = {
        ...current,
      };

      if (safe === 0) {
        delete next[enrollmentItemId];
      } else {
        next[enrollmentItemId] = safe;
      }

      return next;
    });
  }

  function removeProof() {
    setProof(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleFile(file?: File) {
    if (!file) {
      return;
    }

    try {
      /*
       * GĐ7.9:
       *
       * Không dùng URL.createObjectURL.
       * Proof mock được chuyển thành Data URL
       * để persist qua localStorage.
       */
      const nextProof = await createMockPaymentProof(file);

      setProof(nextProof);
    } catch (error) {
      toast.error("Không thể chọn ảnh", {
        description:
          error instanceof Error ? error.message : "File không hợp lệ.",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function buildAllocations(paymentId: string): PaymentAllocation[] {
    return Object.entries(allocations)
      .filter(([, value]) => value > 0)
      .map(([enrollmentItemId, value]) => ({
        id: `allocation-${crypto.randomUUID()}`,

        paymentId,

        enrollmentItemId,

        amount: value,
      }));
  }

  function validateCommon() {
    if (amount <= 0) {
      toast.error("Số tiền không hợp lệ", {
        description: "Số tiền giao dịch phải lớn hơn 0.",
      });

      return false;
    }

    if (allocationTotal !== amount) {
      toast.error("Allocation chưa cân", {
        description: "Tổng allocation phải bằng đúng số tiền giao dịch.",
      });

      return false;
    }

    if (hasCourseOverflow) {
      toast.error("Allocation vượt công nợ", {
        description: "Có khóa đang nhận nhiều hơn công nợ cho phép.",
      });

      return false;
    }

    if (method === "BANK_TRANSFER" && !proof) {
      toast.error("Thiếu minh chứng", {
        description: "Chuyển khoản cần ảnh minh chứng.",
      });

      return false;
    }

    return true;
  }

  function handleSave() {
    if (!validateCommon()) {
      return;
    }

    const allowedIds = enrollment.items.map((item) => item.id);

    /*
     * =====================================================
     * EDIT PENDING
     *
     * Payment chưa CONFIRMED nên được phép
     * sửa trực tiếp record hiện tại.
     * =====================================================
     */
    if (mode === "EDIT_PENDING") {
      const now = new Date().toISOString();

      const updated: Payment = {
        ...payment,

        amount,

        method,

        paidAt,

        proof,

        note: note.trim() || undefined,

        allocations: buildAllocations(payment.id),

        updatedAt: now,
      };

      const schema = createPaymentRecordSchema(allowedIds);

      const result = schema.safeParse(updated);

      if (!result.success) {
        toast.error("Không thể cập nhật", {
          description:
            result.error.issues[0]?.message ??
            "Dữ liệu giao dịch không hợp lệ.",
        });

        return;
      }

      onEditPending(updated);

      toast.success("Đã cập nhật Payment PENDING", {
        description: updated.paymentCode,
      });

      return;
    }

    /*
     * =====================================================
     * ADJUST CONFIRMED
     *
     * Payment CONFIRMED tuyệt đối không edit trực tiếp.
     *
     * Flow:
     *
     * old CONFIRMED
     *    ↓
     * CANCELLED
     *    ↓
     * replacement PENDING
     * =====================================================
     */

    const replacementId = `payment-${crypto.randomUUID()}`;

    const replacementCode = getNextPaymentCode(existingPaymentCodes);

    const now = new Date().toISOString();

    const cancelResult = paymentCancelSchema.safeParse({
      paymentId: payment.id,

      reason,

      replacementPaymentId: replacementId,
    });

    if (!cancelResult.success) {
      toast.error("Thiếu lý do điều chỉnh", {
        description:
          cancelResult.error.issues[0]?.message ??
          "Vui lòng nhập lý do điều chỉnh.",
      });

      return;
    }

    const replacement: Payment = {
      id: replacementId,

      paymentCode: replacementCode,

      studentId: payment.studentId,

      enrollmentId: payment.enrollmentId,

      amount,

      method,

      paidAt,

      proof,

      status: "PENDING",

      note: note.trim() || undefined,

      allocations: buildAllocations(replacementId),

      createdAt: now,

      updatedAt: now,

      replacesPaymentId: payment.id,
    };

    const schema = createPaymentRecordSchema(allowedIds);

    const replacementResult = schema.safeParse(replacement);

    if (!replacementResult.success) {
      toast.error("Payment thay thế không hợp lệ", {
        description:
          replacementResult.error.issues[0]?.message ??
          "Dữ liệu Payment thay thế không hợp lệ.",
      });

      return;
    }

    const cancelled: Payment = {
      ...payment,

      status: "CANCELLED",

      cancelledAt: now,

      cancelledReason: reason.trim(),

      replacementPaymentId: replacement.id,

      updatedAt: now,
    };

    onCreateAdjustment(cancelled, replacement);

    toast.success("Đã tạo giao dịch thay thế", {
      description: `${payment.paymentCode} → ${replacement.paymentCode}`,
    });
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>
              {mode === "EDIT_PENDING"
                ? "Sửa giao dịch đang chờ"
                : "Điều chỉnh giao dịch đã xác nhận"}
            </CardTitle>

            <CardDescription>
              {mode === "EDIT_PENDING"
                ? "Payment chưa được xác nhận nên có thể sửa trực tiếp."
                : "Payment cũ sẽ bị hủy và một Payment PENDING mới được tạo thay thế."}
            </CardDescription>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            <X />
            Đóng
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6">
          {mode === "ADJUST_CONFIRMED" ? (
            <div className="grid gap-2">
              <label
                htmlFor="adjustment-reason"
                className="text-sm font-medium"
              >
                Lý do điều chỉnh
              </label>

              <Textarea
                id="adjustment-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ví dụ: nhập sai số tiền, phân bổ nhầm khóa..."
                className="min-h-24"
              />

              <p className="text-muted-foreground text-xs">
                Record cũ không bị xóa hoặc sửa amount trực tiếp.
              </p>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="correction-amount"
                className="text-sm font-medium"
              >
                Số tiền
              </label>

              <Input
                id="correction-amount"
                type="number"
                min={0}
                step={1000}
                value={amount || ""}
                onChange={(event) => setAmount(Number(event.target.value) || 0)}
              />

              {amount > 0 ? (
                <p className="text-muted-foreground text-xs tabular-nums">
                  {formatCurrency(amount)}
                </p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="correction-method"
                className="text-sm font-medium"
              >
                Phương thức
              </label>

              <Select
                value={method}
                onValueChange={(value) =>
                  setMethod((value ?? "BANK_TRANSFER") as PaymentMethod)
                }
              >
                <SelectTrigger id="correction-method" className="w-full">
                  <span>{methodLabels[method]}</span>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>

                  <SelectItem value="CASH">Tiền mặt</SelectItem>

                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="correction-paid-at"
                className="text-sm font-medium"
              >
                Thời điểm nhận
              </label>

              <Input
                id="correction-paid-at"
                type="datetime-local"
                value={paidAt}
                onChange={(event) => setPaidAt(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="correction-note" className="text-sm font-medium">
                Ghi chú
              </label>

              <Textarea
                id="correction-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ghi chú giao dịch..."
                className="min-h-20"
              />
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <p className="text-sm font-medium">Allocation</p>

              <p className="text-muted-foreground mt-1 text-xs">
                Tổng allocation phải bằng đúng số tiền giao dịch.
              </p>
            </div>

            {enrollment.items.map((item) => {
              const current = allocations[item.id] ?? 0;

              const limit = itemLimits.get(item.id) ?? 0;

              const overflow = current > limit;

              return (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-end">
                    <div>
                      <p className="font-medium">{item.courseName}</p>

                      <p className="text-muted-foreground mt-1 text-xs">
                        Có thể phân tối đa: {formatCurrency(limit)}
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor={`correction-allocation-${item.id}`}
                        className="text-sm font-medium"
                      >
                        Số tiền phân bổ
                      </label>

                      <Input
                        id={`correction-allocation-${item.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={current || ""}
                        onChange={(event) =>
                          updateAllocation(
                            item.id,
                            Number(event.target.value) || 0
                          )
                        }
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {overflow ? (
                    <p className="text-destructive mt-2 text-xs">
                      Allocation vượt công nợ cho phép của khóa này.
                    </p>
                  ) : null}
                </div>
              );
            })}

            <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs">Payment</p>

                <p className="mt-1 font-medium tabular-nums">
                  {formatCurrency(amount)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Allocation</p>

                <p className="mt-1 font-medium tabular-nums">
                  {formatCurrency(allocationTotal)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Chưa phân bổ</p>

                <p
                  className={
                    unallocated === 0
                      ? "mt-1 font-medium tabular-nums"
                      : "text-destructive mt-1 font-medium tabular-nums"
                  }
                >
                  {formatCurrency(unallocated)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div>
              <p className="text-sm font-medium">Minh chứng</p>

              <p className="text-muted-foreground mt-1 text-xs">
                Chuyển khoản bắt buộc có ảnh minh chứng.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />

            {proof ? (
              <div className="grid gap-4 rounded-lg border p-4 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div
                  className="bg-muted aspect-video rounded-md border bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("${proof.url}")`,
                  }}
                  aria-label="Preview minh chứng thanh toán"
                />

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <p className="font-medium break-all">{proof.fileName}</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {proof.mimeType}
                    </p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      Proof mock có thể persist qua F5.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus />
                      Thay ảnh
                    </Button>

                    <Button type="button" variant="ghost" onClick={removeProof}>
                      <Trash2 />
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="hover:bg-muted/30 flex w-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="text-muted-foreground size-6" />

                <p className="mt-3 font-medium">Chọn ảnh minh chứng</p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Nhấn để chọn file ảnh từ máy.
                </p>
              </button>
            )}

            {method === "BANK_TRANSFER" && !proof ? (
              <p className="text-destructive text-xs">
                Chuyển khoản cần ảnh minh chứng.
              </p>
            ) : null}

            <p className="text-muted-foreground text-xs">
              Mock hiện giới hạn ảnh nhỏ để lưu localStorage. GĐ21 sẽ thay bằng
              Private Blob.
            </p>
          </div>

          {mode === "ADJUST_CONFIRMED" ? (
            <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-sm font-medium">
                    Đây là adjustment, không phải edit.
                  </p>

                  <p className="text-muted-foreground mt-1 text-xs">
                    {payment.paymentCode} sẽ chuyển sang CANCELLED và hệ thống
                    tạo một Payment PENDING mới.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>

            <Button type="button" onClick={handleSave}>
              <Save />

              {mode === "EDIT_PENDING" ? "Lưu thay đổi" : "Tạo adjustment"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
