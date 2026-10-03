"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Plus,
  RotateCcw,
  Search,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { buildPaymentListItems } from "@/modules/payments/data/payment.mock";
import type {
  PaymentMethod,
  PaymentStatus,
} from "@/modules/payments/model/payment.types";
import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";
import { PaymentListTable } from "@/modules/payments/ui/payment-list-table";
import { PageContainer } from "@/shared/ui/layout/page-container";

type StatusFilter = "ALL" | PaymentStatus;

type MethodFilter = "ALL" | PaymentMethod;

const statusFilterLabels: Record<StatusFilter, string> = {
  ALL: "Tất cả trạng thái",
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  RETURNED: "Bị trả lại",
  CANCELLED: "Đã hủy",
};

const methodFilterLabels: Record<MethodFilter, string> = {
  ALL: "Tất cả phương thức",
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

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function getDateOnly(value: string) {
  return value.slice(0, 10);
}

export function PaymentWorkQueue() {
  /*
   * Source of truth của Payment từ GĐ7.9.
   *
   * Không nhận initialData từ page nữa.
   */
  const { payments } = usePaymentMockStore();

  /*
   * Chuyển Payment domain thành
   * projection dành cho Work Queue.
   */
  const initialData = useMemo(
    () => buildPaymentListItems(payments),
    [payments]
  );

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<StatusFilter>("ALL");

  const [method, setMethod] = useState<MethodFilter>("ALL");

  const [salesName, setSalesName] = useState("ALL");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const salesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          initialData
            .map((payment) => payment.salesName)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b, "vi")),
    [initialData]
  );

  const filteredData = useMemo(() => {
    const query = normalizeSearchText(search);

    return initialData.filter((payment) => {
      if (query) {
        const values = [
          payment.paymentCode,
          payment.studentCode,
          payment.studentName,
          payment.enrollmentCode,
          payment.salesName ?? "",
          ...payment.allocatedCourseNames,
        ];

        const matches = values.some((value) =>
          normalizeSearchText(value).includes(query)
        );

        if (!matches) {
          return false;
        }
      }

      if (status !== "ALL" && payment.status !== status) {
        return false;
      }

      if (method !== "ALL" && payment.method !== method) {
        return false;
      }

      if (salesName !== "ALL" && payment.salesName !== salesName) {
        return false;
      }

      const paidDate = getDateOnly(payment.paidAt);

      if (startDate && paidDate < startDate) {
        return false;
      }

      if (endDate && paidDate > endDate) {
        return false;
      }

      return true;
    });
  }, [initialData, search, status, method, salesName, startDate, endDate]);

  /*
   * KPI vẫn phản ánh toàn Work Queue,
   * không phụ thuộc filter hiện tại.
   */
  const pendingCount = initialData.filter(
    (payment) => payment.status === "PENDING"
  ).length;

  const confirmedCount = initialData.filter(
    (payment) => payment.status === "CONFIRMED"
  ).length;

  const returnedCount = initialData.filter(
    (payment) => payment.status === "RETURNED"
  ).length;

  const confirmedRevenue = initialData
    .filter((payment) => payment.status === "CONFIRMED")
    .reduce((total, payment) => total + payment.amount, 0);

  const hasFilters = Boolean(
    search ||
    status !== "ALL" ||
    method !== "ALL" ||
    salesName !== "ALL" ||
    startDate ||
    endDate
  );

  function clearFilters() {
    setSearch("");

    setStatus("ALL");

    setMethod("ALL");

    setSalesName("ALL");

    setStartDate("");

    setEndDate("");
  }

  return (
    <PageContainer
      title="Thanh toán"
      description="Theo dõi giao dịch thực tế, minh chứng chuyển khoản và phân bổ tiền vào từng khóa."
      actions={
        <Button nativeButton={false} render={<Link href="/payments/create" />}>
          <Plus />
          Ghi nhận thanh toán
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <section
          aria-label="Tổng quan thanh toán"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Chờ xác nhận</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {pendingCount}
                  </CardTitle>
                </div>

                <Clock3 className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Giao dịch đã ghi nhận nhưng chưa được xác nhận
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Đã xác nhận</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {confirmedCount}
                  </CardTitle>
                </div>

                <BadgeCheck className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Giao dịch đang được tính vào công nợ
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Bị trả lại</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {returnedCount}
                  </CardTitle>
                </div>

                <RotateCcw className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Cần kiểm tra hoặc ghi nhận lại
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardDescription>Tổng thu đã xác nhận</CardDescription>

                  <CardTitle className="mt-1 text-xl tabular-nums">
                    {formatCurrency(confirmedRevenue)}
                  </CardTitle>
                </div>

                <CircleDollarSign className="text-muted-foreground size-4" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Không bao gồm Pending, Returned và Cancelled
              </p>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Bộ lọc giao dịch" className="grid gap-3">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm mã giao dịch, học viên, mã ghi danh, sale, khóa học..."
              className="pl-8"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus((value ?? "ALL") as StatusFilter)
              }
            >
              <SelectTrigger className="w-full">
                <span className="truncate">{statusFilterLabels[status]}</span>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>

                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>

                <SelectItem value="RETURNED">Bị trả lại</SelectItem>

                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={method}
              onValueChange={(value) =>
                setMethod((value ?? "ALL") as MethodFilter)
              }
            >
              <SelectTrigger className="w-full">
                <span className="truncate">{methodFilterLabels[method]}</span>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Tất cả phương thức</SelectItem>

                <SelectItem value="BANK_TRANSFER">Chuyển khoản</SelectItem>

                <SelectItem value="CASH">Tiền mặt</SelectItem>

                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={salesName}
              onValueChange={(value) => setSalesName(value ?? "ALL")}
            >
              <SelectTrigger className="w-full">
                <span className="truncate">
                  {salesName === "ALL" ? "Tất cả sale" : salesName}
                </span>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">Tất cả sale</SelectItem>

                {salesOptions.map((sale) => (
                  <SelectItem key={sale} value={sale}>
                    {sale}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              aria-label="Từ ngày"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              aria-label="Đến ngày"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-sm">
              Hiển thị{" "}
              <span className="text-foreground font-medium tabular-nums">
                {filteredData.length}
              </span>{" "}
              / <span className="tabular-nums">{initialData.length}</span> giao
              dịch
            </p>

            {hasFilters ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            ) : null}
          </div>
        </section>

        <section aria-label="Danh sách giao dịch" className="min-w-0">
          <PaymentListTable data={filteredData} />
        </section>
      </div>
    </PageContainer>
  );
}
