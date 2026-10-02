"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type AppTableFeatures,
} from "@/shared/ui/data-table/data-table";

type DemoStudent = {
  id: string;
  name: string;
  phone: string;
  program: string;
  status: "Đang học" | "Chờ lớp" | "Hoàn thành";
};

const columns: ColumnDef<AppTableFeatures, DemoStudent>[] = [
  {
    accessorKey: "id",
    header: "Mã học viên",
  },
  {
    accessorKey: "name",
    header: "Họ và tên",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "program",
    header: "Chương trình",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant="outline">{row.original.status}</Badge>,
  },
];

const data: DemoStudent[] = [
  {
    id: "HV-0001",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    program: "NET English",
    status: "Đang học",
  },
  {
    id: "HV-0002",
    name: "Trần Minh Anh",
    phone: "0912345678",
    program: "NET HSK",
    status: "Chờ lớp",
  },
  {
    id: "HV-0003",
    name: "Lê Hoàng Minh",
    phone: "0987654321",
    program: "NET English",
    status: "Hoàn thành",
  },
  {
    id: "HV-0004",
    name: "Phạm Gia Hân",
    phone: "0934567890",
    program: "NET English",
    status: "Đang học",
  },
  {
    id: "HV-0005",
    name: "Võ Quốc Bảo",
    phone: "0976543210",
    program: "NET HSK",
    status: "Chờ lớp",
  },
];

export function DemoStudentsTable() {
  return (
    <DataTable
      columns={columns}
      data={data}
      emptyMessage="Chưa có học viên."
      pageSize={3}
    />
  );
}
