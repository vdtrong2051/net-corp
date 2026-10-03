import {
  AlertCircle,
  BookOpen,
  CalendarClock,
  FileText,
  GraduationCap,
  ReceiptText,
  UserRound,
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
import { enrollmentSalesOptionsMock } from "@/modules/enrollments/data/enrollment.mock";
import type {
  EnrollmentContractDraft,
  EnrollmentItemDraft,
  EnrollmentPaymentPlan,
  EnrollmentProgramSelection,
  PaymentPlanMode,
} from "@/modules/enrollments/model/enrollment.types";
import type { StudentListItem } from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

export type EnrollmentReviewIssue = {
  step: 1 | 2 | 3 | 4;

  message: string;
};

type EnrollmentReviewStepProps = {
  student: StudentListItem;

  programs: EnrollmentProgramSelection[];

  items: EnrollmentItemDraft[];

  paymentPlan: EnrollmentPaymentPlan;

  salesPersonId?: string;

  specialRequirements: string;

  contract?: EnrollmentContractDraft;

  issues: EnrollmentReviewIssue[];

  onEditStep: (step: 1 | 2 | 3 | 4) => void;
};

const paymentModeLabels: Record<PaymentPlanMode, string> = {
  FULL: "Thanh toán toàn bộ",

  INSTALLMENTS: "Chia nhiều đợt",

  DEPOSIT_THEN_INSTALLMENTS: "Cọc + chia đợt",
};

const stepLabels: Record<EnrollmentReviewIssue["step"], string> = {
  1: "Học viên",
  2: "Chương trình",
  3: "Khóa học",
  4: "Thanh toán & thương mại",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatExpectedStart(value?: string) {
  if (!value) {
    return "—";
  }

  const match = /^(\d{4})-(\d{2})$/.exec(value);

  if (!match) {
    return value;
  }

  return `${match[2]}/${match[1]}`;
}

function getPlannedTotal(
  paymentPlan: EnrollmentPaymentPlan,
  enrollmentItemId: string
) {
  const plan = paymentPlan.items.find(
    (item) => item.enrollmentItemId === enrollmentItemId
  );

  if (!plan) {
    return 0;
  }

  return plan.lines.reduce((total, line) => total + line.amount, 0);
}

function getPlan(paymentPlan: EnrollmentPaymentPlan, enrollmentItemId: string) {
  return paymentPlan.items.find(
    (item) => item.enrollmentItemId === enrollmentItemId
  );
}

function getPricingTone(balanced: boolean): StatusTone {
  return balanced ? "success" : "danger";
}

function ReviewSectionHeader({
  title,
  description,
  step,
  onEditStep,
}: {
  title: string;

  description?: string;

  step: 1 | 2 | 3 | 4;

  onEditStep: (step: 1 | 2 | 3 | 4) => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <CardTitle>{title}</CardTitle>

        {description ? (
          <CardDescription className="mt-1">{description}</CardDescription>
        ) : null}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onEditStep(step)}
      >
        Sửa
      </Button>
    </div>
  );
}

export function EnrollmentReviewStep({
  student,
  programs,
  items,
  paymentPlan,
  salesPersonId,
  specialRequirements,
  contract,
  issues,
  onEditStep,
}: EnrollmentReviewStepProps) {
  const selectedSale = enrollmentSalesOptionsMock.find(
    (sale) => sale.id === salesPersonId
  );

  const totalBaseTuition = items.reduce(
    (total, item) => total + item.baseTuition,
    0
  );

  const totalFinalTuition = items.reduce(
    (total, item) => total + item.finalTuition,
    0
  );

  const totalDiscount = Math.max(totalBaseTuition - totalFinalTuition, 0);

  const totalPlanned = paymentPlan.items.reduce(
    (total, plan) =>
      total +
      plan.lines.reduce((planTotal, line) => planTotal + line.amount, 0),
    0
  );

  const paymentBalanced = totalPlanned === totalFinalTuition;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Review hồ sơ ghi danh
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Kiểm tra lại toàn bộ dữ liệu trước khi lưu nháp hoặc gửi quản lý
          duyệt.
        </p>
      </div>

      {issues.length > 0 ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-lg">
                <AlertCircle className="size-5" />
              </div>

              <div>
                <CardTitle>Hồ sơ chưa thể gửi duyệt</CardTitle>

                <CardDescription>
                  Còn {issues.length} vấn đề cần hoàn thiện.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-2">
              {issues.map((issue, index) => (
                <button
                  key={`${issue.step}-${index}-${issue.message}`}
                  type="button"
                  className="hover:bg-muted/60 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors"
                  onClick={() => onEditStep(issue.step)}
                >
                  <StatusBadge tone="danger">Bước {issue.step}</StatusBadge>

                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {stepLabels[issue.step]}
                    </p>

                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {issue.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <ReviewSectionHeader
            title="Học viên"
            description="Student master được gắn với lần ghi danh này."
            step={1}
            onEditStep={onEditStep}
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-xs">Mã học viên</p>

              <p className="mt-1 font-medium">{student.studentCode}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Họ tên</p>

              <p className="mt-1 font-medium">{student.fullName}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Số điện thoại</p>

              <p className="mt-1 font-medium">{student.phone}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Email</p>

              <p className="mt-1 font-medium break-all">{student.email}</p>
            </div>
          </div>

          <div className="bg-muted/30 mt-5 rounded-lg border p-4">
            <div className="flex gap-3">
              <UserRound className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <div>
                <p className="text-muted-foreground text-xs">Data đến từ đâu</p>

                <p className="mt-1 font-medium">{student.source.detail}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ReviewSectionHeader
            title="Chương trình"
            description={`${programs.length} chương trình trong lần ghi danh.`}
            step={2}
            onEditStep={onEditStep}
          />
        </CardHeader>

        <CardContent>
          {programs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {programs.map((programInfo) => (
                <div
                  key={programInfo.program}
                  className="rounded-lg border p-4"
                >
                  <StatusBadge tone="info">
                    {courseProgramLabels[programInfo.program]}
                  </StatusBadge>

                  <div className="mt-4 grid gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Đầu vào</p>

                      <p className="mt-1 text-sm break-all">
                        {programInfo.inputAssessmentUrl?.trim() || "Chưa có"}
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs">
                        Mục tiêu đầu ra
                      </p>

                      <p className="mt-1 text-sm">
                        {programInfo.outputGoal.trim() || "Chưa có"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Chưa chọn chương trình.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ReviewSectionHeader
            title="Khóa học và học phí"
            description={`${items.length} khóa học đã được thêm.`}
            step={3}
            onEditStep={onEditStep}
          />
        </CardHeader>

        <CardContent>
          {items.length > 0 ? (
            <div className="grid gap-4">
              {items.map((item, index) => {
                const plan = getPlan(paymentPlan, item.id);

                const planned = getPlannedTotal(paymentPlan, item.id);

                const balanced = planned === item.finalTuition;

                return (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">
                            {index + 1}. {item.courseName}
                          </p>

                          <StatusBadge tone="info">
                            {courseProgramLabels[item.program]}
                          </StatusBadge>
                        </div>

                        <p className="text-muted-foreground mt-1 text-xs">
                          {courseTrackLabels[item.track]} ·{" "}
                          {courseDeliveryModeLabels[item.deliveryMode]}
                        </p>
                      </div>

                      {plan ? (
                        <StatusBadge tone={getPricingTone(balanced)}>
                          {balanced ? "Plan đã cân" : "Plan bị lệch"}
                        </StatusBadge>
                      ) : (
                        <StatusBadge tone="pending">
                          Chưa có payment plan
                        </StatusBadge>
                      )}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Xếp lớp</p>

                        <p className="mt-1 font-medium">
                          {item.classMode === "CLASS"
                            ? item.classCode || "Chưa chọn lớp"
                            : `Dự kiến ${formatExpectedStart(
                                item.expectedStart
                              )}`}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Học phí gốc
                        </p>

                        <p className="mt-1 font-medium tabular-nums">
                          {formatCurrency(item.baseTuition)}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">Ưu đãi</p>

                        <p className="mt-1 font-medium">
                          {item.scholarship?.label ?? "Không học bổng"}
                        </p>

                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {item.voucher?.label ?? "Không voucher"}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Học phí cuối
                        </p>

                        <p className="mt-1 text-lg font-semibold tabular-nums">
                          {formatCurrency(item.finalTuition)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/30 mt-4 rounded-lg border p-3">
                      {plan ? (
                        <>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Kế hoạch thanh toán
                              </p>

                              <p className="mt-1 font-medium">
                                {paymentModeLabels[plan.mode]}
                              </p>
                            </div>

                            <p className="font-medium tabular-nums">
                              {formatCurrency(planned)}
                            </p>
                          </div>

                          <div className="mt-3 grid gap-2">
                            {plan.lines.map((line) => (
                              <div
                                key={line.id}
                                className="flex flex-wrap items-center justify-between gap-2 text-sm"
                              >
                                <div>
                                  <span>{line.label}</span>

                                  {line.dueDate ? (
                                    <span className="text-muted-foreground ml-2 text-xs">
                                      Hạn {formatDate(line.dueDate)}
                                    </span>
                                  ) : null}
                                </div>

                                <span className="tabular-nums">
                                  {formatCurrency(line.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Chưa lập kế hoạch thanh toán cho khóa này.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="bg-muted/30 grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs">Tổng giá gốc</p>

                  <p className="mt-1 font-medium tabular-nums">
                    {formatCurrency(totalBaseTuition)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Tổng ưu đãi</p>

                  <p className="mt-1 font-medium tabular-nums">
                    -{formatCurrency(totalDiscount)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Tổng học phí</p>

                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {formatCurrency(totalFinalTuition)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Chưa có khóa học.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <ReviewSectionHeader
            title="Thanh toán & thông tin thương mại"
            description="Sale, yêu cầu riêng và kế hoạch thu."
            step={4}
            onEditStep={onEditStep}
          />
        </CardHeader>

        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <WalletCards className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Tổng kế hoạch thu
                    </p>

                    <p className="mt-1 text-lg font-semibold tabular-nums">
                      {formatCurrency(totalPlanned)}
                    </p>

                    <div className="mt-2">
                      <StatusBadge
                        tone={paymentBalanced ? "success" : "danger"}
                      >
                        {paymentBalanced ? "Khớp học phí" : "Chưa khớp học phí"}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex gap-3">
                  <ReceiptText className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Sale phụ trách
                    </p>

                    <p className="mt-1 font-medium">
                      {selectedSale?.name ?? "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex gap-3">
                <GraduationCap className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                <div>
                  <p className="text-muted-foreground text-xs">Yêu cầu riêng</p>

                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {specialRequirements.trim() || "Chưa nhập"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <FileText className="size-4" />
              </div>

              <div>
                <CardTitle>Hợp đồng</CardTitle>

                <CardDescription>Hợp đồng gắn với Enrollment.</CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEditStep(4)}
            >
              Sửa
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {contract ? (
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-xs">Trạng thái</p>

                <div className="mt-2">
                  <StatusBadge
                    tone={
                      contract.status === "PENDING_SIGNATURE"
                        ? "pending"
                        : "neutral"
                    }
                  >
                    {contract.status === "PENDING_SIGNATURE"
                      ? "Chờ ký"
                      : "Bản nháp"}
                  </StatusBadge>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Mã hợp đồng</p>

                <p className="mt-1 font-medium">
                  {contract.contractCode?.trim() || "Chưa có"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Link hợp đồng</p>

                <p className="mt-1 text-sm break-all">
                  {contract.documentUrl?.trim() || "Chưa có"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <FileText className="text-muted-foreground mx-auto size-5" />

              <p className="mt-2 font-medium">Chưa có hợp đồng</p>

              <p className="text-muted-foreground mt-1 text-sm">
                Có thể lưu nháp nhưng chưa thể gửi duyệt.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tổng kết</CardTitle>

          <CardDescription>
            Snapshot nhanh trước khi lưu hoặc gửi duyệt.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <BookOpen className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <div>
                <p className="text-muted-foreground text-xs">Chương trình</p>

                <p className="mt-1 font-medium">{programs.length}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <div>
                <p className="text-muted-foreground text-xs">Khóa học</p>

                <p className="mt-1 font-medium">{items.length}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarClock className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <div>
                <p className="text-muted-foreground text-xs">Payment Plan</p>

                <p className="mt-1 font-medium">
                  {paymentPlan.items.length} / {items.length}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <WalletCards className="text-muted-foreground mt-0.5 size-4 shrink-0" />

              <div>
                <p className="text-muted-foreground text-xs">Học phí cuối</p>

                <p className="mt-1 font-medium tabular-nums">
                  {formatCurrency(totalFinalTuition)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
