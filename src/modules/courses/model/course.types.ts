import type { ProgramCode } from "@/modules/students/model/student.types";

export type CourseDeliveryMode = "SMALL_GROUP" | "ONE_TO_ONE";

export type CourseTrack = "IELTS" | "HSK_3_0" | "TOEIC" | "COMMUNICATION";

export type CourseCatalogType = "COURSE" | "PATHWAY";

export type CourseClassSize = {
  min: number;
  max: number;
};

export type CourseCatalogItem = {
  id: string;

  /*
   * Chương trình cấp cao của NET CORP.
   *
   * NET_ENGLISH:
   * - IELTS
   * - TOEIC
   * - Giao tiếp
   *
   * NET_HSK:
   * - HSK 3.0
   */
  program: ProgramCode;

  /*
   * Nhánh chuyên môn bên trong chương trình.
   */
  track: CourseTrack;

  /*
   * Nhóm nhỏ 7–12/14 hoặc học kèm 1:1.
   */
  deliveryMode: CourseDeliveryMode;

  /*
   * COURSE:
   * - IELTS Foundation
   * - HSK 1 3.0
   * - TOEIC...
   *
   * PATHWAY:
   * - FULL LỘ TRÌNH
   */
  type: CourseCatalogType;

  /*
   * Tên khóa theo bảng giá hiện hành.
   */
  name: string;

  /*
   * Một số dòng như FULL LỘ TRÌNH không có
   * số buổi cụ thể trong file nguồn.
   */
  sessions: number | null;

  /*
   * Giữ dạng text vì nguồn có:
   * - 4 tháng
   * - 2,5 tháng
   * - 5 - 6 tháng
   * ...
   */
  duration: string | null;

  minutesPerSession: number;

  /*
   * FULL LỘ TRÌNH không có sĩ số riêng
   * trong bảng nguồn nên có thể null.
   */
  classSize: CourseClassSize | null;

  /*
   * Đây là HỌC PHÍ GỐC.
   *
   * Học phí thực tế của EnrollmentItem
   * có thể thay đổi theo học bổng.
   */
  baseTuition: number;

  /*
   * Chỉ dùng cho ghi chú có thật trong
   * tài liệu nguồn.
   */
  note?: string;
};

export const courseProgramLabels: Record<ProgramCode, string> = {
  NET_ENGLISH: "NET English",
  NET_HSK: "NET HSK",
};

export const courseTrackLabels: Record<CourseTrack, string> = {
  IELTS: "IELTS",
  HSK_3_0: "HSK 3.0",
  TOEIC: "TOEIC",
  COMMUNICATION: "Giao tiếp",
};

export const courseDeliveryModeLabels: Record<CourseDeliveryMode, string> = {
  SMALL_GROUP: "Kèm nhóm nhỏ",
  ONE_TO_ONE: "Kèm 1:1",
};
