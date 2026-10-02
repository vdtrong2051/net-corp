import type { AppRole } from "@/shared/types/role";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  roleLabel: string;
  initials: string;
};
