"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, ImageIcon, Layers3, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  PaymentListItem,
  PaymentMethod,
  PaymentStatus,
} from "@/modules/payments/model/payment.types";
import {
  DataTable,
  type AppTableFeatures,
} from "@/shared/ui/data-table/data-table";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  RETURNED: "Bị trả lại",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<PaymentStatus, StatusTone> = {
  PENDING: "pending",
  CONFIRMED: "success",
  RETURNED: "danger",
  CANCELLED: "neutral",
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

const columns: ColumnDef<AppTableFeatures, PaymentListItem>[] = [
  {
    accessorKey: "paymentCode",

    header: "Mã giao dịch",

    cell: ({ row }) => (
      <Link
        href={`/payments/${row.original.id}`}
        className="font-medium whitespace-nowrap underline-offset-4 hover:underline"
      >
        {row.original.paymentCode}
      </Link>
    ),
  },

  {
    id: "student",

    header: "Học viên",

    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium">{row.original.studentName}</p>

        <p className="text-muted-foreground mt-0.5 text-xs">
          {row.original.studentCode}
        </p>
      </div>
    ),
  },

  {
    id: "enrollment",

    header: "Ghi danh",

    cell: ({ row }) => (
      <div className="min-w-36">
        <Link
          href={`/payments/enrollments/${row.original.enrollmentId}`}
          className="font-medium whitespace-nowrap underline-offset-4 hover:underline"
        >
          {row.original.enrollmentCode}
        </Link>

        <p className="text-muted-foreground mt-0.5 text-xs">
          Sale: {row.original.salesName ?? "—"}
        </p>
      </div>
    ),
  },

  {
    accessorKey: "amount",

    header: "Số tiền",

    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap tabular-nums">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },

  {
    id: "allocation",

    header: "Phân bổ",

    cell: ({ row }) => {
      const payment = row.original;

      const firstCourse = payment.allocatedCourseNames[0];

      return (
        <div className="min-w-44">
          <div className="flex items-center gap-1.5">
            <Layers3 className="text-muted-foreground size-3.5 shrink-0" />

            <span className="text-sm">{firstCourse ?? "Chưa phân bổ"}</span>
          </div>

          {payment.allocationCount > 1 ? (
            <p className="text-muted-foreground mt-1 text-xs">
              + {payment.allocationCount - 1} khóa khác
            </p>
          ) : null}

          <p className="text-muted-foreground mt-1 text-xs tabular-nums">
            {formatCurrency(payment.allocatedAmount)}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "method",

    header: "Phương thức",

    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {methodLabels[row.original.method]}
      </span>
    ),
  },

  {
    id: "proof",

    header: "Minh chứng",

    cell: ({ row }) =>
      row.original.hasProof ? (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <ImageIcon className="text-muted-foreground size-3.5" />

          <span className="text-sm">Có ảnh</span>
        </div>
      ) : (
        <span className="text-muted-foreground whitespace-nowrap">
          Không có
        </span>
      ),
  },

  {
    accessorKey: "status",

    header: "Trạng thái",

    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <StatusBadge tone={statusTones[status]}>
          {statusLabels[status]}
        </StatusBadge>
      );
    },
  },

  {
    accessorKey: "paidAt",

    header: "Ngày nhận",

    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {formatDateTime(row.original.paidAt)}
      </span>
    ),
  },

  {
    id: "createdBy",

    header: "Ghi nhận bởi",

    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {row.original.createdByName ?? "—"}
      </span>
    ),
  },

  {
    id: "actions",

    header: "",

    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={`/payments/${row.original.id}`} />}
        >
          <Eye />
          Chi tiết
        </Button>

        <Button
          nativeButton={false}
          variant="ghost"
          size="sm"
          render={
            <Link href={`/payments/enrollments/${row.original.enrollmentId}`} />
          }
        >
          <WalletCards />
          Tài chính
        </Button>
      </div>
    ),
  },
];

type PaymentListTableProps = {
  data: PaymentListItem[];
};

export function PaymentListTable({ data }: PaymentListTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="Không có giao dịch phù hợp."
      pageSize={10}
    />
  );
}
