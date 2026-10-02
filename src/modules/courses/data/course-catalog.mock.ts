import type {
  CourseCatalogItem,
  CourseDeliveryMode,
  CourseTrack,
} from "@/modules/courses/model/course.types";
import type { ProgramCode } from "@/modules/students/model/student.types";

/*
 * Danh mục khóa học mock được dựng từ:
 * "Thông tin khóa học (1).xlsx"
 *
 * Tổng cộng: 28 cấu hình khóa / hình thức học.
 *
 * Học phí ở đây là HỌC PHÍ GỐC.
 * Học phí thực tế của từng học viên sẽ nằm ở
 * EnrollmentItem sau khi áp dụng học bổng.
 */

const hsk30Note =
  "Khóa online trực tiếp + Bổ trợ phần mềm tự học. Dự kiến áp dụng khai giảng từ 15/9/2026.";

export const courseCatalogMock: CourseCatalogItem[] = [
  /*
   * ============================================================
   * KÈM NHÓM NHỎ — NET ENGLISH — IELTS
   * ============================================================
   */

  {
    id: "course-small-group-ielts-foundation",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "IELTS Foundation",

    sessions: 32,
    duration: "4 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 9960000,
  },

  {
    id: "course-small-group-ielts-4-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "IELTS 4.5",

    sessions: 24,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 7980000,
  },

  {
    id: "course-small-group-ielts-5-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "IELTS 5.5",

    sessions: 36,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 10980000,
  },

  {
    id: "course-small-group-ielts-6-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "IELTS 6.5",

    sessions: 36,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 11980000,
  },

  {
    id: "course-small-group-ielts-practice-7",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "LUYỆN ĐỀ 7.0 (SPEAKING + WRITING)",

    sessions: 24,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 9980000,
  },

  {
    id: "course-small-group-ielts-full-pathway",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "SMALL_GROUP",
    type: "PATHWAY",

    name: "FULL LỘ TRÌNH",

    sessions: null,
    duration: null,
    minutesPerSession: 90,

    classSize: null,

    baseTuition: 50880000,
  },

  /*
   * ============================================================
   * KÈM NHÓM NHỎ — NET HSK — HSK 3.0
   * ============================================================
   */

  {
    id: "course-small-group-hsk-1-3-0",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "HSK 1 3.0",

    sessions: 20,
    duration: "2,5 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 4380000,

    note: hsk30Note,
  },

  {
    id: "course-small-group-hsk-2-3-0",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "HSK 2 3.0",

    sessions: 20,
    duration: "2,5 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 4380000,

    note: hsk30Note,
  },

  {
    id: "course-small-group-hsk-3-3-0",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "HSK 3 3.0",

    sessions: 26,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 5980000,

    note: hsk30Note,
  },

  {
    id: "course-small-group-hsk-4-3-0",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "HSK 4 3.0",

    sessions: 48,
    duration: "5 - 6 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 12980000,

    note: hsk30Note,
  },

  {
    id: "course-small-group-hsk-5-3-0",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "HSK 5 3.0",

    sessions: 48,
    duration: "5 - 6 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 12980000,

    note: hsk30Note,
  },

  /*
   * ============================================================
   * KÈM NHÓM NHỎ — NET ENGLISH — TOEIC
   * ============================================================
   */

  {
    id: "course-small-group-toeic-lr-foundation",

    program: "NET_ENGLISH",
    track: "TOEIC",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "TOEIC Listening & Reading 450 - 650+ (có xây gốc)",

    sessions: 40,
    duration: "4 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 9980000,
  },

  {
    id: "course-small-group-toeic-lr",

    program: "NET_ENGLISH",
    track: "TOEIC",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "TOEIC Listening & Reading 450 - 650+",

    sessions: 32,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 8980000,
  },

  {
    id: "course-small-group-toeic-sw",

    program: "NET_ENGLISH",
    track: "TOEIC",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "TOEIC Speaking & Writing",

    sessions: 32,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 9980000,
  },

  {
    id: "course-small-group-toeic-module-3",

    program: "NET_ENGLISH",
    track: "TOEIC",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "TOEIC Luyện đề (Module 3)",

    sessions: 12,
    duration: "1 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 14,
    },

    baseTuition: 3326000,
  },

  /*
   * ============================================================
   * KÈM NHÓM NHỎ — NET ENGLISH — GIAO TIẾP
   * ============================================================
   */

  {
    id: "course-small-group-global-english-careers",

    program: "NET_ENGLISH",
    track: "COMMUNICATION",
    deliveryMode: "SMALL_GROUP",
    type: "COURSE",

    name: "GLOBAL ENGLISH FOR INTERNATIONAL CAREERS",

    sessions: 24,
    duration: "3 tháng",
    minutesPerSession: 90,

    classSize: {
      min: 7,
      max: 12,
    },

    baseTuition: 8980000,
  },

  /*
   * ============================================================
   * KÈM 1:1 — NET ENGLISH — IELTS
   * ============================================================
   */

  {
    id: "course-one-to-one-english-foundation",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "ENGLISH FOUNDATION",

    sessions: 16,
    duration: "2 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 12390000,
  },

  {
    id: "course-one-to-one-pre-ielts",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "PRE - IELTS",

    sessions: 16,
    duration: "2 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 12390000,
  },

  {
    id: "course-one-to-one-ielts-4-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "IELTS 4.5",

    sessions: 24,
    duration: "3 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 14790000,
  },

  {
    id: "course-one-to-one-ielts-5-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "IELTS 5.5",

    sessions: 36,
    duration: "3 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 18390000,
  },

  {
    id: "course-one-to-one-ielts-6-5",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "IELTS 6.5",

    sessions: 36,
    duration: "3 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 19390000,
  },

  {
    id: "course-one-to-one-ielts-practice-7",

    program: "NET_ENGLISH",
    track: "IELTS",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "LUYỆN ĐỀ 7,0 (SPEAKING + WRITING)",

    sessions: 24,
    duration: "3 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 18980000,
  },

  /*
   * ============================================================
   * KÈM 1:1 — NET ENGLISH — GIAO TIẾP
   * ============================================================
   */

  {
    id: "course-one-to-one-communication-basic",

    program: "NET_ENGLISH",
    track: "COMMUNICATION",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "CƠ BẢN",

    sessions: 20,
    duration: "2 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 12000000,
  },

  {
    id: "course-one-to-one-communication-advanced",

    program: "NET_ENGLISH",
    track: "COMMUNICATION",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "NÂNG CAO",

    sessions: 20,
    duration: "2 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 12000000,
  },

  /*
   * ============================================================
   * KÈM 1:1 — NET HSK — HSK 3.0
   * ============================================================
   */

  {
    id: "course-one-to-one-hsk-1",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "HSK 1",

    sessions: 18,
    duration: "1,5 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 6980000,
  },

  {
    id: "course-one-to-one-hsk-2",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "HSK 2",

    sessions: 18,
    duration: "1,5 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 6980000,
  },

  {
    id: "course-one-to-one-hsk-3",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "HSK 3",

    sessions: 24,
    duration: "2 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 9600000,
  },

  /*
   * File nguồn ghi:
   * 48 buổi / 1 tháng / 75 phút / 1 học viên.
   *
   * Giữ nguyên theo nguồn, chưa tự sửa.
   */
  {
    id: "course-one-to-one-hsk-4",

    program: "NET_HSK",
    track: "HSK_3_0",
    deliveryMode: "ONE_TO_ONE",
    type: "COURSE",

    name: "HSK 4",

    sessions: 48,
    duration: "1 tháng",
    minutesPerSession: 75,

    classSize: {
      min: 1,
      max: 1,
    },

    baseTuition: 18800000,
  },
];

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

export function getCourseCatalogItem(courseId: string) {
  return courseCatalogMock.find((course) => course.id === courseId);
}

export function getCoursesByProgram(program: ProgramCode) {
  return courseCatalogMock.filter((course) => course.program === program);
}

export function getCoursesByTrack(track: CourseTrack) {
  return courseCatalogMock.filter((course) => course.track === track);
}

export function getCoursesByDeliveryMode(deliveryMode: CourseDeliveryMode) {
  return courseCatalogMock.filter(
    (course) => course.deliveryMode === deliveryMode
  );
}

export function getCoursesByProgramAndDeliveryMode(
  program: ProgramCode,
  deliveryMode: CourseDeliveryMode
) {
  return courseCatalogMock.filter(
    (course) =>
      course.program === program && course.deliveryMode === deliveryMode
  );
}
