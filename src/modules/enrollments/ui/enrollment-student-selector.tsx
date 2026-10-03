"use client";

import { useMemo, useState } from "react";
import { Check, Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  StudentListItem,
  StudentSourceCategory,
  StudentStatus,
} from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const sourceLabels: Record<StudentSourceCategory, string> = {
  MARKETING: "Marketing",
  EXTERNAL_RELATIONS: "Đối ngoại",
  SELF_SOURCED: "Tự kiếm",
};

const statusLabels: Record<StudentStatus, string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const statusTones: Record<StudentStatus, StatusTone> = {
  ACTIVE: "success",
  INACTIVE: "neutral",
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

type EnrollmentStudentSelectorProps = {
  students: StudentListItem[];

  selectedStudentId?: string;

  onSelect: (student: StudentListItem) => void;

  onCreateStudent: () => void;
};

export function EnrollmentStudentSelector({
  students,
  selectedStudentId,
  onSelect,
  onCreateStudent,
}: EnrollmentStudentSelectorProps) {
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const query = normalizeSearchText(search);

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const values = [
        student.studentCode,
        student.fullName,
        student.phone,
        student.email,
        student.citizenId,
      ];

      return values.some((value) => normalizeSearchText(value).includes(query));
    });
  }, [search, students]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, SĐT, email, CCCD, mã học viên..."
            className="pl-8"
            aria-label="Tìm học viên"
          />
        </div>

        <Button type="button" variant="outline" onClick={onCreateStudent}>
          <UserPlus />
          Tạo học viên mới
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Tìm thấy{" "}
        <span className="text-foreground font-medium">
          {filteredStudents.length}
        </span>{" "}
        học viên
      </p>

      {filteredStudents.length > 0 ? (
        <div className="grid gap-3">
          {filteredStudents.map((student) => {
            const isSelected = selectedStudentId === student.id;

            return (
              <Card
                key={student.id}
                className={isSelected ? "ring-primary/40 ring-2" : undefined}
              >
                <CardContent>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{student.fullName}</p>

                        <StatusBadge tone={statusTones[student.status]}>
                          {statusLabels[student.status]}
                        </StatusBadge>
                      </div>

                      <p className="text-muted-foreground mt-1 text-sm">
                        {student.studentCode} · {student.phone}
                      </p>

                      <p className="text-muted-foreground mt-1 text-xs break-all">
                        {student.email}
                      </p>

                      <p className="text-muted-foreground mt-2 text-xs">
                        Nguồn: {sourceLabels[student.source.category]} ·{" "}
                        {student.source.detail}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant={isSelected ? "secondary" : "outline"}
                      onClick={() => onSelect(student)}
                    >
                      {isSelected ? (
                        <>
                          <Check />
                          Đã chọn
                        </>
                      ) : (
                        "Chọn học viên"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">Không tìm thấy học viên</p>

          <p className="text-muted-foreground mt-1 text-sm">
            Kiểm tra lại thông tin hoặc tạo Student mới.
          </p>

          <Button type="button" className="mt-4" onClick={onCreateStudent}>
            <UserPlus />
            Tạo học viên mới
          </Button>
        </div>
      )}
    </div>
  );
}
