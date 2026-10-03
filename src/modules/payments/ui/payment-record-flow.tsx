"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileImage,
  ImagePlus,
  ReceiptText,
  Send,
  Trash2,
  Upload,
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
  Payment,
  PaymentAllocation,
  PaymentMethod,
  PaymentRecordDraft,
} from "@/modules/payments/model/payment.types";

import { buildEnrollmentFinancialSummary } from "@/modules/payments/service/payment-financial.service";
import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";
import { createMockPaymentProof } from "@/modules/payments/service/payment-proof.mock";

import {
  PaymentAllocationStep,
  type PaymentAllocationDraftMap,
} from "@/modules/payments/ui/payment-allocation-step";

import {
  createPaymentRecordSchema,
  paymentRecordBaseSchema,
} from "@/modules/payments/validation/payment.schema";

import type { StudentListItem } from "@/modules/students/model/student.types";

import { StatusBadge } from "@/shared/ui/feedback/status-badge";
import { PageContainer } from "@/shared/ui/layout/page-container";

type PaymentRecordFlowProps = {
  students: StudentListItem[];

  enrollments: EnrollmentDraft[];

  initialEnrollmentId?: string;
};

type PaymentRecordStep = 1 | 2 | 3;

type PaymentIdentity = {
  id: string;

  paymentCode: string;
};

const methodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Chuyển khoản",
  CASH: "Tiền mặt",
  OTHER: "Khác",
};

function getLocalDateTimeValue() {
  const now = new Date();

  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInitialEnrollment(
  enrollments: EnrollmentDraft[],
  initialEnrollmentId?: string
) {
  if (!initialEnrollmentId) {
    return undefined;
  }

  return enrollments.find(
    (enrollment) => enrollment.id === initialEnrollmentId
  );
}

function getNextPaymentCode(payments: Payment[]) {
  const year = new Date().getFullYear();

  const prefix = `PAY-${year}-`;

  const maxNumber = payments.reduce((max, payment) => {
    if (!payment.paymentCode.startsWith(prefix)) {
      return max;
    }

    const numericPart = Number.parseInt(
      payment.paymentCode.slice(prefix.length),
      10
    );

    if (Number.isNaN(numericPart)) {
      return max;
    }

    return Math.max(max, numericPart);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;
}

type StepIndicatorProps = {
  step: PaymentRecordStep;

  currentStep: PaymentRecordStep;

  title: string;
};

function StepIndicator({ step, currentStep, title }: StepIndicatorProps) {
  const completed = step < currentStep;

  const active = step === currentStep;

  return (
    <div
      className={[
        "rounded-lg border p-3 transition-colors",

        active ? "border-primary/40 bg-primary/5" : "",

        completed ? "bg-muted/40" : "",

        step > currentStep ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2">
        {completed ? (
          <CheckCircle2 className="text-primary size-4 shrink-0" />
        ) : (
          <span className="text-muted-foreground text-xs font-medium">
            {step}
          </span>
        )}

        <p className="text-xs font-medium">{title}</p>
      </div>

      {active ? (
        <p className="text-muted-foreground mt-1 text-xs">Đang thực hiện</p>
      ) : null}
    </div>
  );
}

export function PaymentRecordFlow({
  students,
  enrollments,
  initialEnrollmentId,
}: PaymentRecordFlowProps) {
  /*
   * GĐ7.9:
   *
   * Payment không còn được truyền từ page.
   * Shared mock store là source of truth.
   */
  const { payments, addPayment } = usePaymentMockStore();

  const initialEnrollment = getInitialEnrollment(
    enrollments,
    initialEnrollmentId
  );

  const [currentStep, setCurrentStep] = useState<PaymentRecordStep>(1);

  const [draft, setDraft] = useState<PaymentRecordDraft>(() => ({
    studentId: initialEnrollment?.studentId ?? "",

    enrollmentId: initialEnrollment?.id ?? "",

    amount: 0,

    method: "BANK_TRANSFER",

    paidAt: getLocalDateTimeValue(),

    proof: undefined,

    note: "",
  }));

  const [allocations, setAllocations] = useState<PaymentAllocationDraftMap>({});

  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const paymentIdentityRef = useRef<PaymentIdentity | null>(null);

  const availableStudents = useMemo(() => {
    const studentIds = new Set(
      enrollments
        .filter(
          (enrollment) =>
            enrollment.status !== "CANCELLED" && enrollment.items.length > 0
        )
        .map((enrollment) => enrollment.studentId)
    );

    return students.filter((student) => studentIds.has(student.id));
  }, [students, enrollments]);

  const availableEnrollments = useMemo(
    () =>
      enrollments.filter(
        (enrollment) =>
          enrollment.studentId === draft.studentId &&
          enrollment.status !== "CANCELLED" &&
          enrollment.items.length > 0
      ),
    [enrollments, draft.studentId]
  );

  const selectedStudent = students.find(
    (student) => student.id === draft.studentId
  );

  const selectedEnrollment = enrollments.find(
    (enrollment) => enrollment.id === draft.enrollmentId
  );

  /*
   * Financial Summary luôn được tính
   * bằng Payment shared state hiện tại.
   */
  const financialSummary = useMemo(() => {
    if (!selectedEnrollment) {
      return undefined;
    }

    return buildEnrollmentFinancialSummary(selectedEnrollment, payments);
  }, [selectedEnrollment, payments]);

  const allocatedTotal = Object.values(allocations).reduce(
    (total, amount) => total + amount,
    0
  );

  const unallocatedAmount = draft.amount - allocatedTotal;

  function updateDraft(patch: Partial<PaymentRecordDraft>) {
    setDraft((current) => ({
      ...current,
      ...patch,
    }));

    setCreatedPayment(null);
  }

  function handleStudentChange(studentId: string) {
    setDraft((current) => ({
      ...current,

      studentId,

      enrollmentId: "",
    }));

    setAllocations({});

    setCreatedPayment(null);

    /*
     * Student/Enrollment đổi thì
     * Payment identity cũ không còn hợp lệ.
     */
    paymentIdentityRef.current = null;
  }

  function handleEnrollmentChange(enrollmentId: string) {
    const enrollment = enrollments.find((item) => item.id === enrollmentId);

    if (!enrollment) {
      updateDraft({
        enrollmentId: "",
      });

      setAllocations({});

      paymentIdentityRef.current = null;

      return;
    }

    setDraft((current) => ({
      ...current,

      studentId: enrollment.studentId,

      enrollmentId: enrollment.id,
    }));

    setAllocations({});

    setCreatedPayment(null);

    paymentIdentityRef.current = null;
  }

  function removeProof() {
    updateDraft({
      proof: undefined,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleProofUpload(file?: File) {
    if (!file) {
      return;
    }

    try {
      /*
       * Không dùng URL.createObjectURL nữa.
       *
       * Mock proof được convert sang Data URL
       * để có thể persist trong localStorage
       * qua PaymentMockStore.
       */
      const proof = await createMockPaymentProof(file);

      updateDraft({
        proof,
      });
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

  function handleContinueToAllocation() {
    const result = paymentRecordBaseSchema.safeParse(draft);

    if (!result.success) {
      toast.error("Thông tin giao dịch chưa hợp lệ", {
        description:
          result.error.issues[0]?.message ?? "Vui lòng kiểm tra lại dữ liệu.",
      });

      return;
    }

    const enrollment = enrollments.find(
      (item) => item.id === draft.enrollmentId
    );

    if (!enrollment || enrollment.studentId !== draft.studentId) {
      toast.error("Hồ sơ ghi danh không hợp lệ", {
        description: "Enrollment không thuộc học viên đã chọn.",
      });

      return;
    }

    setCurrentStep(2);
  }

  function handleContinueToReview() {
    if (!selectedEnrollment || !financialSummary) {
      return;
    }

    const overAllocation = financialSummary.items.find(
      (financial) =>
        (allocations[financial.enrollmentItemId] ?? 0) >
        financial.remainingAmount
    );

    if (overAllocation) {
      toast.error("Allocation vượt công nợ", {
        description:
          "Không được phân bổ nhiều hơn công nợ hiện tại của từng khóa.",
      });

      return;
    }

    if (allocatedTotal !== draft.amount) {
      toast.error("Allocation chưa cân", {
        description: "Tổng tiền phân bổ phải bằng đúng số tiền giao dịch.",
      });

      return;
    }

    setCurrentStep(3);
  }

  function ensurePaymentIdentity() {
    if (paymentIdentityRef.current) {
      return paymentIdentityRef.current;
    }

    const identity: PaymentIdentity = {
      id: `payment-${crypto.randomUUID()}`,

      paymentCode: getNextPaymentCode(payments),
    };

    paymentIdentityRef.current = identity;

    return identity;
  }

  function buildPayment(): Payment | null {
    if (!selectedEnrollment) {
      return null;
    }

    const identity = ensurePaymentIdentity();

    const paymentAllocations: PaymentAllocation[] = Object.entries(allocations)
      .filter(([, amount]) => amount > 0)
      .map(([enrollmentItemId, amount]) => ({
        id: `allocation-${crypto.randomUUID()}`,

        paymentId: identity.id,

        enrollmentItemId,

        amount,
      }));

    const now = new Date().toISOString();

    return {
      id: identity.id,

      paymentCode: identity.paymentCode,

      studentId: draft.studentId,

      enrollmentId: selectedEnrollment.id,

      amount: draft.amount,

      method: draft.method,

      paidAt: draft.paidAt,

      proof: draft.proof,

      status: "PENDING",

      note: draft.note?.trim() || undefined,

      allocations: paymentAllocations,

      createdAt: now,

      updatedAt: now,
    };
  }

  function handleCreatePayment() {
    if (!selectedEnrollment || !financialSummary) {
      return;
    }

    /*
     * Tránh double-submit trong cùng flow.
     */
    if (createdPayment) {
      toast.info("Giao dịch đã được ghi nhận", {
        description: createdPayment.paymentCode,
      });

      return;
    }

    const payment = buildPayment();

    if (!payment) {
      return;
    }

    /*
     * Allocation chỉ được tham chiếu
     * EnrollmentItem thuộc Enrollment
     * hiện tại.
     */
    const schema = createPaymentRecordSchema(
      selectedEnrollment.items.map((item) => item.id)
    );

    const result = schema.safeParse(payment);

    if (!result.success) {
      toast.error("Không thể ghi nhận giao dịch", {
        description:
          result.error.issues[0]?.message ?? "Dữ liệu Payment không hợp lệ.",
      });

      return;
    }

    const overAllocation = financialSummary.items.find(
      (financial) =>
        (allocations[financial.enrollmentItemId] ?? 0) >
        financial.remainingAmount
    );

    if (overAllocation) {
      toast.error("Allocation vượt công nợ");

      return;
    }

    /*
     * GĐ7.9:
     * Payment được ghi vào shared store.
     *
     * Từ đây:
     * - Work Queue thấy Payment mới
     * - Financial Overview thấy Pending mới
     * - Payment Detail đọc được
     * - Student 360 sau mục J thấy được
     * - F5 vẫn giữ qua localStorage
     */
    addPayment(payment);

    setCreatedPayment(payment);

    toast.success("Đã tạo Payment PENDING", {
      description: `${payment.paymentCode} · ${formatCurrency(payment.amount)}`,
    });
  }

  const amountExceedsRemaining = Boolean(
    financialSummary && draft.amount > financialSummary.remainingAmount
  );

  return (
    <PageContainer
      title="Ghi nhận thanh toán"
      description="Ghi nhận tiền thực tế và phân bổ vào từng khóa học."
      actions={
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/payments" />}
        >
          <ArrowLeft />
          Thanh toán
        </Button>
      }
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="grid grid-cols-3 gap-2">
          <StepIndicator step={1} currentStep={currentStep} title="Giao dịch" />

          <StepIndicator step={2} currentStep={currentStep} title="Phân bổ" />

          <StepIndicator step={3} currentStep={currentStep} title="Review" />
        </div>

        {currentStep === 1 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Học viên và hồ sơ ghi danh</CardTitle>

                <CardDescription>
                  Chọn đúng Enrollment trước khi ghi nhận tiền thực tế.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="payment-student"
                      className="text-sm font-medium"
                    >
                      Học viên
                    </label>

                    <Select
                      value={draft.studentId}
                      onValueChange={(value) =>
                        handleStudentChange(value ?? "")
                      }
                    >
                      <SelectTrigger id="payment-student" className="w-full">
                        <span className="truncate">
                          {selectedStudent
                            ? `${selectedStudent.studentCode} · ${selectedStudent.fullName}`
                            : "Chọn học viên..."}
                        </span>
                      </SelectTrigger>

                      <SelectContent>
                        {availableStudents.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.studentCode} · {student.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="payment-enrollment"
                      className="text-sm font-medium"
                    >
                      Hồ sơ ghi danh
                    </label>

                    <Select
                      value={draft.enrollmentId}
                      onValueChange={(value) =>
                        handleEnrollmentChange(value ?? "")
                      }
                      disabled={!draft.studentId}
                    >
                      <SelectTrigger id="payment-enrollment" className="w-full">
                        <span className="truncate">
                          {selectedEnrollment
                            ? selectedEnrollment.enrollmentCode
                            : "Chọn hồ sơ ghi danh..."}
                        </span>
                      </SelectTrigger>

                      <SelectContent>
                        {availableEnrollments.map((enrollment) => (
                          <SelectItem key={enrollment.id} value={enrollment.id}>
                            {enrollment.enrollmentCode} ·{" "}
                            {enrollment.items.length} khóa
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedEnrollment && financialSummary ? (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>Công nợ hiện tại</CardTitle>

                      <CardDescription>
                        Snapshot được tính từ shared Payment state hiện tại.
                      </CardDescription>
                    </div>

                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      render={
                        <Link
                          href={`/payments/enrollments/${selectedEnrollment.id}`}
                        />
                      }
                    >
                      Xem tài chính
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Tổng học phí
                      </p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financialSummary.totalTuition)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">
                        Đã xác nhận
                      </p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financialSummary.confirmedPaid)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">
                        Chờ xác nhận
                      </p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financialSummary.pendingAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Còn thiếu</p>

                      <p className="mt-1 text-lg font-semibold tabular-nums">
                        {formatCurrency(financialSummary.remainingAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Thông tin giao dịch</CardTitle>

                <CardDescription>
                  Đây là số tiền thực tế đã nhận, không phải Payment Plan.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label
                        htmlFor="payment-amount"
                        className="text-sm font-medium"
                      >
                        Số tiền nhận
                      </label>

                      <Input
                        id="payment-amount"
                        type="number"
                        min={0}
                        step={1000}
                        value={draft.amount || ""}
                        onChange={(event) =>
                          updateDraft({
                            amount: Number(event.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />

                      {draft.amount > 0 ? (
                        <p className="text-muted-foreground text-xs tabular-nums">
                          {formatCurrency(draft.amount)}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="payment-method"
                        className="text-sm font-medium"
                      >
                        Phương thức
                      </label>

                      <Select
                        value={draft.method}
                        onValueChange={(value) =>
                          updateDraft({
                            method: (value ?? "BANK_TRANSFER") as PaymentMethod,
                          })
                        }
                      >
                        <SelectTrigger id="payment-method" className="w-full">
                          <span>{methodLabels[draft.method]}</span>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="BANK_TRANSFER">
                            Chuyển khoản
                          </SelectItem>

                          <SelectItem value="CASH">Tiền mặt</SelectItem>

                          <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="payment-paid-at"
                        className="text-sm font-medium"
                      >
                        Thời điểm nhận tiền
                      </label>

                      <Input
                        id="payment-paid-at"
                        type="datetime-local"
                        value={draft.paidAt}
                        onChange={(event) =>
                          updateDraft({
                            paidAt: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="payment-note"
                        className="text-sm font-medium"
                      >
                        Ghi chú
                      </label>

                      <Textarea
                        id="payment-note"
                        value={draft.note ?? ""}
                        onChange={(event) =>
                          updateDraft({
                            note: event.target.value,
                          })
                        }
                        placeholder="Nội dung chuyển khoản, ghi chú tiền mặt..."
                        className="min-h-20"
                      />
                    </div>
                  </div>

                  {amountExceedsRemaining ? (
                    <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="text-destructive mt-0.5 size-4 shrink-0" />

                        <div>
                          <p className="text-sm font-medium">
                            Số tiền lớn hơn công nợ hiện tại
                          </p>

                          <p className="text-muted-foreground mt-1 text-xs">
                            Giao dịch là {formatCurrency(draft.amount)}, công nợ
                            còn{" "}
                            {formatCurrency(
                              financialSummary?.remainingAmount ?? 0
                            )}
                            . Có thể tiếp tục xem Allocation, nhưng sẽ không thể
                            hoàn tất nếu không phân bổ hợp lệ.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <FileImage className="size-4" />
                  </div>

                  <div>
                    <CardTitle>Minh chứng thanh toán</CardTitle>

                    <CardDescription>
                      Chuyển khoản bắt buộc có ảnh. Ở mock hiện tại ảnh được lưu
                      dưới dạng Data URL để giữ được qua F5.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    void handleProofUpload(event.target.files?.[0])
                  }
                />

                {draft.proof ? (
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                    <div
                      className="bg-muted aspect-video rounded-lg border bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url("${draft.proof.url}")`,
                      }}
                      aria-label="Preview minh chứng thanh toán"
                    />

                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="text-primary mt-0.5 size-5 shrink-0" />

                          <div className="min-w-0">
                            <p className="font-medium break-all">
                              {draft.proof.fileName}
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              {draft.proof.mimeType}
                            </p>

                            <div className="mt-3">
                              <StatusBadge tone="success">
                                Đã chọn ảnh
                              </StatusBadge>
                            </div>
                          </div>
                        </div>
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

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={removeProof}
                        >
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

                    <p className="mt-3 font-medium">Chọn ảnh chuyển khoản</p>

                    <p className="text-muted-foreground mt-1 text-sm">
                      Nhấn để chọn file ảnh từ máy.
                    </p>
                  </button>
                )}

                {draft.method === "BANK_TRANSFER" && !draft.proof ? (
                  <p className="text-destructive mt-3 text-sm">
                    Chuyển khoản cần ảnh minh chứng trước khi tiếp tục.
                  </p>
                ) : null}

                <p className="text-muted-foreground mt-3 text-xs">
                  Mock hiện giới hạn ảnh nhỏ để lưu localStorage. GĐ21 sẽ thay
                  bằng Private Blob.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/payments" />}
              >
                <ArrowLeft />
                Hủy
              </Button>

              <Button type="button" onClick={handleContinueToAllocation}>
                Tiếp tục phân bổ
                <ArrowRight />
              </Button>
            </div>
          </>
        ) : null}

        {currentStep === 2 && selectedEnrollment && financialSummary ? (
          <PaymentAllocationStep
            enrollment={selectedEnrollment}
            summary={financialSummary}
            paymentAmount={draft.amount}
            value={allocations}
            onChange={(value) => {
              setAllocations(value);

              setCreatedPayment(null);
            }}
            onBack={() => setCurrentStep(1)}
            onContinue={handleContinueToReview}
          />
        ) : null}

        {currentStep === 3 &&
        selectedEnrollment &&
        selectedStudent &&
        financialSummary ? (
          <>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Review giao dịch
              </h2>

              <p className="text-muted-foreground mt-1 text-sm">
                Kiểm tra lần cuối trước khi tạo Payment PENDING.
              </p>
            </div>

            {createdPayment ? (
              <Card className="border-primary/30">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-primary mt-0.5 size-5 shrink-0" />

                    <div>
                      <p className="font-medium">Đã tạo Payment</p>

                      <p className="mt-1 text-lg font-semibold">
                        {createdPayment.paymentCode}
                      </p>

                      <div className="mt-2">
                        <StatusBadge tone="pending">Chờ xác nhận</StatusBadge>
                      </div>

                      <p className="text-muted-foreground mt-3 text-xs">
                        Payment đã được ghi vào shared mock store. Work Queue,
                        Financial Overview và Payment Detail có thể đọc cùng
                        record này; F5 vẫn giữ dữ liệu.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Giao dịch</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Học viên</p>

                    <p className="mt-1 font-medium">
                      {selectedStudent.studentCode} · {selectedStudent.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Enrollment</p>

                    <p className="mt-1 font-medium">
                      {selectedEnrollment.enrollmentCode}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Số tiền</p>

                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {formatCurrency(draft.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Phương thức</p>

                    <p className="mt-1 font-medium">
                      {methodLabels[draft.method]}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Thời điểm nhận
                    </p>

                    <p className="mt-1 font-medium">
                      {formatDateTime(draft.paidAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Minh chứng</p>

                    <p className="mt-1 font-medium">
                      {draft.proof ? draft.proof.fileName : "Không có"}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Allocation</p>

                    <p className="mt-1 font-medium tabular-nums">
                      {formatCurrency(allocatedTotal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Chưa phân bổ
                    </p>

                    <p className="mt-1 font-medium tabular-nums">
                      {formatCurrency(unallocatedAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <ReceiptText className="text-muted-foreground mt-0.5 size-5 shrink-0" />

                  <div>
                    <CardTitle>Phân bổ vào khóa</CardTitle>

                    <CardDescription>
                      Một Payment có thể phủ nhiều EnrollmentItem.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-3">
                  {Object.entries(allocations)
                    .filter(([, amount]) => amount > 0)
                    .map(([enrollmentItemId, amount]) => {
                      const item = selectedEnrollment.items.find(
                        (candidate) => candidate.id === enrollmentItemId
                      );

                      if (!item) {
                        return null;
                      }

                      return (
                        <div
                          key={enrollmentItemId}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{item.courseName}</p>

                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {item.id}
                            </p>
                          </div>

                          <p className="font-medium tabular-nums">
                            {formatCurrency(amount)}
                          </p>
                        </div>
                      );
                    })}

                  <div className="flex items-center justify-between gap-3 border-t pt-4">
                    <span className="font-medium">Tổng allocation</span>

                    <span className="text-lg font-semibold tabular-nums">
                      {formatCurrency(allocatedTotal)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {draft.note?.trim() ? (
              <Card size="sm">
                <CardContent>
                  <p className="text-muted-foreground text-xs">Ghi chú</p>

                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {draft.note}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={Boolean(createdPayment)}
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft />
                Sửa phân bổ
              </Button>

              {createdPayment ? (
                <div className="flex flex-wrap gap-2">
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link href={`/payments/${createdPayment.id}`} />}
                  >
                    Xem giao dịch
                  </Button>

                  <Button
                    nativeButton={false}
                    render={<Link href="/payments" />}
                  >
                    Quay về thanh toán
                    <ArrowRight />
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={handleCreatePayment}>
                  <Send />
                  Ghi nhận giao dịch
                </Button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </PageContainer>
  );
}
