import type { AppRole } from "@/shared/types/role";

const allRoles: readonly AppRole[] = ["OWNER", "MANAGER", "STAFF"];

export const routeAccess: Record<string, readonly AppRole[]> = {
  "/dashboard": allRoles,

  "/students": allRoles,
  "/enrollments": allRoles,
  "/payments": allRoles,

  "/reviews": ["OWNER", "MANAGER"],
  "/accounting": ["OWNER", "MANAGER"],
  "/classes": ["OWNER", "MANAGER"],

  "/courses": ["OWNER", "MANAGER"],
  "/users": ["OWNER", "MANAGER"],

  "/settings": ["OWNER"],

  // Trang dành cho dev, không nằm trong Sidebar.
  "/ui-playground": allRoles,
};

export function getAllowedRoles(pathname: string): readonly AppRole[] | null {
  const matchedRoute = Object.keys(routeAccess)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!matchedRoute) {
    return null;
  }

  return routeAccess[matchedRoute];
}

export function canAccessRoute(pathname: string, role: AppRole) {
  const allowedRoles = getAllowedRoles(pathname);

  // Route chưa khai báo thì không chặn ở mock gate.
  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.includes(role);
}
