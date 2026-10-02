import type { AppRole } from "@/shared/types/role";

import type {
  DashboardData,
  DashboardQueue,
} from "@/modules/dashboard/model/dashboard.types";

/*
 * Dữ liệu demo phục vụ GĐ4.
 *
 * Không phải dữ liệu thật.
 * Sau khi backend được xây dựng, tầng data này sẽ được
 * thay bằng dữ liệu từ service/repository.
 */

const staffReturnedQueue: DashboardQueue = {
  id: "staff-returned-enrollments",
  title: "Hồ sơ bị trả lại",
  description:
    "Các hồ sơ cần sửa trước khi gửi quản lý kiểm tra lại.",
  emptyMessage: "Không có hồ sơ nào bị trả lại.",
  items: [
    {
      id: "ENR-2026-0108",
      title: "Nguyễn Minh Anh",
      subtitle: "NET HSK · HSK 4",
      status: "Bị trả lại",
      statusTone: "danger",
      details: [
        {
          label: "Lý do",
          value: "Thiếu thông tin kế hoạch thanh toán",
        },
        {
          label: "Người trả",
          value: "Trần Anh Quản Lý",
        },
      ],
      waitingTime: "1 giờ",
      href: "/enrollments",
    },
    {
      id: "ENR-2026-0102",
      title: "Lê Hoàng Nam",
      subtitle: "NET English · IELTS Foundation",
      status: "Bị trả lại",
      statusTone: "danger",
      details: [
        {
          label: "Lý do",
          value: "Cần bổ sung thông tin CCCD",
        },
        {
          label: "Người trả",
          value: "Trần Anh Quản Lý",
        },
      ],
      waitingTime: "5 giờ",
      href: "/enrollments",
    },
    {
      id: "ENR-2026-0097",
      title: "Phạm Ngọc Linh",
      subtitle: "NET HSK · HSK 3",
      status: "Bị trả lại",
      statusTone: "danger",
      details: [
        {
          label: "Lý do",
          value: "Sai thông tin khóa học đăng ký",
        },
      ],
      waitingTime: "1 ngày",
      href: "/enrollments",
    },
  ],
};

const staffPaymentQueue: DashboardQueue = {
  id: "staff-payment-fixes",
  title: "Thanh toán cần bổ sung",
  description:
    "Các giao dịch hoặc minh chứng cần được nhân viên cập nhật.",
  emptyMessage: "Không có thanh toán nào cần bổ sung.",
  items: [
    {
      id: "PAY-2026-0214",
      title: "Trần Quốc Bảo",
      subtitle: "Đợt 1 · 500.000 ₫",
      status: "Thiếu minh chứng",
      statusTone: "warning",
      details: [
        {
          label: "Vấn đề",
          value: "Chưa tải ảnh chuyển khoản",
        },
      ],
      deadline: "Hôm nay",
      href: "/payments",
    },
    {
      id: "PAY-2026-0209",
      title: "Võ Thu Hà",
      subtitle: "Đợt 2 · 1.500.000 ₫",
      status: "Cần bổ sung",
      statusTone: "warning",
      details: [
        {
          label: "Vấn đề",
          value: "Ảnh chứng từ chưa rõ",
        },
      ],
      deadline: "Hôm nay",
      href: "/payments",
    },
  ],
};

const staffIncompleteQueue: DashboardQueue = {
  id: "staff-incomplete-enrollments",
  title: "Hồ sơ chưa hoàn tất",
  description:
    "Các hồ sơ đang được tạo nhưng chưa sẵn sàng gửi duyệt.",
  emptyMessage: "Không có hồ sơ đang dang dở.",
  items: [
    {
      id: "ENR-2026-0115",
      title: "Đặng Gia Huy",
      subtitle: "NET HSK · HSK 2",
      status: "Bản nháp",
      statusTone: "neutral",
      details: [
        {
          label: "Thiếu",
          value: "Kế hoạch thanh toán",
        },
      ],
      waitingTime: "30 phút",
      href: "/enrollments",
    },
    {
      id: "ENR-2026-0112",
      title: "Nguyễn Thùy Dương",
      subtitle: "NET English · IELTS",
      status: "Thiếu thông tin",
      statusTone: "warning",
      details: [
        {
          label: "Thiếu",
          value: "Mục tiêu học tập",
        },
      ],
      waitingTime: "3 giờ",
      href: "/enrollments",
    },
  ],
};

export const staffDashboardMock: DashboardData = {
  role: "STAFF",

  title: "Dashboard Nhân viên",
  description:
    "Theo dõi các hồ sơ và công việc cần xử lý của bạn.",

  kpis: [
    {
      id: "staff-processing",
      label: "Hồ sơ đang xử lý",
      value: 12,
      format: "number",
      description: "Hồ sơ chưa hoàn tất quy trình",
      href: "/enrollments",
      tone: "info",
    },
    {
      id: "staff-returned",
      label: "Bị trả lại cần sửa",
      value: 3,
      format: "number",
      description: "Cần sửa và gửi lại quản lý",
      href: "/enrollments",
      tone: "danger",
    },
    {
      id: "staff-payment-fix",
      label: "Thanh toán cần bổ sung",
      value: 2,
      format: "number",
      description: "Chứng từ hoặc thông tin còn thiếu",
      href: "/payments",
      tone: "warning",
    },
    {
      id: "staff-due-today",
      label: "Việc đến hạn hôm nay",
      value: 4,
      format: "number",
      description: "Cần ưu tiên xử lý trong ngày",
      href: "/enrollments",
      tone: "pending",
    },
  ],

  primaryQueue: staffReturnedQueue,

  secondaryQueues: [
    staffPaymentQueue,
    staffIncompleteQueue,
  ],

  quickActions: [
    {
      id: "staff-add-student",
      label: "Thêm học viên",
      href: "/students",
    },
    {
      id: "staff-create-enrollment",
      label: "Tạo ghi danh",
      href: "/enrollments",
    },
    {
      id: "staff-record-payment",
      label: "Ghi nhận thanh toán",
      href: "/payments",
    },
  ],

  recentActivity: [
    {
      id: "ACT-STAFF-01",
      title: "Đã cập nhật hồ sơ Nguyễn Minh Anh",
      description: "Bổ sung thông tin liên hệ.",
      time: "20 phút trước",
      tone: "info",
      href: "/enrollments",
    },
    {
      id: "ACT-STAFF-02",
      title: "Đã ghi nhận thanh toán của Trần Quốc Bảo",
      description: "Thanh toán đợt 1.",
      time: "1 giờ trước",
      tone: "success",
      href: "/payments",
    },
    {
      id: "ACT-STAFF-03",
      title: "Đã tạo học viên Võ Thu Hà",
      time: "2 giờ trước",
      tone: "neutral",
      href: "/students",
    },
  ],
};

const managerReviewQueue: DashboardQueue = {
  id: "manager-review-queue",
  title: "Hồ sơ chờ duyệt",
  description:
    "Ưu tiên các hồ sơ đã chờ lâu nhất.",
  emptyMessage: "Không có hồ sơ nào đang chờ duyệt.",
  items: [
    {
      id: "ENR-2026-0089",
      title: "Hoàng Minh Khôi",
      subtitle: "NET HSK · HSK 5",
      status: "Chờ duyệt",
      statusTone: "pending",
      details: [
        {
          label: "Nhân viên",
          value: "Nguyễn Minh Nhân Viên",
        },
        {
          label: "Ngày gửi",
          value: "02/10/2026",
        },
      ],
      waitingTime: "18 giờ",
      href: "/reviews",
    },
    {
      id: "ENR-2026-0094",
      title: "Nguyễn Hải Yến",
      subtitle: "NET English · IELTS",
      status: "Chờ duyệt",
      statusTone: "pending",
      details: [
        {
          label: "Nhân viên",
          value: "Nguyễn Minh Nhân Viên",
        },
        {
          label: "Ngày gửi",
          value: "03/10/2026",
        },
      ],
      waitingTime: "5 giờ",
      href: "/reviews",
    },
    {
      id: "ENR-2026-0098",
      title: "Đỗ Thành Công",
      subtitle: "NET HSK · HSK 3",
      status: "Chờ duyệt",
      statusTone: "pending",
      details: [
        {
          label: "Nhân viên",
          value: "Phạm Minh Tuấn",
        },
        {
          label: "Ngày gửi",
          value: "03/10/2026",
        },
      ],
      waitingTime: "2 giờ",
      href: "/reviews",
    },
  ],
};

const managerPaymentQueue: DashboardQueue = {
  id: "manager-payment-review",
  title: "Thanh toán chờ kiểm tra",
  description:
    "Các giao dịch đã có chứng từ và đang chờ xác nhận.",
  emptyMessage: "Không có thanh toán đang chờ kiểm tra.",
  items: [
    {
      id: "PAY-2026-0204",
      title: "Nguyễn Hải Yến",
      subtitle: "2.500.000 ₫ · Đợt 1",
      status: "Chờ xác nhận",
      statusTone: "pending",
      details: [
        {
          label: "Người gửi",
          value: "Nguyễn Minh Nhân Viên",
        },
      ],
      waitingTime: "3 giờ",
      href: "/payments",
    },
    {
      id: "PAY-2026-0201",
      title: "Phan Thanh Tâm",
      subtitle: "500.000 ₫ · Tiền cọc",
      status: "Chờ xác nhận",
      statusTone: "pending",
      details: [
        {
          label: "Người gửi",
          value: "Phạm Minh Tuấn",
        },
      ],
      waitingTime: "6 giờ",
      href: "/payments",
    },
  ],
};

const managerExceptionQueue: DashboardQueue = {
  id: "manager-exceptions",
  title: "Ngoại lệ cần xử lý",
  description:
    "Các trường hợp cần quyết định của quản lý.",
  emptyMessage: "Không có ngoại lệ cần xử lý.",
  items: [
    {
      id: "EXC-2026-0041",
      title: "Trần Quốc Bảo",
      subtitle: "Yêu cầu điều chỉnh kế hoạch thanh toán",
      status: "Cần quyết định",
      statusTone: "warning",
      details: [
        {
          label: "Yêu cầu",
          value: "Chia học phí thành 4 đợt",
        },
      ],
      waitingTime: "4 giờ",
      href: "/reviews",
    },
    {
      id: "EXC-2026-0038",
      title: "Nguyễn Minh Anh",
      subtitle: "Học bổng ngoài chính sách chuẩn",
      status: "Cần quyết định",
      statusTone: "warning",
      details: [
        {
          label: "Đề xuất",
          value: "Học bổng 80%",
        },
      ],
      waitingTime: "1 ngày",
      href: "/reviews",
    },
  ],
};

export const managerDashboardMock: DashboardData = {
  role: "MANAGER",

  title: "Dashboard Quản lý",
  description:
    "Theo dõi hàng đợi duyệt và các điểm nghẽn trong quy trình.",

  kpis: [
    {
      id: "manager-awaiting-review",
      label: "Hồ sơ chờ duyệt",
      value: 7,
      format: "number",
      description: "Đang chờ quản lý kiểm tra",
      href: "/reviews",
      tone: "pending",
    },
    {
      id: "manager-returned",
      label: "Hồ sơ đã trả lại",
      value: 3,
      format: "number",
      description: "Chưa được nhân viên gửi lại",
      href: "/reviews",
      tone: "danger",
    },
    {
      id: "manager-payment-review",
      label: "Thanh toán chờ kiểm tra",
      value: 5,
      format: "number",
      description: "Có chứng từ chờ xác nhận",
      href: "/payments",
      tone: "warning",
    },
    {
      id: "manager-exception",
      label: "Ngoại lệ cần xử lý",
      value: 2,
      format: "number",
      description: "Cần quyết định của quản lý",
      href: "/reviews",
      tone: "warning",
    },
  ],

  primaryQueue: managerReviewQueue,

  secondaryQueues: [
    managerPaymentQueue,
    managerExceptionQueue,
  ],

  summary: [
    {
      id: "manager-new-enrollment-today",
      label: "Ghi danh mới hôm nay",
      value: "8",
      tone: "info",
      href: "/enrollments",
    },
    {
      id: "manager-new-student-today",
      label: "Học viên mới hôm nay",
      value: "6",
      tone: "info",
      href: "/students",
    },
    {
      id: "manager-confirmed-payment-today",
      label: "Thanh toán đã xác nhận hôm nay",
      value: "11",
      tone: "success",
      href: "/payments",
    },
  ],

  recentActivity: [
    {
      id: "ACT-MANAGER-01",
      title: "Hồ sơ Trần Ngọc Mai đã được duyệt",
      time: "15 phút trước",
      tone: "success",
      href: "/reviews",
    },
    {
      id: "ACT-MANAGER-02",
      title: "Hồ sơ Nguyễn Minh Anh bị trả lại",
      description: "Thiếu kế hoạch thanh toán.",
      time: "1 giờ trước",
      tone: "danger",
      href: "/reviews",
    },
    {
      id: "ACT-MANAGER-03",
      title: "Thanh toán 2.500.000 ₫ đã được xác nhận",
      description: "Học viên Nguyễn Hải Yến.",
      time: "2 giờ trước",
      tone: "success",
      href: "/payments",
    },
  ],
};

export const ownerDashboardMock: DashboardData = {
  role: "OWNER",

  title: "Dashboard Chủ trung tâm",
  description:
    "Tổng quan vận hành, tài chính và các điểm cần chú ý của trung tâm.",

  kpis: [
    {
      id: "owner-active-students",
      label: "Học viên đang hoạt động",
      value: 286,
      format: "number",
      description: "Có ít nhất một ghi danh đang hoạt động",
      href: "/students",
      tone: "info",
    },
    {
      id: "owner-month-enrollments",
      label: "Ghi danh mới tháng này",
      value: 42,
      format: "number",
      description: "Ghi danh được tạo trong tháng",
      href: "/enrollments",
      tone: "info",
    },
    {
      id: "owner-collected",
      label: "Đã thu tháng này",
      value: 186500000,
      format: "currency",
      description: "Thanh toán đã được xác nhận",
      href: "/payments",
      tone: "success",
    },
    {
      id: "owner-outstanding",
      label: "Còn phải thu",
      value: 73500000,
      format: "currency",
      description: "Nghĩa vụ thanh toán chưa hoàn thành",
      href: "/payments",
      tone: "warning",
    },
  ],

  primaryQueue: {
    id: "owner-operation-attention",
    title: "Vận hành cần chú ý",
    description:
      "Các điểm nghẽn hiện tại trong quy trình trung tâm.",
    emptyMessage: "Không có vấn đề vận hành cần chú ý.",
    items: [
      {
        id: "OWNER-OPS-01",
        title: "7 hồ sơ đang chờ duyệt",
        status: "Cần xử lý",
        statusTone: "pending",
        waitingTime: "Cũ nhất: 18 giờ",
        href: "/reviews",
      },
      {
        id: "OWNER-OPS-02",
        title: "3 hồ sơ tồn quá 2 ngày",
        status: "Tồn lâu",
        statusTone: "danger",
        href: "/enrollments",
      },
      {
        id: "OWNER-OPS-03",
        title: "2 ngoại lệ chưa xử lý",
        status: "Cần quyết định",
        statusTone: "warning",
        href: "/reviews",
      },
      {
        id: "OWNER-OPS-04",
        title: "5 học viên đang chờ xếp lớp",
        status: "Chờ xếp lớp",
        statusTone: "warning",
        href: "/classes",
      },
    ],
  },

  summary: [
    {
      id: "owner-overdue-payments",
      label: "Thanh toán quá hạn",
      value: "6 khoản",
      tone: "danger",
      href: "/payments",
    },
    {
      id: "owner-payment-review",
      label: "Thanh toán chưa xác nhận",
      value: "5 khoản",
      tone: "pending",
      href: "/payments",
    },
    {
      id: "owner-invoice-queue",
      label: "Hóa đơn chờ xuất",
      value: "4 hồ sơ",
      tone: "warning",
      href: "/accounting",
    },
    {
      id: "owner-active-classes",
      label: "Lớp đang hoạt động",
      value: "18 lớp",
      tone: "success",
      href: "/classes",
    },
    {
      id: "owner-waiting-class",
      label: "Học viên chờ xếp lớp",
      value: "5 học viên",
      tone: "warning",
      href: "/classes",
    },
    {
      id: "owner-capacity-pressure",
      label: "Lớp gần đầy",
      value: "3 lớp",
      tone: "warning",
      href: "/classes",
    },
  ],

  recentActivity: [
    {
      id: "ACT-OWNER-01",
      title: "Enrollment của Trần Ngọc Mai đã được duyệt",
      time: "15 phút trước",
      tone: "success",
      href: "/reviews",
    },
    {
      id: "ACT-OWNER-02",
      title: "Thanh toán 3.200.000 ₫ đã được xác nhận",
      time: "45 phút trước",
      tone: "success",
      href: "/payments",
    },
    {
      id: "ACT-OWNER-03",
      title: "Hóa đơn INV-2026-0182 đã được xuất",
      time: "1 giờ trước",
      tone: "info",
      href: "/accounting",
    },
    {
      id: "ACT-OWNER-04",
      title: "Nguyễn Thanh An đã được xếp lớp HSK4-A02",
      time: "2 giờ trước",
      tone: "info",
      href: "/classes",
    },
  ],
};

export const dashboardMockByRole: Record<
  AppRole,
  DashboardData
> = {
  STAFF: staffDashboardMock,
  MANAGER: managerDashboardMock,
  OWNER: ownerDashboardMock,
};

export function getDashboardMock(
  role: AppRole
): DashboardData {
  return dashboardMockByRole[role];
}