import type { AppRole } from "@/shared/types/role";
import type { MockUser } from "@/shared/types/user";

export const mockUsers: MockUser[] = [
  {
    id: "mock-staff-01",
    name: "Nguyễn Minh Nhân Viên",
    email: "staff@netcorp.local",
    role: "STAFF",
    roleLabel: "Nhân viên",
    initials: "NV",
  },
  {
    id: "mock-manager-01",
    name: "Trần Anh Quản Lý",
    email: "manager@netcorp.local",
    role: "MANAGER",
    roleLabel: "Quản lý",
    initials: "QL",
  },
  {
    id: "mock-owner-01",
    name: "Lê Minh Chủ Trung Tâm",
    email: "owner@netcorp.local",
    role: "OWNER",
    roleLabel: "Chủ trung tâm",
    initials: "CT",
  },
];

export const mockUsersByRole: Record<AppRole, MockUser> = {
  STAFF: mockUsers[0],
  MANAGER: mockUsers[1],
  OWNER: mockUsers[2],
};

export const defaultMockUser = mockUsersByRole.OWNER;
