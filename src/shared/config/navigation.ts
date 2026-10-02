import {
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ReceiptText,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

import type { NavGroup } from "@/shared/types/navigation";
import type { AppRole } from "@/shared/types/role";

export const navigation: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },
  {
    title: "Học viên",
    items: [
      {
        title: "Danh sách học viên",
        href: "/students",
        icon: Users,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },
  {
    title: "Ghi danh",
    items: [
      {
        title: "Hồ sơ ghi danh",
        href: "/enrollments",
        icon: FileText,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
      {
        title: "Thanh toán",
        href: "/payments",
        icon: CreditCard,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },
  {
    title: "Vận hành",
    items: [
      {
        title: "Kiểm tra hồ sơ",
        href: "/reviews",
        icon: ClipboardCheck,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Kế toán",
        href: "/accounting",
        icon: ReceiptText,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Lớp học",
        href: "/classes",
        icon: GraduationCap,
        roles: ["OWNER", "MANAGER"],
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      {
        title: "Khóa học",
        href: "/courses",
        icon: BookOpen,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Tài khoản",
        href: "/users",
        icon: UserCog,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Cài đặt",
        href: "/settings",
        icon: Settings,
        roles: ["OWNER"],
      },
    ],
  },
];

export function getNavigationForRole(role: AppRole): NavGroup[] {
  return navigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}
