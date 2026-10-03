"use client";

import {
  BadgeDollarSign,
  FileText,
  UserRound,
  WalletCards,
} from "lucide-react";

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
import { enrollmentSalesOptionsMock } from "@/modules/enrollments/data/enrollment.mock";
import type {
  EnrollmentContractDraft,
  EnrollmentItemDraft,
  EnrollmentItemPaymentPlan,
  EnrollmentPaymentPlan,
  PaymentPlanMode,
} from "@/modules/enrollments/model/enrollment.types";
import {
  buildPaymentPlan,
  getDepositAmount,
  getInstallmentCount,
  getPlannedTotal,
} from "@/modules/enrollments/service/enrollment-payment-plan";
import type { StudentListItem } from "@/modules/students/model/student.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

const paymentModeLabels: Record<PaymentPlanMode, string> = {
  FULL: "Thanh toán toàn bộ",

  INSTALLMENTS: "Chia nhiều đợt",

  DEPOSIT_THEN_INSTALLMENTS: "Cọc + chia đợt",
};

type ContractMode = "NONE" | "DRAFT" | "PENDING_SIGNATURE";

type EnrollmentCommercialStepProps = {
  student: StudentListItem;

  items: EnrollmentItemDraft[];

  paymentPlan: EnrollmentPaymentPlan;

  onPaymentPlanChange: (value: EnrollmentPaymentPlan) => void;

  salesPersonId?: string;

  onSalesPersonIdChange: (value?: string) => void;

  specialRequirements: string;

  onSpecialRequirementsChange: (value: string) => void;

  contract?: EnrollmentContractDraft;

  onContractChange: (value: EnrollmentContractDraft | undefined) => void;
};

export function EnrollmentCommercialStep({
  student,
  items,
  paymentPlan,
  onPaymentPlanChange,
  salesPersonId,
  onSalesPersonIdChange,
  specialRequirements,
  onSpecialRequirementsChange,
  contract,
  onContractChange,
}: EnrollmentCommercialStepProps) {
  function getPlan(enrollmentItemId: string) {
    return paymentPlan.items.find(
      (plan) => plan.enrollmentItemId === enrollmentItemId
    );
  }

  function replacePlan(nextPlan: EnrollmentItemPaymentPlan) {
    const exists = paymentPlan.items.some(
      (plan) => plan.enrollmentItemId === nextPlan.enrollmentItemId
    );

    onPaymentPlanChange({
      items: exists
        ? paymentPlan.items.map((plan) =>
            plan.enrollmentItemId === nextPlan.enrollmentItemId
              ? nextPlan
              : plan
          )
        : [...paymentPlan.items, nextPlan],
    });
  }

  function removePlan(enrollmentItemId: string) {
    onPaymentPlanChange({
      items: paymentPlan.items.filter(
        (plan) => plan.enrollmentItemId !== enrollmentItemId
      ),
    });
  }

  function changeMode(item: EnrollmentItemDraft, value: string) {
    if (value === "NONE") {
      removePlan(item.id);
      return;
    }

    const currentPlan = getPlan(item.id);

    replacePlan(
      buildPaymentPlan({
        enrollmentItemId: item.id,

        courseName: item.courseName,

        finalTuition: item.finalTuition,

        mode: value as PaymentPlanMode,

        installmentCount: getInstallmentCount(currentPlan),

        depositAmount: getDepositAmount(currentPlan),
      })
    );
  }

  function changeInstallmentCount(item: EnrollmentItemDraft, count: number) {
    const currentPlan = getPlan(item.id);

    if (!currentPlan || currentPlan.mode === "FULL") {
      return;
    }

    replacePlan(
      buildPaymentPlan({
        enrollmentItemId: item.id,

        courseName: item.courseName,

        finalTuition: item.finalTuition,

        mode: currentPlan.mode,

        installmentCount: count,

        depositAmount: getDepositAmount(currentPlan),
      })
    );
  }

  function changeDeposit(item: EnrollmentItemDraft, amount: number) {
    const currentPlan = getPlan(item.id);

    if (!currentPlan || currentPlan.mode !== "DEPOSIT_THEN_INSTALLMENTS") {
      return;
    }

    replacePlan(
      buildPaymentPlan({
        enrollmentItemId: item.id,

        courseName: item.courseName,

        finalTuition: item.finalTuition,

        mode: currentPlan.mode,

        installmentCount: getInstallmentCount(currentPlan),

        depositAmount: amount,
      })
    );
  }

  function updateLine(
    enrollmentItemId: string,
    lineId: string,
    patch: {
      amount?: number;
      dueDate?: string;
    }
  ) {
    const currentPlan = getPlan(enrollmentItemId);

    if (!currentPlan) {
      return;
    }

    replacePlan({
      ...currentPlan,

      lines: currentPlan.lines.map((line) =>
        line.id === lineId
          ? {
              ...line,
              ...patch,
            }
          : line
      ),
    });
  }

  const selectedSale = enrollmentSalesOptionsMock.find(
    (sale) => sale.id === salesPersonId
  );

  const contractMode: ContractMode = contract?.status ?? "NONE";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Thanh toán và thông tin thương mại
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Lập kế hoạch thanh toán cho từng khóa, chọn sale và bổ sung thông tin
          hợp đồng.
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((item) => {
          const plan = getPlan(item.id);

          const plannedTotal = getPlannedTotal(plan);

          const balanced = plannedTotal === item.finalTuition;

          return (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{item.courseName}</CardTitle>

                    <CardDescription className="mt-1">
                      Học phí cuối: {formatCurrency(item.finalTuition)}
                    </CardDescription>
                  </div>

                  {plan ? (
                    <StatusBadge tone={balanced ? "success" : "danger"}>
                      {balanced ? "Đã cân" : "Lệch học phí"}
                    </StatusBadge>
                  ) : (
                    <StatusBadge tone="pending">Chưa lập kế hoạch</StatusBadge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <label
                        htmlFor={`payment-mode-${item.id}`}
                        className="text-sm font-medium"
                      >
                        Hình thức thanh toán
                      </label>

                      <Select
                        value={plan?.mode ?? "NONE"}
                        onValueChange={(value) =>
                          changeMode(item, value ?? "NONE")
                        }
                      >
                        <SelectTrigger
                          id={`payment-mode-${item.id}`}
                          className="w-full"
                        >
                          <span className="truncate">
                            {plan
                              ? paymentModeLabels[plan.mode]
                              : "Chọn hình thức..."}
                          </span>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="NONE">
                            Chưa lập kế hoạch
                          </SelectItem>

                          <SelectItem value="FULL">
                            Thanh toán toàn bộ
                          </SelectItem>

                          <SelectItem value="INSTALLMENTS">
                            Chia nhiều đợt
                          </SelectItem>

                          <SelectItem value="DEPOSIT_THEN_INSTALLMENTS">
                            Cọc + chia đợt
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {plan && plan.mode !== "FULL" ? (
                      <div className="grid gap-2">
                        <label
                          htmlFor={`installment-count-${item.id}`}
                          className="text-sm font-medium"
                        >
                          Số đợt
                        </label>

                        <Select
                          value={String(getInstallmentCount(plan))}
                          onValueChange={(value) =>
                            changeInstallmentCount(item, Number(value ?? "2"))
                          }
                        >
                          <SelectTrigger
                            id={`installment-count-${item.id}`}
                            className="w-full"
                          >
                            <span>{getInstallmentCount(plan)} đợt</span>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="1">1 đợt</SelectItem>

                            <SelectItem value="2">2 đợt</SelectItem>

                            <SelectItem value="3">3 đợt</SelectItem>
                          </SelectContent>
                        </Select>

                        {plan.mode === "DEPOSIT_THEN_INSTALLMENTS" ? (
                          <p className="text-muted-foreground text-xs">
                            Tiền cọc không tính vào số đợt.
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  {plan?.mode === "DEPOSIT_THEN_INSTALLMENTS" ? (
                    <div className="grid gap-2 md:max-w-sm">
                      <label
                        htmlFor={`deposit-${item.id}`}
                        className="text-sm font-medium"
                      >
                        Tiền cọc
                      </label>

                      <Input
                        id={`deposit-${item.id}`}
                        type="number"
                        min={0}
                        max={item.finalTuition}
                        step={1000}
                        value={getDepositAmount(plan)}
                        onChange={(event) =>
                          changeDeposit(item, Number(event.target.value) || 0)
                        }
                      />
                    </div>
                  ) : null}

                  {plan ? (
                    <div className="grid gap-3">
                      <p className="text-sm font-medium">Các khoản dự kiến</p>

                      {plan.lines.map((line) => (
                        <div
                          key={line.id}
                          className="grid gap-3 rounded-lg border p-3 md:grid-cols-[minmax(140px,1fr)_minmax(150px,220px)_minmax(150px,220px)] md:items-end"
                        >
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Khoản
                            </p>

                            <p className="mt-1 font-medium">{line.label}</p>
                          </div>

                          <div className="grid gap-2">
                            <label
                              htmlFor={`amount-${line.id}`}
                              className="text-xs font-medium"
                            >
                              Số tiền
                            </label>

                            <Input
                              id={`amount-${line.id}`}
                              type="number"
                              min={0}
                              step={1000}
                              value={line.amount}
                              onChange={(event) =>
                                updateLine(item.id, line.id, {
                                  amount: Number(event.target.value) || 0,
                                })
                              }
                            />
                          </div>

                          <div className="grid gap-2">
                            <label
                              htmlFor={`due-${line.id}`}
                              className="text-xs font-medium"
                            >
                              Hạn dự kiến
                            </label>

                            <Input
                              id={`due-${line.id}`}
                              type="date"
                              value={line.dueDate ?? ""}
                              onChange={(event) =>
                                updateLine(item.id, line.id, {
                                  dueDate: event.target.value || undefined,
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <div className="bg-muted/30 grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Tổng kế hoạch
                          </p>

                          <p className="mt-1 font-medium tabular-nums">
                            {formatCurrency(plannedTotal)}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Học phí phải thu
                          </p>

                          <p className="mt-1 font-medium tabular-nums">
                            {formatCurrency(item.finalTuition)}
                          </p>
                        </div>
                      </div>

                      {!balanced ? (
                        <p className="text-destructive text-sm">
                          Tổng các khoản phải bằng đúng học phí cuối của khóa.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
              <UserRound className="size-4" />
            </div>

            <div>
              <CardTitle>Nguồn và sale phụ trách</CardTitle>

              <CardDescription>
                Nguồn acquisition của Student được giữ nguyên. Sale thuộc lần
                ghi danh này.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="bg-muted/30 rounded-lg border p-4">
              <p className="text-muted-foreground text-xs">Data đến từ đâu</p>

              <p className="mt-1 font-medium">{student.source.detail}</p>

              <p className="text-muted-foreground mt-2 text-xs">
                Readonly từ Student master.
              </p>
            </div>

            <div className="grid gap-2">
              <label htmlFor="enrollment-sale" className="text-sm font-medium">
                Sale phụ trách
              </label>

              <Select
                value={salesPersonId ?? "UNASSIGNED"}
                onValueChange={(value) =>
                  onSalesPersonIdChange(
                    value && value !== "UNASSIGNED" ? value : undefined
                  )
                }
              >
                <SelectTrigger id="enrollment-sale" className="w-full">
                  <span className="truncate">
                    {selectedSale?.name ?? "Chọn sale..."}
                  </span>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="UNASSIGNED">Chưa chọn sale</SelectItem>

                  {enrollmentSalesOptionsMock.map((sale) => (
                    <SelectItem key={sale.id} value={sale.id}>
                      {sale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
              <BadgeDollarSign className="size-4" />
            </div>

            <div>
              <CardTitle>Yêu cầu riêng</CardTitle>

              <CardDescription>
                Các yêu cầu liên quan tới lịch học, học viên hoặc xử lý hồ sơ.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Textarea
            value={specialRequirements}
            onChange={(event) =>
              onSpecialRequirementsChange(event.target.value)
            }
            placeholder="VD: Chỉ học sau 18:00. Nếu không có yêu cầu, nhập 'Không có'."
            className="min-h-28"
          />

          <p className="text-muted-foreground mt-2 text-xs">
            Khi gửi duyệt, field này phải có nội dung. Có thể ghi “Không có”.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
              <FileText className="size-4" />
            </div>

            <div>
              <CardTitle>Hợp đồng</CardTitle>

              <CardDescription>
                Thông tin hợp đồng của lần ghi danh này.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5">
            <div className="grid gap-2 md:max-w-md">
              <label htmlFor="contract-status" className="text-sm font-medium">
                Tình trạng hợp đồng
              </label>

              <Select
                value={contractMode}
                onValueChange={(value) => {
                  const mode = (value ?? "NONE") as ContractMode;

                  if (mode === "NONE") {
                    onContractChange(undefined);

                    return;
                  }

                  onContractChange({
                    contractCode: contract?.contractCode,

                    documentUrl: contract?.documentUrl,

                    status: mode,
                  });
                }}
              >
                <SelectTrigger id="contract-status" className="w-full">
                  <span>
                    {contractMode === "NONE"
                      ? "Chưa có hợp đồng"
                      : contractMode === "DRAFT"
                        ? "Bản nháp"
                        : "Chờ ký"}
                  </span>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="NONE">Chưa có hợp đồng</SelectItem>

                  <SelectItem value="DRAFT">Bản nháp</SelectItem>

                  <SelectItem value="PENDING_SIGNATURE">Chờ ký</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {contract ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <label
                    htmlFor="contract-code"
                    className="text-sm font-medium"
                  >
                    Mã hợp đồng
                  </label>

                  <Input
                    id="contract-code"
                    value={contract.contractCode ?? ""}
                    onChange={(event) =>
                      onContractChange({
                        ...contract,

                        contractCode: event.target.value,
                      })
                    }
                    placeholder="HD-2026-..."
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="contract-url" className="text-sm font-medium">
                    Link hợp đồng
                  </label>

                  <Input
                    id="contract-url"
                    type="url"
                    value={contract.documentUrl ?? ""}
                    onChange={(event) =>
                      onContractChange({
                        ...contract,

                        documentUrl: event.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-5 text-center">
                <WalletCards className="text-muted-foreground mx-auto size-5" />

                <p className="mt-2 text-sm font-medium">Chưa gắn hợp đồng</p>

                <p className="text-muted-foreground mt-1 text-xs">
                  Draft được phép để trống. Trước khi gửi duyệt phải bổ sung hợp
                  đồng.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
