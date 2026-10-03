"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Plus,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  courseDeliveryModeLabels,
  courseProgramLabels,
  courseTrackLabels,
} from "@/modules/courses/model/course.types";
import type {
  EnrollmentDraft,
  EnrollmentItemPaymentPlan,
  PaymentPlanMode,
} from "@/modules/enrollments/model/enrollment.types";
import type {
  PaymentMethod,
  PaymentStatus,
} from "@/modules/payments/model/payment.types";
import { buildEnrollmentFinancialSummary } from "@/modules/payments/service/payment-financial.service";
import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";
import type { StudentListItem } from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";
import { PageContainer } from "@/shared/ui/layout/page-container";

const paymentModeLabels: Record<PaymentPlanMode, string> = {
  FULL: "Thanh toán toàn bộ",

  INSTALLMENTS: "Chia nhiều đợt",

  DEPOSIT_THEN_INSTALLMENTS: "Cọc + chia đợt",
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value?: string) {
  if (!value) {
    return "Chưa đặt hạn";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function getPlanForItem(enrollment: EnrollmentDraft, enrollmentItemId: string) {
  return enrollment.paymentPlan.items.find(
    (plan) => plan.enrollmentItemId === enrollmentItemId
  );
}

function getPlanTotal(plan?: EnrollmentItemPaymentPlan) {
  if (!plan) {
    return 0;
  }

  return plan.lines.reduce((total, line) => total + line.amount, 0);
}

type EnrollmentFinancialOverviewProps = {
  enrollment: EnrollmentDraft;

  student: StudentListItem;
};

export function EnrollmentFinancialOverview({
  enrollment,
  student,
}: EnrollmentFinancialOverviewProps) {
  /*
   * GĐ7.9:
   * Payment không còn nhận từ page/server mock.
   *
   * Toàn bộ Payment lifecycle đọc từ
   * một source of truth dùng chung.
   */
  const { payments } = usePaymentMockStore();

  /*
   * Chỉ lấy Payment thuộc Enrollment
   * hiện tại để render transaction history.
   */
  const enrollmentPayments = useMemo(
    () => payments.filter((payment) => payment.enrollmentId === enrollment.id),
    [payments, enrollment.id]
  );

  /*
   * Financial Summary luôn tính lại từ
   * shared Payment state.
   *
   * Vì vậy:
   * - Create Payment
   * - Edit PENDING
   * - Adjustment
   *
   * đều phản ánh ngay tại màn này.
   */
  const summary = useMemo(
    () => buildEnrollmentFinancialSummary(enrollment, payments),
    [enrollment, payments]
  );

  const sortedPayments = useMemo(
    () =>
      [...enrollmentPayments].sort(
        (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
      ),
    [enrollmentPayments]
  );

  return (
    <PageContainer
      title="Tài chính ghi danh"
      description={`${enrollment.enrollmentCode} · ${student.fullName}`}
      actions={
        <>
          <Button
            nativeButton={false}
            render={
              <Link href={`/payments/create?enrollmentId=${enrollment.id}`} />
            }
          >
            <Plus />
            Ghi nhận thanh toán
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
        <Card size="sm">
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs">Học viên</p>

                <p className="mt-1 font-medium">
                  {student.studentCode} · {student.fullName}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Mã ghi danh</p>

                <p className="mt-1 font-medium">{enrollment.enrollmentCode}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Sale phụ trách</p>

                <p className="mt-1 font-medium">
                  {enrollment.salesName ?? "Chưa chọn"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Số khóa</p>

                <p className="mt-1 font-medium tabular-nums">
                  {enrollment.items.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section
          aria-label="Tổng quan công nợ"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Tổng học phí</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {formatCurrency(summary.totalTuition)}
                  </CardTitle>
                </div>

                <CircleDollarSign className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Tổng final tuition của toàn bộ khóa
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Đã xác nhận</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {formatCurrency(summary.confirmedPaid)}
                  </CardTitle>
                </div>

                <BadgeCheck className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Chỉ tính allocation của Payment CONFIRMED
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Chờ xác nhận</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {formatCurrency(summary.pendingAmount)}
                  </CardTitle>
                </div>

                <Clock3 className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Có giao dịch nhưng chưa giảm công nợ
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Còn thiếu</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {formatCurrency(summary.remainingAmount)}
                  </CardTitle>
                </div>

                <WalletCards className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Học phí trừ tiền đã xác nhận
              </p>
            </CardContent>
          </Card>
        </section>

        {summary.overpaidAmount > 0 ? (
          <Card className="border-destructive/40">
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />

                <div>
                  <p className="font-medium">Có khoản thu vượt học phí</p>

                  <p className="text-muted-foreground mt-1 text-sm">
                    Tổng vượt: {formatCurrency(summary.overpaidAmount)}. Cần
                    kiểm tra allocation hoặc giao dịch liên quan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Kế hoạch so với thực tế
            </h2>

            <p className="text-muted-foreground mt-1 text-sm">
              Payment Plan mô tả kế hoạch phải đóng; Actual được tính từ Payment
              thực tế.
            </p>
          </div>

          {enrollment.items.map((item, index) => {
            const financial = summary.items.find(
              (candidate) => candidate.enrollmentItemId === item.id
            );

            const plan = getPlanForItem(enrollment, item.id);

            const planTotal = getPlanTotal(plan);

            const planBalanced = planTotal === item.finalTuition;

            if (!financial) {
              return null;
            }

            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>
                          {index + 1}. {item.courseName}
                        </CardTitle>

                        <StatusBadge tone="info">
                          {courseProgramLabels[item.program]}
                        </StatusBadge>
                      </div>

                      <CardDescription className="mt-1">
                        {courseTrackLabels[item.track]} ·{" "}
                        {courseDeliveryModeLabels[item.deliveryMode]}
                      </CardDescription>
                    </div>

                    {financial.remainingAmount === 0 ? (
                      <StatusBadge tone="success">Đã đủ học phí</StatusBadge>
                    ) : (
                      <StatusBadge tone="pending">Còn công nợ</StatusBadge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                        <p className="text-muted-foreground text-xs">
                          Chờ xác nhận
                        </p>

                        <p className="mt-1 font-medium tabular-nums">
                          {formatCurrency(financial.pendingAmount)}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Còn thiếu
                        </p>

                        <p className="mt-1 text-lg font-semibold tabular-nums">
                          {formatCurrency(financial.remainingAmount)}
                        </p>
                      </div>
                    </div>

                    {financial.overpaidAmount > 0 ? (
                      <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-3">
                        <p className="text-destructive text-sm font-medium">
                          Thu vượt {formatCurrency(financial.overpaidAmount)}
                        </p>
                      </div>
                    ) : null}

                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">
                              Kế hoạch thanh toán
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              Dữ liệu từ GĐ6
                            </p>
                          </div>

                          {plan ? (
                            <StatusBadge
                              tone={planBalanced ? "neutral" : "danger"}
                            >
                              {planBalanced ? "Plan hợp lệ" : "Plan lệch"}
                            </StatusBadge>
                          ) : (
                            <StatusBadge tone="pending">
                              Chưa có plan
                            </StatusBadge>
                          )}
                        </div>

                        {plan ? (
                          <div className="mt-4 grid gap-3">
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Hình thức
                              </p>

                              <p className="mt-1 font-medium">
                                {paymentModeLabels[plan.mode]}
                              </p>
                            </div>

                            <div className="grid gap-2">
                              {plan.lines.map((line) => (
                                <div
                                  key={line.id}
                                  className="bg-muted/30 flex items-start justify-between gap-3 rounded-lg p-3"
                                >
                                  <div>
                                    <p className="text-sm font-medium">
                                      {line.label}
                                    </p>

                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                      {formatDate(line.dueDate)}
                                    </p>
                                  </div>

                                  <p className="text-sm font-medium whitespace-nowrap tabular-nums">
                                    {formatCurrency(line.amount)}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t pt-3">
                              <span className="text-sm font-medium">
                                Tổng kế hoạch
                              </span>

                              <span className="font-medium tabular-nums">
                                {formatCurrency(planTotal)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-muted-foreground mt-4 text-sm">
                            Khóa này chưa có kế hoạch thanh toán.
                          </p>
                        )}
                      </div>

                      <div className="rounded-lg border p-4">
                        <div>
                          <p className="text-sm font-medium">Thực tế</p>

                          <p className="text-muted-foreground mt-1 text-xs">
                            Tính trực tiếp từ PaymentAllocation
                          </p>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="bg-muted/30 flex items-center justify-between gap-3 rounded-lg p-3">
                            <span className="text-sm">Đã xác nhận</span>

                            <span className="font-medium tabular-nums">
                              {formatCurrency(financial.confirmedPaid)}
                            </span>
                          </div>

                          <div className="bg-muted/30 flex items-center justify-between gap-3 rounded-lg p-3">
                            <span className="text-sm">Đang chờ</span>

                            <span className="font-medium tabular-nums">
                              {formatCurrency(financial.pendingAmount)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t pt-3">
                            <span className="text-sm font-medium">
                              Công nợ chính thức
                            </span>

                            <span className="font-semibold tabular-nums">
                              {formatCurrency(financial.remainingAmount)}
                            </span>
                          </div>

                          <p className="text-muted-foreground text-xs">
                            Pending chỉ dùng để theo dõi và chưa được trừ khỏi
                            công nợ.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Giao dịch của hồ sơ
            </h2>

            <p className="text-muted-foreground mt-1 text-sm">
              Toàn bộ Payment hiện có trong shared state của Enrollment này.
            </p>
          </div>

          {sortedPayments.length === 0 ? (
            <Card>
              <CardContent>
                <div className="py-6 text-center">
                  <ReceiptText className="text-muted-foreground mx-auto size-5" />

                  <p className="mt-2 font-medium">Chưa có giao dịch</p>

                  <p className="text-muted-foreground mt-1 text-sm">
                    Enrollment này chưa ghi nhận Payment thực tế.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {sortedPayments.map((payment) => {
                const allocationRows = payment.allocations.map((allocation) => {
                  const course = enrollment.items.find(
                    (item) => item.id === allocation.enrollmentItemId
                  );

                  return {
                    ...allocation,

                    courseName: course?.courseName ?? "Không xác định",
                  };
                });

                return (
                  <Card key={payment.id} size="sm">
                    <CardContent>
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/payments/${payment.id}`}
                              className="font-medium underline-offset-4 hover:underline"
                            >
                              {payment.paymentCode}
                            </Link>

                            <StatusBadge
                              tone={paymentStatusTones[payment.status]}
                            >
                              {paymentStatusLabels[payment.status]}
                            </StatusBadge>
                          </div>

                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Số tiền
                              </p>

                              <p className="mt-1 font-medium tabular-nums">
                                {formatCurrency(payment.amount)}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-xs">
                                Phương thức
                              </p>

                              <p className="mt-1 font-medium">
                                {paymentMethodLabels[payment.method]}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-xs">
                                Ngày nhận
                              </p>

                              <p className="mt-1 font-medium">
                                {formatDateTime(payment.paidAt)}
                              </p>
                            </div>
                          </div>

                          {payment.note ? (
                            <p className="text-muted-foreground mt-3 text-sm whitespace-pre-wrap">
                              {payment.note}
                            </p>
                          ) : null}

                          <div className="mt-4">
                            <Button
                              nativeButton={false}
                              variant="outline"
                              size="sm"
                              render={<Link href={`/payments/${payment.id}`} />}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-lg border p-3">
                          <p className="text-sm font-medium">Allocation</p>

                          <div className="mt-3 grid gap-2">
                            {allocationRows.map((allocation) => (
                              <div
                                key={allocation.id}
                                className="flex items-start justify-between gap-3"
                              >
                                <span className="text-sm">
                                  {allocation.courseName}
                                </span>

                                <span className="text-sm font-medium whitespace-nowrap tabular-nums">
                                  {formatCurrency(allocation.amount)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
                            <span className="text-xs font-medium">Tổng</span>

                            <span className="text-sm font-medium tabular-nums">
                              {formatCurrency(
                                payment.allocations.reduce(
                                  (total, allocation) =>
                                    total + allocation.amount,
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
