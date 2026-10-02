"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { StudentListItem } from "@/modules/students/model/student.types";
import {
  studentFormSchema,
  type StudentFormValues,
} from "@/modules/students/validation/student.schema";
import { FormSection } from "@/shared/ui/form/form-section";

type StudentFormDialogMode = "create" | "edit";

type StudentFormDialogProps = {
  open: boolean;

  mode: StudentFormDialogMode;

  student?: StudentListItem | null;

  onOpenChange: (open: boolean) => void;

  onSubmit: (values: StudentFormValues) => void;
};

function getDefaultValues(student?: StudentListItem | null): StudentFormValues {
  if (!student) {
    return {
      fullName: "",
      dateOfBirth: "",

      citizenId: "",
      citizenIdIssuedDate: "",

      phone: "",
      email: "",

      currentAddress: "",
      school: "",

      sourceCategory: "MARKETING",
      sourceDetail: "",

      status: "ACTIVE",
    };
  }

  return {
    fullName: student.fullName,
    dateOfBirth: student.dateOfBirth,

    citizenId: student.citizenId,
    citizenIdIssuedDate: student.citizenIdIssuedDate,

    phone: student.phone,
    email: student.email,

    currentAddress: student.currentAddress,
    school: student.school ?? "",

    sourceCategory: student.source.category,
    sourceDetail: student.source.detail,

    status: student.status,
  };
}

type StudentFormProps = {
  formId: string;

  defaultValues: StudentFormValues;

  onSubmit: (values: StudentFormValues) => void;
};

function StudentForm({ formId, defaultValues, onSubmit }: StudentFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <FormSection
        title="Thông tin cơ bản"
        description="Thông tin định danh chính của học viên."
      >
        <Field data-invalid={Boolean(errors.fullName)}>
          <FieldLabel htmlFor="fullName">Họ và tên *</FieldLabel>

          <Input
            id="fullName"
            placeholder="Nguyễn Văn A"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />

          <FieldError errors={[errors.fullName]} />
        </Field>

        <Field data-invalid={Boolean(errors.dateOfBirth)}>
          <FieldLabel htmlFor="dateOfBirth">Ngày sinh *</FieldLabel>

          <Input
            id="dateOfBirth"
            type="date"
            aria-invalid={Boolean(errors.dateOfBirth)}
            {...register("dateOfBirth")}
          />

          <FieldError errors={[errors.dateOfBirth]} />
        </Field>
      </FormSection>

      <FormSection title="Định danh" description="Thông tin CCCD của học viên.">
        <Field data-invalid={Boolean(errors.citizenId)}>
          <FieldLabel htmlFor="citizenId">Số CCCD *</FieldLabel>

          <Input
            id="citizenId"
            inputMode="numeric"
            placeholder="079205001234"
            aria-invalid={Boolean(errors.citizenId)}
            {...register("citizenId")}
          />

          <FieldError errors={[errors.citizenId]} />
        </Field>

        <Field data-invalid={Boolean(errors.citizenIdIssuedDate)}>
          <FieldLabel htmlFor="citizenIdIssuedDate">Ngày cấp CCCD *</FieldLabel>

          <Input
            id="citizenIdIssuedDate"
            type="date"
            aria-invalid={Boolean(errors.citizenIdIssuedDate)}
            {...register("citizenIdIssuedDate")}
          />

          <FieldError errors={[errors.citizenIdIssuedDate]} />
        </Field>
      </FormSection>

      <FormSection
        title="Liên hệ"
        description="Thông tin liên hệ chính thức của học viên."
      >
        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="phone">Số điện thoại *</FieldLabel>

          <Input
            id="phone"
            type="tel"
            placeholder="0901234567"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />

          <FieldError errors={[errors.phone]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">Email *</FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="hocvien@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />

          <FieldError errors={[errors.email]} />
        </Field>

        <Field
          className="md:col-span-2"
          data-invalid={Boolean(errors.currentAddress)}
        >
          <FieldLabel htmlFor="currentAddress">
            Nơi ở hiện nay / nơi nhận hợp đồng *
          </FieldLabel>

          <Textarea
            id="currentAddress"
            placeholder="Nhập địa chỉ hiện tại..."
            className="min-h-20"
            aria-invalid={Boolean(errors.currentAddress)}
            {...register("currentAddress")}
          />

          <FieldError errors={[errors.currentAddress]} />
        </Field>
      </FormSection>

      <FormSection
        title="Học tập"
        description="Thông tin học tập hiện tại của học viên."
      >
        <Field className="md:col-span-2" data-invalid={Boolean(errors.school)}>
          <FieldLabel htmlFor="school">Trường học</FieldLabel>

          <Input
            id="school"
            placeholder="Tên trường / đơn vị học tập"
            aria-invalid={Boolean(errors.school)}
            {...register("school")}
          />

          <FieldError errors={[errors.school]} />
        </Field>
      </FormSection>

      <FormSection
        title="Nguồn học viên"
        description="Nguồn data ban đầu của học viên."
      >
        <Controller
          control={control}
          name="sourceCategory"
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel>Nhóm nguồn *</FieldLabel>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? "MARKETING")}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(fieldState.error)}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="MARKETING">Marketing</SelectItem>

                  <SelectItem value="EXTERNAL_RELATIONS">Đối ngoại</SelectItem>

                  <SelectItem value="SELF_SOURCED">Tự kiếm</SelectItem>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Field data-invalid={Boolean(errors.sourceDetail)}>
          <FieldLabel htmlFor="sourceDetail">Chi tiết nguồn *</FieldLabel>

          <Input
            id="sourceDetail"
            placeholder="VD: Bài test Facebook, bạn bè giới thiệu..."
            aria-invalid={Boolean(errors.sourceDetail)}
            {...register("sourceDetail")}
          />

          <FieldError errors={[errors.sourceDetail]} />
        </Field>
      </FormSection>

      <FormSection
        title="Trạng thái hồ sơ"
        description="Trạng thái hiện tại của Student master."
      >
        <Controller
          control={control}
          name="status"
          render={({ field, fieldState }) => (
            <Field data-invalid={Boolean(fieldState.error)}>
              <FieldLabel>Trạng thái *</FieldLabel>

              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? "ACTIVE")}
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={Boolean(fieldState.error)}
                >
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>

                  <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>

              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </FormSection>
    </form>
  );
}

export function StudentFormDialog({
  open,
  mode,
  student,
  onOpenChange,
  onSubmit,
}: StudentFormDialogProps) {
  const formId =
    mode === "create" ? "create-student-form" : "edit-student-form";

  const isCreate = mode === "create";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Thêm học viên" : "Sửa hồ sơ học viên"}
          </DialogTitle>

          <DialogDescription>
            {isCreate
              ? "Tạo Student master mới. Khóa học và ghi danh sẽ được tạo riêng."
              : `Cập nhật thông tin hồ sơ ${student?.studentCode ?? ""}.`}
          </DialogDescription>
        </DialogHeader>

        <StudentForm
          key={`${mode}-${student?.id ?? "new"}-${open ? "open" : "closed"}`}
          formId={formId}
          defaultValues={getDefaultValues(student)}
          onSubmit={onSubmit}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>

          <Button type="submit" form={formId}>
            {isCreate ? "Tạo học viên" : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
