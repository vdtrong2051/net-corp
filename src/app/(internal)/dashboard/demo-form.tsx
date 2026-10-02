"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FormSection } from "@/shared/ui/form/form-section";

const demoFormSchema = z.object({
  fullName: z.string().trim().min(2, "Họ và tên phải có ít nhất 2 ký tự."),

  phone: z
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ.")
    .max(15, "Số điện thoại không hợp lệ."),

  email: z.string().trim().email("Email không hợp lệ."),

  note: z
    .string()
    .trim()
    .max(500, "Ghi chú không được vượt quá 500 ký tự.")
    .optional(),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

export function DemoForm() {
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      note: "",
    },
  });

  function onSubmit(data: DemoFormValues) {
    console.log("Demo form:", data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <FormSection
        title="Thông tin học viên"
        description="Thông tin cơ bản dùng để tạo hồ sơ học viên."
      >
        <Controller
          name="fullName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="Nguyễn Văn A"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>

              <Input
                {...field}
                id={field.name}
                placeholder="0901234567"
                aria-invalid={fieldState.invalid}
              />

              <FieldDescription>
                Dùng để tìm và chống trùng học viên.
              </FieldDescription>

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>

              <Input
                {...field}
                id={field.name}
                type="email"
                placeholder="student@example.com"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />

        <Controller
          name="note"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="md:col-span-2">
              <FieldLabel htmlFor={field.name}>Ghi chú</FieldLabel>

              <Textarea
                {...field}
                id={field.name}
                placeholder="Yêu cầu riêng hoặc ghi chú..."
                rows={4}
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
      </FormSection>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Đặt lại
        </Button>

        <Button type="submit">Lưu thử</Button>
      </div>
    </form>
  );
}
