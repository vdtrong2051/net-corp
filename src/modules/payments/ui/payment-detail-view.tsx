"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Ban,
  CalendarClock,
  CircleDollarSign,
  FileImage,
  Layers3,
  PencilLine,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { EnrollmentDraft } from "@/modules/enrollments/model/enrollment.types";

import type {
  EnrollmentFinancialSummary,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from "@/modules/payments/model/payment.types";

import {
  PaymentCorrectionPanel,
  type PaymentCorrectionMode,
} from "@/modules/payments/ui/payment-correction-panel";

import type { StudentListItem } from "@/modules/students/model/student.types";

import { useMockSession } from "@/shared/providers/mock-session-provider";

import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

import { PageContainer } from "@/shared/ui/layout/page-container";

type PaymentDetailViewProps = {
  payment: Payment;

  student: StudentListItem;

  enrollment: EnrollmentDraft;

  financialSummary: EnrollmentFinancialSummary;

  existingPaymentCodes: string[];

  replacesPayment?: Payment;

  replacementPayment?: Payment;

  onPersistPending: (payment: Payment) => void;

  onPersistAdjustment: (
    cancelledPayment: Payment,
    replacementPayment: Payment
  ) => void;
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Chuyển khoản",

  CASH: "Tiền mặt",

  OTHER: "Khác",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Chờ xác nhận",

  CONFIRMED: "Đã xác nhận",

  RETURNED: "Bị trả lại",

  CANCELLED: "Đã hủy",
};

const paymentStatusTones: Record<PaymentStatus, StatusTone> = {
  PENDING: "pending",

  CONFIRMED: "success",

  RETURNED: "danger",

  CANCELLED: "neutral",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getFinancialImpact(status: PaymentStatus) {
  if (status === "CONFIRMED") {
    return {
      tone: "success" as const,

      label: "Đang tính vào công nợ",

      description:
        "Allocation của giao dịch này đang được tính vào số tiền đã đóng.",
    };
  }

  if (status === "PENDING") {
    return {
      tone: "pending" as const,

      label: "Chưa giảm công nợ",

      description:
        "Giao dịch đang chờ xác nhận nên chưa được tính vào số tiền đã đóng.",
    };
  }

  if (status === "RETURNED") {
    return {
      tone: "danger" as const,

      label: "Không tính vào công nợ",

      description:
        "Giao dịch đã bị trả lại và không được tính vào số tiền đã đóng.",
    };
  }

  return {
    tone: "neutral" as const,

    label: "Không tính vào công nợ",

    description: "Giao dịch đã bị hủy và không còn tác động đến công nợ.",
  };
}

export function PaymentDetailView({
  payment,
  student,
  enrollment,
  financialSummary,
  existingPaymentCodes,
  replacesPayment,
  replacementPayment,
  onPersistPending,
  onPersistAdjustment,
}: PaymentDetailViewProps) {
  /*
   * Role mock hiện tại.
   *
   * STAFF:
   * - sửa PENDING
   * - không Adjustment CONFIRMED
   *
   * MANAGER / OWNER:
   * - sửa PENDING
   * - Adjustment CONFIRMED
   */
  const { role } = useMockSession();

  const canAdjustConfirmed = role === "MANAGER" || role === "OWNER";

  const [correctionMode, setCorrectionMode] =
    useState<PaymentCorrectionMode | null>(null);

  /*
   * Không giữ currentPayment local state nữa.
   *
   * payment prop đến trực tiếp từ
   * PaymentMockStore qua PaymentDetailScreen.
   *
   * Shared store mới là source of truth.
   */
  const allocatedAmount = payment.allocations.reduce(
    (total, allocation) => total + allocation.amount,
    0
  );

  const financialImpact = getFinancialImpact(payment.status);

  const allocationRows = payment.allocations.map((allocation) => {
    const item = enrollment.items.find(
      (candidate) => candidate.id === allocation.enrollmentItemId
    );

    return {
      ...allocation,

      courseName: item?.courseName ?? "Không xác định",

      finalTuition: item?.finalTuition ?? 0,
    };
  });

  function handleEditPending(updated: Payment) {
    onPersistPending(updated);

    setCorrectionMode(null);
  }

  function handleAdjustment(cancelled: Payment, replacement: Payment) {
    onPersistAdjustment(cancelled, replacement);

    setCorrectionMode(null);
  }

  return (
    <PageContainer
      title={payment.paymentCode}
      description="Chi tiết giao dịch thanh toán."
      actions={
        <>
          {payment.status === "PENDING" ? (
            <Button
              type="button"
              onClick={() => setCorrectionMode("EDIT_PENDING")}
            >
              <PencilLine />
              Sửa giao dịch
            </Button>
          ) : null}

          {payment.status === "CONFIRMED" && canAdjustConfirmed ? (
            <Button
              type="button"
              onClick={() => setCorrectionMode("ADJUST_CONFIRMED")}
            >
              <RefreshCcw />
              Điều chỉnh
            </Button>
          ) : null}

          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={`/payments/enrollments/${enrollment.id}`} />}
          >
            <CircleDollarSign />
            Tài chính ghi danh
          </Button>

          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href="/payments" />}
          >
            <ArrowLeft />
            Thanh toán
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        {correctionMode ? (
          <PaymentCorrectionPanel
            mode={correctionMode}
            payment={payment}
            enrollment={enrollment}
            financialSummary={financialSummary}
            existingPaymentCodes={existingPaymentCodes}
            onClose={() => setCorrectionMode(null)}
            onEditPending={handleEditPending}
            onCreateAdjustment={handleAdjustment}
          />
        ) : null}

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Giao dịch</CardTitle>

                <CardDescription>
                  Thông tin tiền thực tế được ghi nhận.
                </CardDescription>
              </div>

              <StatusBadge tone={paymentStatusTones[payment.status]}>
                {paymentStatusLabels[payment.status]}
              </StatusBadge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Số tiền</p>

                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {formatCurrency(payment.amount)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Phương thức</p>

                <p className="mt-1 font-medium">
                  {paymentMethodLabels[payment.method]}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Thời điểm nhận</p>

                <p className="mt-1 font-medium">
                  {formatDateTime(payment.paidAt)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Allocation</p>

                <p className="mt-1 font-medium tabular-nums">
                  {formatCurrency(allocatedAmount)}
                </p>
              </div>
            </div>

            {payment.note ? (
              <div className="bg-muted/30 mt-5 rounded-lg border p-4">
                <p className="text-muted-foreground text-xs">Ghi chú</p>

                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {payment.note}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Học viên và ghi danh</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3">
                <UserRound className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-muted-foreground text-xs">Học viên</p>

                  <p className="mt-1 font-medium">{student.fullName}</p>

                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {student.studentCode}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Enrollment</p>

                <Link
                  href={`/payments/enrollments/${enrollment.id}`}
                  className="mt-1 inline-block font-medium underline-offset-4 hover:underline"
                >
                  {enrollment.enrollmentCode}
                </Link>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Sale phụ trách</p>

                <p className="mt-1 font-medium">
                  {enrollment.salesName ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Người ghi nhận</p>

                <p className="mt-1 font-medium">
                  {payment.createdByName ?? "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Layers3 className="text-muted-foreground mt-0.5 size-5" />

              <div>
                <CardTitle>Phân bổ giao dịch</CardTitle>

                <CardDescription>
                  Payment này đang trỏ đến các EnrollmentItem sau.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3">
              {allocationRows.map((allocation) => (
                <div
                  key={allocation.id}
                  className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div>
                    <p className="font-medium">{allocation.courseName}</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      Học phí khóa: {formatCurrency(allocation.finalTuition)}
                    </p>

                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {allocation.enrollmentItemId}
                    </p>
                  </div>

                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(allocation.amount)}
                  </p>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <span className="font-medium">Tổng allocation</span>

                <span className="text-lg font-semibold tabular-nums">
                  {formatCurrency(allocatedAmount)}
                </span>
              </div>

              {allocatedAmount !== payment.amount ? (
                <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-3">
                  <p className="text-destructive text-sm font-medium">
                    Allocation không khớp Payment
                  </p>

                  <p className="text-muted-foreground mt-1 text-xs">
                    Payment là {formatCurrency(payment.amount)}, nhưng tổng
                    allocation là {formatCurrency(allocatedAmount)}.
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tác động tài chính</CardTitle>

            <CardDescription>
              Trạng thái Payment quyết định Allocation có được tính vào công nợ
              hay không.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <StatusBadge tone={financialImpact.tone}>
                    {financialImpact.label}
                  </StatusBadge>

                  <p className="text-muted-foreground mt-2 text-sm">
                    {financialImpact.description}
                  </p>
                </div>

                <p className="text-lg font-semibold tabular-nums">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <FileImage className="text-muted-foreground mt-0.5 size-5" />

              <div>
                <CardTitle>Minh chứng thanh toán</CardTitle>

                <CardDescription>
                  Proof thuộc chính Payment này.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {payment.proof ? (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                <div
                  className="bg-muted aspect-video rounded-lg border bg-contain bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("${payment.proof.url}")`,
                  }}
                  aria-label="Ảnh minh chứng thanh toán"
                />

                <div className="grid content-start gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Tên file</p>

                    <p className="mt-1 font-medium break-all">
                      {payment.proof.fileName}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Loại file</p>

                    <p className="mt-1 font-medium">{payment.proof.mimeType}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Upload lúc</p>

                    <p className="mt-1 font-medium">
                      {formatDateTime(payment.proof.uploadedAt)}
                    </p>
                  </div>

                  <div>
                    <Button
                      nativeButton={false}
                      variant="outline"
                      render={
                        <a
                          href={payment.proof.url}
                          target="_blank"
                          rel="noreferrer"
                        />
                      }
                    >
                      <FileImage />
                      Mở ảnh
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <FileImage className="text-muted-foreground mx-auto size-5" />

                <p className="mt-2 font-medium">Không có minh chứng ảnh</p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Có thể là giao dịch tiền mặt hoặc phương thức không yêu cầu
                  proof.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {payment.status === "RETURNED" && payment.returnedReason ? (
          <Card className="border-destructive/40">
            <CardHeader>
              <div className="flex items-start gap-3">
                <RotateCcw className="text-destructive mt-0.5 size-5" />

                <div>
                  <CardTitle>Giao dịch bị trả lại</CardTitle>

                  <CardDescription>
                    Payment chưa được chấp nhận.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">Lý do</p>

              <p className="mt-1 text-sm whitespace-pre-wrap">
                {payment.returnedReason}
              </p>

              <p className="text-muted-foreground mt-4 text-xs">
                Trả lại lúc {formatDateTime(payment.returnedAt)}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {payment.status === "CANCELLED" && payment.cancelledReason ? (
          <Card className="border-destructive/40">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Ban className="text-destructive mt-0.5 size-5" />

                <div>
                  <CardTitle>Giao dịch đã bị hủy</CardTitle>

                  <CardDescription>
                    Record vẫn được giữ để bảo toàn lịch sử tài chính.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">Lý do</p>

              <p className="mt-1 text-sm whitespace-pre-wrap">
                {payment.cancelledReason}
              </p>

              <p className="text-muted-foreground mt-4 text-xs">
                Hủy lúc {formatDateTime(payment.cancelledAt)}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {replacesPayment || replacementPayment ? (
          <Card>
            <CardHeader>
              <CardTitle>Quan hệ điều chỉnh</CardTitle>

              <CardDescription>
                Theo dõi Payment cũ và Payment thay thế mà không làm mất lịch
                sử.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3">
                {replacesPayment ? (
                  <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Thay thế giao dịch
                      </p>

                      <p className="mt-1 font-medium">
                        {replacesPayment.paymentCode}
                      </p>

                      <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                        {formatCurrency(replacesPayment.amount)}
                      </p>
                    </div>

                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      render={<Link href={`/payments/${replacesPayment.id}`} />}
                    >
                      Xem giao dịch cũ
                      <ArrowRight />
                    </Button>
                  </div>
                ) : null}

                {replacementPayment ? (
                  <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Được thay thế bởi
                      </p>

                      <p className="mt-1 font-medium">
                        {replacementPayment.paymentCode}
                      </p>

                      <div className="mt-2">
                        <StatusBadge
                          tone={paymentStatusTones[replacementPayment.status]}
                        >
                          {paymentStatusLabels[replacementPayment.status]}
                        </StatusBadge>
                      </div>

                      <p className="text-muted-foreground mt-2 text-xs tabular-nums">
                        {formatCurrency(replacementPayment.amount)}
                      </p>
                    </div>

                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/payments/${replacementPayment.id}`} />
                      }
                    >
                      Xem giao dịch mới
                      <ArrowRight />
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <CalendarClock className="text-muted-foreground mt-0.5 size-5" />

              <div>
                <CardTitle>Lifecycle</CardTitle>

                <CardDescription>
                  Các mốc đã xảy ra với giao dịch.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <ReceiptText className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-sm font-medium">Ghi nhận giao dịch</p>

                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatDateTime(payment.createdAt)}
                    {payment.createdByName ? ` · ${payment.createdByName}` : ""}
                  </p>
                </div>
              </div>

              {payment.confirmedAt ? (
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <BadgeCheck className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-sm font-medium">Đã xác nhận</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDateTime(payment.confirmedAt)}
                      {payment.confirmedByName
                        ? ` · ${payment.confirmedByName}`
                        : ""}
                    </p>
                  </div>
                </div>
              ) : null}

              {payment.returnedAt ? (
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <RotateCcw className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-sm font-medium">Bị trả lại</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDateTime(payment.returnedAt)}
                    </p>
                  </div>
                </div>
              ) : null}

              {payment.cancelledAt ? (
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <Ban className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-sm font-medium">Đã hủy / Adjustment</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDateTime(payment.cancelledAt)}
                    </p>
                  </div>
                </div>
              ) : null}

              {replacementPayment ? (
                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <RefreshCcw className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-sm font-medium">Tạo Payment thay thế</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {replacementPayment.paymentCode} ·{" "}
                      {paymentStatusLabels[replacementPayment.status]}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
