"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { getStudentProfileMock } from "@/modules/students/data/student.mock";
import type {
  EnrollmentHistoryStatus,
  ProgramCode,
  StudentListItem,
  StudentStatus,
} from "@/modules/students/model/student.types";
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

const studentStatusLabels: Record<StudentStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const studentStatusTones: Record<StudentStatus, StatusTone> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
};

const enrollmentStatusLabels: Record<EnrollmentHistoryStatus, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Chờ duyệt",
  RETURNED: "Bị trả lại",
  APPROVED: "Đã duyệt",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const enrollmentStatusTones: Record<EnrollmentHistoryStatus, StatusTone> = {
  DRAFT: "neutral",
  SUBMITTED: "pending",
  RETURNED: "danger",
  APPROVED: "success",
  COMPLETED: "success",
  CANCELLED: "neutral",
};

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

function createColumns(
  onEdit: (student: StudentListItem) => void
): ColumnDef<AppTableFeatures, StudentListItem>[] {
  return [
    {
      accessorKey: "studentCode",
      header: "Mã học viên",

      cell: ({ row }) => (
        <span className="font-medium whitespace-nowrap">
          {row.original.studentCode}
        </span>
      ),
    },

    {
      accessorKey: "fullName",
      header: "Học viên",

      cell: ({ row }) => {
        const student = row.original;

        const hasProfile = Boolean(getStudentProfileMock(student.id));

        return (
          <div className="min-w-44">
            {hasProfile ? (
              <Link
                href={`/students/${student.id}`}
                className="font-medium hover:underline"
              >
                {student.fullName}
              </Link>
            ) : (
              <p className="font-medium">{student.fullName}</p>
            )}

            <p className="text-muted-foreground mt-0.5 text-xs">
              {student.email}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "phone",
      header: "Số điện thoại",

      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.phone}</span>
      ),
    },

    {
      id: "programs",
      header: "Chương trình",

      cell: ({ row }) => {
        const programs = row.original.latestPrograms;

        if (programs.length === 0) {
          return <span className="text-muted-foreground">Chưa ghi danh</span>;
        }

        return (
          <div className="flex min-w-32 flex-wrap gap-1">
            {programs.map((program) => (
              <StatusBadge key={program} tone="info">
                {programLabels[program]}
              </StatusBadge>
            ))}
          </div>
        );
      },
    },

    {
      id: "enrollmentStatus",
      header: "Ghi danh gần nhất",

      cell: ({ row }) => {
        const status = row.original.latestEnrollmentStatus;

        if (!status) {
          return <span className="text-muted-foreground">Chưa có</span>;
        }

        return (
          <StatusBadge tone={enrollmentStatusTones[status]}>
            {enrollmentStatusLabels[status]}
          </StatusBadge>
        );
      },
    },

    {
      id: "studentStatus",
      header: "Trạng thái",

      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <StatusBadge tone={studentStatusTones[status]}>
            {studentStatusLabels[status]}
          </StatusBadge>
        );
      },
    },

    {
      id: "sales",
      header: "Sale phụ trách",

      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.assignedSalesName ?? "—"}
        </span>
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
        const student = row.original;

        const hasProfile = Boolean(getStudentProfileMock(student.id));

        return (
          <div className="flex items-center justify-end gap-1">
            {hasProfile ? (
              <Button
                nativeButton={false}
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Xem hồ sơ ${student.fullName}`}
                render={<Link href={`/students/${student.id}`} />}
              >
                <Eye />
              </Button>
            ) : null}

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Sửa ${student.fullName}`}
              onClick={() => onEdit(student)}
            >
              <Pencil />
            </Button>
          </div>
        );
      },
    },
  ];
}

type StudentListTableProps = {
  data: StudentListItem[];

  onEdit: (student: StudentListItem) => void;
};

export function StudentListTable({ data, onEdit }: StudentListTableProps) {
  return (
    <DataTable
      columns={createColumns(onEdit)}
      data={data}
      emptyMessage="Không tìm thấy học viên phù hợp."
      pageSize={10}
    />
  );
}
