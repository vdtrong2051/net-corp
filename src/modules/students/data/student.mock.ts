import type {
  StudentEnrollmentHistoryItem,
  StudentListItem,
  StudentProfile360,
} from "@/modules/students/model/student.types";

export const studentProfilesMock: StudentProfile360[] = [
  {
    student: {
      id: "student-001",
      studentCode: "HV-2026-0001",

      fullName: "Nguyễn Minh Anh",
      dateOfBirth: "2005-08-16",

      citizenId: "079205001234",
      citizenIdIssuedDate: "2023-06-12",

      phone: "0901234567",
      email: "minhanh@example.com",

      currentAddress: "25 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",

      school: "Đại học Tôn Đức Thắng",

      source: {
        category: "MARKETING",
        detail: "Bài test trên Facebook",
      },

      status: "ACTIVE",

      createdAt: "2026-09-10T09:15:00+07:00",
      updatedAt: "2026-10-03T08:30:00+07:00",
    },

    enrollments: [
      {
        id: "enrollment-001",
        enrollmentCode: "ENR-2026-0108",

        programs: [
          {
            program: "NET_HSK",

            inputAssessmentUrl: "https://example.com/tests/minh-anh-hsk",

            outputGoal: "Hoàn thành HSK 4 và đủ nền tảng tiếp tục HSK 5.",
          },
        ],

        salesName: "Nguyễn Minh Nhân Viên",

        specialRequirements: "Ưu tiên lịch học sau 18:00 các ngày trong tuần.",

        status: "RETURNED",

        createdAt: "2026-10-02T08:45:00+07:00",
      },
    ],

    courses: [
      {
        id: "course-history-001",

        enrollmentId: "enrollment-001",

        courseCatalogId: "course-small-group-hsk-3-3-0",

        program: "NET_HSK",

        courseName: "HSK 3 3.0",

        classCode: "HSK3-A01",

        tuitionAfterScholarship: 1794000,

        scholarshipNote: "HB 70%",

        paidAmount: 1794000,

        status: "ACTIVE",
      },

      {
        id: "course-history-002",

        enrollmentId: "enrollment-001",

        courseCatalogId: "course-small-group-hsk-4-3-0",

        program: "NET_HSK",

        courseName: "HSK 4 3.0",

        expectedStart: "12/2026",

        tuitionAfterScholarship: 3894000,

        scholarshipNote: "HB 70%",

        paidAmount: 500000,

        status: "WAITING_CLASS",
      },
    ],

    payments: [
      {
        id: "payment-001",

        enrollmentId: "enrollment-001",

        installmentLabel: "Thanh toán HSK 3 3.0",

        amount: 1794000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-10-02T10:20:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-001",
      },

      {
        id: "payment-002",

        enrollmentId: "enrollment-001",

        installmentLabel: "Cọc HSK 4 3.0",

        amount: 500000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-10-02T10:25:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-002",
      },
    ],

    contracts: [
      {
        id: "contract-001",

        enrollmentId: "enrollment-001",

        contractCode: "HD-2026-0108",

        status: "PENDING_SIGNATURE",

        documentUrl: "https://docs.google.com/document/d/example-minh-anh",

        createdAt: "2026-10-02T11:00:00+07:00",
      },
    ],

    auditHistory: [
      {
        id: "audit-001",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_STUDENT",

        description: "Tạo hồ sơ học viên.",

        occurredAt: "2026-09-10T09:15:00+07:00",
      },

      {
        id: "audit-002",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_ENROLLMENT",

        description: "Tạo hồ sơ ghi danh ENR-2026-0108.",

        occurredAt: "2026-10-02T08:45:00+07:00",
      },

      {
        id: "audit-003",

        actorName: "Trần Anh Quản Lý",
        actorRole: "MANAGER",

        action: "RETURN_ENROLLMENT",

        description: "Trả lại hồ sơ do thiếu thông tin kế hoạch thanh toán.",

        occurredAt: "2026-10-03T07:30:00+07:00",
      },
    ],
  },

  {
    student: {
      id: "student-002",
      studentCode: "HV-2026-0002",

      fullName: "Lê Hoàng Nam",
      dateOfBirth: "2004-03-22",

      citizenId: "079204009876",
      citizenIdIssuedDate: "2022-11-04",

      phone: "0912345678",
      email: "hoangnam@example.com",

      currentAddress: "102 Lê Văn Việt, TP. Thủ Đức, TP. Hồ Chí Minh",

      school: "Đại học Công nghệ TP.HCM",

      source: {
        category: "SELF_SOURCED",
        detail: "Bạn bè giới thiệu",
      },

      status: "ACTIVE",

      createdAt: "2026-08-21T14:20:00+07:00",
      updatedAt: "2026-10-02T17:00:00+07:00",
    },

    enrollments: [
      {
        id: "enrollment-002",
        enrollmentCode: "ENR-2026-0102",

        programs: [
          {
            program: "NET_ENGLISH",

            inputAssessmentUrl: "https://example.com/tests/hoang-nam-english",

            outputGoal: "IELTS 6.5",
          },
        ],

        salesName: "Nguyễn Minh Nhân Viên",

        specialRequirements: "Không học được tối thứ Ba và thứ Năm.",

        status: "RETURNED",

        createdAt: "2026-10-01T13:10:00+07:00",
      },
    ],

    courses: [
      {
        id: "course-history-003",

        enrollmentId: "enrollment-002",

        courseCatalogId: "course-small-group-ielts-foundation",

        program: "NET_ENGLISH",

        courseName: "IELTS Foundation",

        classCode: "FOUND.13",

        tuitionAfterScholarship: 2988000,

        scholarshipNote: "HB 70%",

        paidAmount: 2988000,

        status: "ACTIVE",
      },

      {
        id: "course-history-004",

        enrollmentId: "enrollment-002",

        courseCatalogId: "course-small-group-ielts-4-5",

        program: "NET_ENGLISH",

        courseName: "IELTS 4.5",

        expectedStart: "04/2027",

        tuitionAfterScholarship: 2394000,

        scholarshipNote: "HB 70%",

        paidAmount: 500000,

        status: "WAITING_CLASS",
      },

      {
        id: "course-history-005",

        enrollmentId: "enrollment-002",

        courseCatalogId: "course-small-group-ielts-5-5",

        program: "NET_ENGLISH",

        courseName: "IELTS 5.5",

        expectedStart: "08/2027",

        tuitionAfterScholarship: 3294000,

        scholarshipNote: "HB 70%",

        paidAmount: 500000,

        status: "WAITING_CLASS",
      },
    ],

    payments: [
      {
        id: "payment-003",

        enrollmentId: "enrollment-002",

        installmentLabel: "Thanh toán IELTS Foundation",

        amount: 2988000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-10-01T15:00:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-003",
      },

      {
        id: "payment-004",

        enrollmentId: "enrollment-002",

        installmentLabel: "Cọc IELTS 4.5",

        amount: 500000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-10-01T15:05:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-004",
      },

      {
        id: "payment-005",

        enrollmentId: "enrollment-002",

        installmentLabel: "Cọc IELTS 5.5",

        amount: 500000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-10-01T15:08:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-005",
      },
    ],

    contracts: [
      {
        id: "contract-002",

        enrollmentId: "enrollment-002",

        contractCode: "HD-2026-0102",

        status: "SIGNED",

        documentUrl: "https://docs.google.com/document/d/example-hoang-nam",

        createdAt: "2026-10-01T16:00:00+07:00",

        signedAt: "2026-10-02T10:00:00+07:00",
      },
    ],

    auditHistory: [
      {
        id: "audit-004",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_STUDENT",

        description: "Tạo hồ sơ học viên.",

        occurredAt: "2026-08-21T14:20:00+07:00",
      },

      {
        id: "audit-005",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_ENROLLMENT",

        description: "Tạo hồ sơ ghi danh ENR-2026-0102.",

        occurredAt: "2026-10-01T13:10:00+07:00",
      },

      {
        id: "audit-006",

        actorName: "Trần Anh Quản Lý",
        actorRole: "MANAGER",

        action: "RETURN_ENROLLMENT",

        description: "Trả lại hồ sơ để bổ sung thông tin CCCD.",

        occurredAt: "2026-10-02T17:00:00+07:00",
      },
    ],
  },

  {
    student: {
      id: "student-003",
      studentCode: "HV-2026-0003",

      fullName: "Phạm Ngọc Linh",
      dateOfBirth: "2006-01-09",

      citizenId: "079206004321",
      citizenIdIssuedDate: "2024-02-15",

      phone: "0934567890",
      email: "ngoclinh@example.com",

      currentAddress: "77 Phan Văn Trị, Gò Vấp, TP. Hồ Chí Minh",

      school: "THPT Nguyễn Công Trứ",

      source: {
        category: "EXTERNAL_RELATIONS",
        detail: "Cuộc thi tiếng Trung sinh viên 2026",
      },

      status: "ACTIVE",

      createdAt: "2026-07-12T09:00:00+07:00",
      updatedAt: "2026-10-01T11:30:00+07:00",
    },

    enrollments: [
      {
        id: "enrollment-003",
        enrollmentCode: "ENR-2026-0097",

        programs: [
          {
            program: "NET_HSK",

            inputAssessmentUrl: "https://example.com/tests/ngoc-linh-hsk",

            outputGoal: "Đạt HSK 4.",
          },
        ],

        salesName: "Phạm Minh Tuấn",

        status: "APPROVED",

        createdAt: "2026-09-28T10:00:00+07:00",

        approvedAt: "2026-09-29T09:15:00+07:00",
      },
    ],

    courses: [
      {
        id: "course-history-006",

        enrollmentId: "enrollment-003",

        courseCatalogId: "course-small-group-hsk-3-3-0",

        program: "NET_HSK",

        courseName: "HSK 3 3.0",

        classCode: "HSK3-B02",

        tuitionAfterScholarship: 2392000,

        scholarshipNote: "HB 60%",

        paidAmount: 2392000,

        status: "ACTIVE",
      },
    ],

    payments: [
      {
        id: "payment-006",

        enrollmentId: "enrollment-003",

        installmentLabel: "Thanh toán toàn bộ HSK 3 3.0",

        amount: 2392000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-09-28T11:30:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-006",
      },
    ],

    contracts: [
      {
        id: "contract-003",

        enrollmentId: "enrollment-003",

        contractCode: "HD-2026-0097",

        status: "SIGNED",

        documentUrl: "https://docs.google.com/document/d/example-ngoc-linh",

        createdAt: "2026-09-28T15:00:00+07:00",

        signedAt: "2026-09-29T10:30:00+07:00",
      },
    ],

    auditHistory: [
      {
        id: "audit-007",

        actorName: "Phạm Minh Tuấn",
        actorRole: "STAFF",

        action: "CREATE_STUDENT",

        description: "Tạo hồ sơ học viên.",

        occurredAt: "2026-07-12T09:00:00+07:00",
      },

      {
        id: "audit-008",

        actorName: "Trần Anh Quản Lý",
        actorRole: "MANAGER",

        action: "APPROVE_ENROLLMENT",

        description: "Duyệt hồ sơ ENR-2026-0097.",

        occurredAt: "2026-09-29T09:15:00+07:00",
      },
    ],
  },

  /*
   * Case test quan trọng:
   *
   * Một Enrollment chứa đồng thời:
   * - NET English
   * - NET HSK
   */
  {
    student: {
      id: "student-004",
      studentCode: "HV-2026-0004",

      fullName: "Võ Thu Hà",
      dateOfBirth: "2003-11-27",

      citizenId: "079203008765",
      citizenIdIssuedDate: "2021-09-08",

      phone: "0976543210",
      email: "thuha@example.com",

      currentAddress: "18 Trường Chinh, Tân Bình, TP. Hồ Chí Minh",

      school: "Đại học Kinh tế TP.HCM",

      source: {
        category: "MARKETING",
        detail: "Quảng cáo tuyển sinh tháng 9",
      },

      status: "ACTIVE",

      createdAt: "2026-09-18T13:40:00+07:00",
      updatedAt: "2026-10-03T09:10:00+07:00",
    },

    enrollments: [
      {
        id: "enrollment-004",
        enrollmentCode: "ENR-2026-0110",

        programs: [
          {
            program: "NET_ENGLISH",

            inputAssessmentUrl: "https://example.com/tests/thu-ha-english",

            outputGoal: "IELTS 7.0",
          },

          {
            program: "NET_HSK",

            inputAssessmentUrl: "https://example.com/tests/thu-ha-hsk",

            outputGoal: "Đạt HSK 3.",
          },
        ],

        salesName: "Nguyễn Minh Nhân Viên",

        specialRequirements: "Ưu tiên học buổi tối, không học tối thứ Sáu.",

        status: "SUBMITTED",

        createdAt: "2026-10-03T08:20:00+07:00",
      },
    ],

    courses: [
      {
        id: "course-history-007",

        enrollmentId: "enrollment-004",

        courseCatalogId: "course-small-group-ielts-foundation",

        program: "NET_ENGLISH",

        courseName: "IELTS Foundation",

        expectedStart: "10/2026",

        tuitionAfterScholarship: 2988000,

        scholarshipNote: "HB 70%",

        paidAmount: 500000,

        status: "WAITING_CLASS",
      },

      {
        id: "course-history-008",

        enrollmentId: "enrollment-004",

        courseCatalogId: "course-small-group-hsk-1-3-0",

        program: "NET_HSK",

        courseName: "HSK 1 3.0",

        expectedStart: "11/2026",

        tuitionAfterScholarship: 1314000,

        scholarshipNote: "HB 70%",

        paidAmount: 500000,

        status: "WAITING_CLASS",
      },
    ],

    payments: [
      {
        id: "payment-007",

        enrollmentId: "enrollment-004",

        installmentLabel: "Cọc IELTS Foundation",

        amount: 500000,

        method: "BANK_TRANSFER",

        status: "RETURNED",

        paidAt: "2026-10-03T08:30:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-007",
      },

      {
        id: "payment-008",

        enrollmentId: "enrollment-004",

        installmentLabel: "Cọc HSK 1 3.0",

        amount: 500000,

        method: "BANK_TRANSFER",

        status: "PENDING",

        paidAt: "2026-10-03T08:35:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-008",
      },
    ],

    contracts: [
      {
        id: "contract-004",

        enrollmentId: "enrollment-004",

        contractCode: "HD-2026-0110",

        status: "DRAFT",

        documentUrl: "https://docs.google.com/document/d/example-thu-ha",

        createdAt: "2026-10-03T08:45:00+07:00",
      },
    ],

    auditHistory: [
      {
        id: "audit-009",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_STUDENT",

        description: "Tạo hồ sơ học viên.",

        occurredAt: "2026-09-18T13:40:00+07:00",
      },

      {
        id: "audit-010",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "CREATE_MIXED_ENROLLMENT",

        description: "Tạo ghi danh gồm NET English và NET HSK.",

        occurredAt: "2026-10-03T08:20:00+07:00",
      },

      {
        id: "audit-011",

        actorName: "Nguyễn Minh Nhân Viên",
        actorRole: "STAFF",

        action: "SUBMIT_ENROLLMENT",

        description: "Gửi hồ sơ ENR-2026-0110 để quản lý kiểm tra.",

        occurredAt: "2026-10-03T09:10:00+07:00",
      },
    ],
  },

  {
    student: {
      id: "student-005",
      studentCode: "HV-2026-0005",

      fullName: "Trần Quốc Bảo",
      dateOfBirth: "2002-05-14",

      citizenId: "079202006543",
      citizenIdIssuedDate: "2020-12-01",

      phone: "0987654321",
      email: "quocbao@example.com",

      currentAddress: "46 Nguyễn Oanh, Gò Vấp, TP. Hồ Chí Minh",

      school: "Đại học Công nghiệp TP.HCM",

      source: {
        category: "SELF_SOURCED",
        detail: "Group Zalo sinh viên",
      },

      status: "INACTIVE",

      createdAt: "2026-05-08T16:00:00+07:00",
      updatedAt: "2026-08-30T09:30:00+07:00",
    },

    enrollments: [
      {
        id: "enrollment-005",
        enrollmentCode: "ENR-2026-0061",

        programs: [
          {
            program: "NET_ENGLISH",

            inputAssessmentUrl: "https://example.com/tests/quoc-bao-english",

            outputGoal: "Hoàn thành English Foundation.",
          },
        ],

        salesName: "Phạm Minh Tuấn",

        status: "COMPLETED",

        createdAt: "2026-05-10T10:00:00+07:00",

        approvedAt: "2026-05-11T08:30:00+07:00",
      },
    ],

    courses: [
      {
        id: "course-history-009",

        enrollmentId: "enrollment-005",

        courseCatalogId: "course-one-to-one-english-foundation",

        program: "NET_ENGLISH",

        courseName: "ENGLISH FOUNDATION",

        classCode: "1TO1-EF-09",

        tuitionAfterScholarship: 4956000,

        scholarshipNote: "HB 60%",

        paidAmount: 4956000,

        status: "COMPLETED",
      },
    ],

    payments: [
      {
        id: "payment-009",

        enrollmentId: "enrollment-005",

        installmentLabel: "Thanh toán toàn bộ English Foundation",

        amount: 4956000,

        method: "BANK_TRANSFER",

        status: "CONFIRMED",

        paidAt: "2026-05-10T11:00:00+07:00",

        proofUrl: "https://example.com/payment-proofs/PAY-009",
      },
    ],

    contracts: [
      {
        id: "contract-005",

        enrollmentId: "enrollment-005",

        contractCode: "HD-2026-0061",

        status: "SIGNED",

        documentUrl: "https://docs.google.com/document/d/example-quoc-bao",

        createdAt: "2026-05-10T14:00:00+07:00",

        signedAt: "2026-05-11T09:15:00+07:00",
      },
    ],

    auditHistory: [
      {
        id: "audit-012",

        actorName: "Phạm Minh Tuấn",
        actorRole: "STAFF",

        action: "CREATE_STUDENT",

        description: "Tạo hồ sơ học viên.",

        occurredAt: "2026-05-08T16:00:00+07:00",
      },

      {
        id: "audit-013",

        actorName: "Trần Anh Quản Lý",
        actorRole: "MANAGER",

        action: "COMPLETE_ENROLLMENT",

        description: "Hoàn tất hồ sơ ENR-2026-0061.",

        occurredAt: "2026-08-30T09:30:00+07:00",
      },
    ],
  },
];

function getLatestEnrollment(enrollments: StudentEnrollmentHistoryItem[]) {
  return [...enrollments].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )[0];
}

export const studentListMock: StudentListItem[] = studentProfilesMock.map(
  (profile) => {
    const latestEnrollment = getLatestEnrollment(profile.enrollments);

    const latestPrograms = latestEnrollment
      ? Array.from(
          new Set(
            latestEnrollment.programs.map((programInfo) => programInfo.program)
          )
        )
      : [];

    return {
      ...profile.student,

      latestPrograms,

      latestEnrollmentStatus: latestEnrollment?.status,

      latestEnrollmentAt: latestEnrollment?.createdAt,

      assignedSalesName: latestEnrollment?.salesName,
    };
  }
);

export function getStudentProfileMock(studentId: string) {
  return studentProfilesMock.find(
    (profile) => profile.student.id === studentId
  );
}

export function getStudentMock(studentId: string) {
  return getStudentProfileMock(studentId)?.student;
}
