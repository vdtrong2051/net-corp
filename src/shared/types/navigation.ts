import type { LucideIcon } from "lucide-react";

import type { AppRole } from "@/shared/types/role";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: AppRole[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};
