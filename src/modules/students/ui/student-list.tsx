"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ProgramCode,
  StudentListItem,
  StudentSourceCategory,
  StudentStatus,
} from "@/modules/students/model/student.types";
import { StudentListTable } from "@/modules/students/ui/student-list-table";

type ProgramFilter = "ALL" | ProgramCode;

type StudentStatusFilter = "ALL" | StudentStatus;

type SourceFilter = "ALL" | StudentSourceCategory;

const programLabels: Record<ProgramCode, string> = {
  NET_HSK: "NET HSK",
  NET_ENGLISH: "NET English",
};

const studentStatusLabels: Record<StudentStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const sourceLabels: Record<StudentSourceCategory, string> = {
  MARKETING: "Marketing",
  EXTERNAL_RELATIONS: "Đối ngoại",
  SELF_SOURCED: "Tự kiếm",
};

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

type StudentListProps = {
  data: StudentListItem[];

  onEdit: (student: StudentListItem) => void;
};

export function StudentList({ data, onEdit }: StudentListProps) {
  const [search, setSearch] = useState("");

  const [program, setProgram] = useState<ProgramFilter>("ALL");

  const [status, setStatus] = useState<StudentStatusFilter>("ALL");

  const [source, setSource] = useState<SourceFilter>("ALL");

  const [salesName, setSalesName] = useState("ALL");

  const salesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((student) => student.assignedSalesName)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b, "vi")),
    [data]
  );

  const filteredData = useMemo(() => {
    const normalizedSearch = normalizeSearchText(search);

    return data.filter((student) => {
      if (normalizedSearch) {
        const searchableValues = [
          student.studentCode,
          student.fullName,
          student.phone,
          student.email,
        ];

        const matchesSearch = searchableValues.some((value) =>
          normalizeSearchText(value).includes(normalizedSearch)
        );

        if (!matchesSearch) {
          return false;
        }
      }

      if (program !== "ALL" && !student.latestPrograms.includes(program)) {
        return false;
      }

      if (status !== "ALL" && student.status !== status) {
        return false;
      }

      if (source !== "ALL" && student.source.category !== source) {
        return false;
      }

      if (salesName !== "ALL" && student.assignedSalesName !== salesName) {
        return false;
      }

      return true;
    });
  }, [data, program, salesName, search, source, status]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    program !== "ALL" ||
    status !== "ALL" ||
    source !== "ALL" ||
    salesName !== "ALL";

  function clearFilters() {
    setSearch("");
    setProgram("ALL");
    setStatus("ALL");
    setSource("ALL");
    setSalesName("ALL");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border p-4">
        <div className="grid gap-3">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tên, SĐT, email, mã học viên..."
              className="pl-8"
              aria-label="Tìm học viên"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0">
              <Select
                value={program}
                onValueChange={(value) =>
                  setProgram((value ?? "ALL") as ProgramFilter)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">Tất cả chương trình</SelectItem>

                  <SelectItem value="NET_HSK">
                    {programLabels.NET_HSK}
                  </SelectItem>

                  <SelectItem value="NET_ENGLISH">
                    {programLabels.NET_ENGLISH}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus((value ?? "ALL") as StudentStatusFilter)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">Tất cả trạng thái</SelectItem>

                  <SelectItem value="ACTIVE">
                    {studentStatusLabels.ACTIVE}
                  </SelectItem>

                  <SelectItem value="INACTIVE">
                    {studentStatusLabels.INACTIVE}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select
                value={source}
                onValueChange={(value) =>
                  setSource((value ?? "ALL") as SourceFilter)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">Tất cả nguồn</SelectItem>

                  <SelectItem value="MARKETING">
                    {sourceLabels.MARKETING}
                  </SelectItem>

                  <SelectItem value="EXTERNAL_RELATIONS">
                    {sourceLabels.EXTERNAL_RELATIONS}
                  </SelectItem>

                  <SelectItem value="SELF_SOURCED">
                    {sourceLabels.SELF_SOURCED}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <Select
                value={salesName}
                onValueChange={(value) => setSalesName(value ?? "ALL")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">Tất cả sale</SelectItem>

                  {salesOptions.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              <X />
              Xóa lọc
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Hiển thị{" "}
          <span className="text-foreground font-medium">
            {filteredData.length}
          </span>{" "}
          / {data.length} học viên
        </p>

        {hasActiveFilters ? (
          <p className="text-muted-foreground text-xs">
            Danh sách đang được lọc
          </p>
        ) : null}
      </div>

      <StudentListTable data={filteredData} onEdit={onEdit} />
    </div>
  );
}
