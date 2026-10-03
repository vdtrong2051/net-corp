"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
  Eraser,
  Layers3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EnrollmentDraft } from "@/modules/enrollments/model/enrollment.types";
import type { EnrollmentFinancialSummary } from "@/modules/payments/model/payment.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

export type PaymentAllocationDraftMap = Record<string, number>;

type PaymentAllocationStepProps = {
  enrollment: EnrollmentDraft;

  summary: EnrollmentFinancialSummary;

  paymentAmount: number;

  value: PaymentAllocationDraftMap;

  onChange: (value: PaymentAllocationDraftMap) => void;

  onBack: () => void;

  onContinue: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentAllocationStep({
  enrollment,
  summary,
  paymentAmount,
  value,
  onChange,
  onBack,
  onContinue,
}: PaymentAllocationStepProps) {
  const allocatedAmount = Object.values(value).reduce(
    (total, amount) => total + amount,
    0
  );

  const unallocatedAmount = paymentAmount - allocatedAmount;

  const totalRemaining = summary.items.reduce(
    (total, item) => total + item.remainingAmount,
    0
  );

  const hasCourseOverAllocation = summary.items.some((financial) => {
    const amount = value[financial.enrollmentItemId] ?? 0;

    return amount > financial.remainingAmount;
  });

  const canContinue =
    paymentAmount > 0 && unallocatedAmount === 0 && !hasCourseOverAllocation;

  function updateAllocation(enrollmentItemId: string, amount: number) {
    const safeAmount = Number.isFinite(amount)
      ? Math.max(Math.trunc(amount), 0)
      : 0;

    const next = {
      ...value,
    };

    if (safeAmount === 0) {
      delete next[enrollmentItemId];
    } else {
      next[enrollmentItemId] = safeAmount;
    }

    onChange(next);
  }

  function allocateMaximum(enrollmentItemId: string, remainingAmount: number) {
    const currentAmount = value[enrollmentItemId] ?? 0;

    /*
     * Phần Payment chưa allocate
     * cộng lại phần đang nằm ở
     * chính Course này.
     */
    const available = Math.max(unallocatedAmount + currentAmount, 0);

    const nextAmount = Math.min(remainingAmount, available);

    updateAllocation(enrollmentItemId, nextAmount);
  }

  function clearAll() {
    onChange({});
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Phân bổ tiền vào khóa học
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Xác định giao dịch này được tính vào khóa nào trong Enrollment.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Giao dịch</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(paymentAmount)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Đã phân bổ</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(allocatedAmount)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Chưa phân bổ</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(unallocatedAmount)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Công nợ hiện tại</CardDescription>

            <CardTitle className="text-xl tabular-nums">
              {formatCurrency(totalRemaining)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      {paymentAmount > totalRemaining ? (
        <Card className="border-destructive/40">
          <CardContent>
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />

              <div>
                <p className="font-medium">Giao dịch vượt tổng công nợ</p>

                <p className="text-muted-foreground mt-1 text-sm">
                  Giao dịch là {formatCurrency(paymentAmount)}, nhưng tổng công
                  nợ chính thức chỉ còn {formatCurrency(totalRemaining)}.
                </p>

                <p className="text-muted-foreground mt-1 text-xs">
                  Không tự cắt số tiền thực nhận. V1 cũng không cho ép phần dư
                  vào một Course chỉ để cân Allocation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Các khóa trong Enrollment</CardTitle>

              <CardDescription>
                Allocation chỉ được chọn từ các EnrollmentItem của hồ sơ hiện
                tại.
              </CardDescription>
            </div>

            {allocatedAmount > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
              >
                <Eraser />
                Xóa phân bổ
              </Button>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            {enrollment.items.map((item, index) => {
              const financial = summary.items.find(
                (candidate) => candidate.enrollmentItemId === item.id
              );

              if (!financial) {
                return null;
              }

              const amount = value[item.id] ?? 0;

              const over = amount > financial.remainingAmount;

              return (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {index + 1}. {item.courseName}
                        </p>

                        {financial.remainingAmount === 0 ? (
                          <StatusBadge tone="success">
                            Đã đủ học phí
                          </StatusBadge>
                        ) : (
                          <StatusBadge tone="pending">Còn công nợ</StatusBadge>
                        )}
                      </div>

                      <p className="text-muted-foreground mt-1 text-xs">
                        {item.classCode
                          ? `Lớp ${item.classCode}`
                          : item.expectedStart
                            ? `Dự kiến ${item.expectedStart}`
                            : "Chưa xếp lớp"}
                      </p>
                    </div>

                    <Layers3 className="text-muted-foreground size-4" />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Học phí</p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financial.finalTuition)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">
                        Đã xác nhận
                      </p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financial.confirmedPaid)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Đang chờ</p>

                      <p className="mt-1 font-medium tabular-nums">
                        {formatCurrency(financial.pendingAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">Còn thiếu</p>

                      <p className="mt-1 text-lg font-semibold tabular-nums">
                        {formatCurrency(financial.remainingAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div className="grid gap-2">
                      <label
                        htmlFor={`allocation-${item.id}`}
                        className="text-sm font-medium"
                      >
                        Số tiền phân bổ
                      </label>

                      <Input
                        id={`allocation-${item.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={amount || ""}
                        disabled={financial.remainingAmount === 0}
                        onChange={(event) =>
                          updateAllocation(
                            item.id,
                            Number(event.target.value) || 0
                          )
                        }
                        placeholder="0"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        financial.remainingAmount === 0 || paymentAmount === 0
                      }
                      onClick={() =>
                        allocateMaximum(item.id, financial.remainingAmount)
                      }
                    >
                      <CircleDollarSign />
                      Phân tối đa
                    </Button>
                  </div>

                  {amount > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-muted-foreground text-xs">
                        Đang phân vào khóa này
                      </p>

                      <p className="text-sm font-medium tabular-nums">
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  ) : null}

                  {over ? (
                    <div className="border-destructive/30 bg-destructive/5 mt-3 rounded-lg border p-3">
                      <p className="text-destructive text-sm font-medium">
                        Vượt công nợ của khóa
                      </p>

                      <p className="text-muted-foreground mt-1 text-xs">
                        Tối đa có thể phân vào khóa này là{" "}
                        {formatCurrency(financial.remainingAmount)}.
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {unallocatedAmount === 0 && !hasCourseOverAllocation ? (
                <>
                  <StatusBadge tone="success">Allocation đã cân</StatusBadge>

                  <p className="text-muted-foreground mt-2 text-xs">
                    Tổng allocation bằng đúng số tiền giao dịch.
                  </p>
                </>
              ) : (
                <>
                  <StatusBadge tone="pending">
                    Allocation chưa hoàn tất
                  </StatusBadge>

                  <p className="text-muted-foreground mt-2 text-xs">
                    Cần phân bổ toàn bộ giao dịch và không vượt công nợ từng
                    khóa.
                  </p>
                </>
              )}
            </div>

            <div className="text-left sm:text-right">
              <p className="text-muted-foreground text-xs">Chưa phân bổ</p>

              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(unallocatedAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft />
          Quay lại giao dịch
        </Button>

        <Button type="button" disabled={!canContinue} onClick={onContinue}>
          Review giao dịch
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
