"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { StudentListItem } from "@/modules/students/model/student.types";
import { StudentFormDialog } from "@/modules/students/ui/student-form-dialog";
import { StudentList } from "@/modules/students/ui/student-list";
import type { StudentFormValues } from "@/modules/students/validation/student.schema";
import { PageContainer } from "@/shared/ui/layout/page-container";

type DialogMode = "create" | "edit";

type StudentManagementProps = {
  initialData: StudentListItem[];
};

function normalizePhone(value: string) {
  const compact = value.replace(/[\s.-]/g, "");

  if (compact.startsWith("+84")) {
    return `0${compact.slice(3)}`;
  }

  return compact;
}

function findDuplicateStudent(
  students: StudentListItem[],
  values: StudentFormValues,
  excludeStudentId?: string
) {
  const email = values.email.trim().toLowerCase();

  const phone = normalizePhone(values.phone);

  const citizenId = values.citizenId.trim();

  for (const student of students) {
    if (student.id === excludeStudentId) {
      continue;
    }

    if (student.citizenId.trim() === citizenId) {
      return "CCCD";
    }

    if (normalizePhone(student.phone) === phone) {
      return "số điện thoại";
    }

    if (student.email.trim().toLowerCase() === email) {
      return "email";
    }
  }

  return null;
}

function generateStudentCode(students: StudentListItem[]) {
  const year = new Date().getFullYear();

  const prefix = `HV-${year}-`;

  const maxNumber = students.reduce((max, student) => {
    if (!student.studentCode.startsWith(prefix)) {
      return max;
    }

    const value = Number.parseInt(student.studentCode.slice(prefix.length), 10);

    if (Number.isNaN(value)) {
      return max;
    }

    return Math.max(max, value);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;
}

function mapFormValuesToStudentMaster(values: StudentFormValues) {
  return {
    fullName: values.fullName.trim(),

    dateOfBirth: values.dateOfBirth,

    citizenId: values.citizenId.trim(),

    citizenIdIssuedDate: values.citizenIdIssuedDate,

    phone: values.phone.trim(),

    email: values.email.trim().toLowerCase(),

    currentAddress: values.currentAddress.trim(),

    school: values.school?.trim() || undefined,

    source: {
      category: values.sourceCategory,

      detail: values.sourceDetail.trim(),
    },

    status: values.status,
  };
}

export function StudentManagement({ initialData }: StudentManagementProps) {
  const [students, setStudents] = useState<StudentListItem[]>(
    () => initialData
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState<DialogMode>("create");

  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(
    null
  );

  function openCreateDialog() {
    setDialogMode("create");
    setEditingStudent(null);
    setDialogOpen(true);
  }

  function openEditDialog(student: StudentListItem) {
    setDialogMode("edit");
    setEditingStudent(student);
    setDialogOpen(true);
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);

    if (!open) {
      setEditingStudent(null);
    }
  }

  function createStudent(values: StudentFormValues) {
    const duplicateField = findDuplicateStudent(students, values);

    if (duplicateField) {
      toast.error("Không thể tạo học viên", {
        description: `Đã tồn tại học viên có ${duplicateField} này.`,
      });

      return;
    }

    const now = new Date().toISOString();

    const studentCode = generateStudentCode(students);

    const newStudent: StudentListItem = {
      id: `student-${crypto.randomUUID()}`,

      studentCode,

      ...mapFormValuesToStudentMaster(values),

      createdAt: now,
      updatedAt: now,

      /*
       * Student mới chưa có Enrollment.
       */
      latestPrograms: [],

      latestEnrollmentStatus: undefined,

      latestEnrollmentAt: undefined,

      assignedSalesName: undefined,
    };

    setStudents((current) => [newStudent, ...current]);

    setDialogOpen(false);

    toast.success("Đã tạo học viên", {
      description: `${studentCode} · ${newStudent.fullName}`,
    });
  }

  function updateStudent(values: StudentFormValues) {
    if (!editingStudent) {
      return;
    }

    const duplicateField = findDuplicateStudent(
      students,
      values,
      editingStudent.id
    );

    if (duplicateField) {
      toast.error("Không thể lưu thay đổi", {
        description: `Đã tồn tại học viên khác có ${duplicateField} này.`,
      });

      return;
    }

    const updatedAt = new Date().toISOString();

    setStudents((current) =>
      current.map((student) => {
        if (student.id !== editingStudent.id) {
          return student;
        }

        return {
          ...student,

          ...mapFormValuesToStudentMaster(values),

          updatedAt,
        };
      })
    );

    setDialogOpen(false);

    toast.success("Đã cập nhật học viên", {
      description: `${editingStudent.studentCode} · ${values.fullName.trim()}`,
    });

    setEditingStudent(null);
  }

  function handleSubmit(values: StudentFormValues) {
    if (dialogMode === "create") {
      createStudent(values);
      return;
    }

    updateStudent(values);
  }

  return (
    <>
      <PageContainer
        title="Học viên"
        description="Quản lý hồ sơ gốc và lịch sử học tập của học viên tại NET CORP."
        actions={
          <Button type="button" onClick={openCreateDialog}>
            <Plus />
            Thêm học viên
          </Button>
        }
      >
        <StudentList data={students} onEdit={openEditDialog} />
      </PageContainer>

      <StudentFormDialog
        open={dialogOpen}
        mode={dialogMode}
        student={editingStudent}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}
