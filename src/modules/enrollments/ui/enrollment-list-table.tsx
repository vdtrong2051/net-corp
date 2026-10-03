"use client";

import Link from "next/link";
import { PencilLine } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import type {
  EnrollmentListItem,
  EnrollmentStatus,
} from "@/modules/enrollments/model/enrollment.types";
import type { ProgramCode } from "@/modules/students/model/student.types";
import {
  DataTable,
  type AppTableFeatures,
} from "@/shared/ui/data-table/data-table";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const programLabels: Record<ProgramCode, string> = {
  NET_HSK: "NET HSK",
  NET_ENGLISH: "NET English",
};

const statusLabels: Record<EnrollmentStatus, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Chờ duyệt",
  RETURNED: "Bị trả lại",
  APPROVED: "Đã duyệt",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<EnrollmentStatus, StatusTone> = {
  DRAFT: "neutral",
  SUBMITTED: "pending",
  RETURNED: "danger",
  APPROVED: "success",
  COMPLETED: "success",
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

const columns: ColumnDef<AppTableFeatures, EnrollmentListItem>[] = [
  {
    accessorKey: "enrollmentCode",

    header: "Mã ghi danh",

    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap">
        {row.original.enrollmentCode}
      </span>
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
    id: "programs",

    header: "Chương trình",

    cell: ({ row }) => (
      <div className="flex min-w-32 flex-wrap gap-1">
        {row.original.programs.length > 0 ? (
          row.original.programs.map((program) => (
            <StatusBadge key={program} tone="info">
              {programLabels[program]}
            </StatusBadge>
          ))
        ) : (
          <span className="text-muted-foreground">Chưa chọn</span>
        )}
      </div>
    ),
  },

  {
    accessorKey: "itemCount",

    header: "Số khóa",

    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.itemCount}</span>
    ),
  },

  {
    accessorKey: "totalFinalTuition",

    header: "Tổng học phí",

    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap tabular-nums">
        {formatCurrency(row.original.totalFinalTuition)}
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
    id: "sales",

    header: "Sale phụ trách",

    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.salesName ?? "—"}</span>
    ),
  },

  {
    accessorKey: "updatedAt",

    header: "Cập nhật",

    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap">
        {formatDateTime(row.original.updatedAt)}
      </span>
    ),
  },

  {
    id: "actions",

    header: "",

    cell: ({ row }) => {
      const enrollment = row.original;

      /*
       * GĐ6.9 chỉ mở lại DRAFT.
       */
      if (enrollment.status !== "DRAFT") {
        return null;
      }

      return (
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={`/enrollments/${enrollment.id}/edit`} />}
        >
          <PencilLine />
          Tiếp tục
        </Button>
      );
    },
  },
];

type EnrollmentListTableProps = {
  data: EnrollmentListItem[];
};

export function EnrollmentListTable({ data }: EnrollmentListTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="Chưa có hồ sơ ghi danh nào."
      pageSize={10}
    />
  );
}
