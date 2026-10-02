import { z } from "zod";

export const studentFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự.")
    .max(120, "Họ và tên quá dài."),

  dateOfBirth: z.string().min(1, "Vui lòng chọn ngày sinh."),

  citizenId: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "CCCD phải gồm đúng 12 chữ số."),

  citizenIdIssuedDate: z.string().min(1, "Vui lòng chọn ngày cấp CCCD."),

  phone: z
    .string()
    .trim()
    .regex(/^(?:\+84|0)\d{9}$/, "Số điện thoại không hợp lệ."),

  email: z.string().trim().email("Email không hợp lệ."),

  currentAddress: z
    .string()
    .trim()
    .min(5, "Vui lòng nhập địa chỉ hiện tại.")
    .max(300, "Địa chỉ quá dài."),

  school: z.string().trim().max(150, "Tên trường quá dài.").optional(),

  sourceCategory: z.enum(["MARKETING", "EXTERNAL_RELATIONS", "SELF_SOURCED"]),

  sourceDetail: z
    .string()
    .trim()
    .min(2, "Vui lòng mô tả nguồn học viên.")
    .max(200, "Thông tin nguồn quá dài."),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
