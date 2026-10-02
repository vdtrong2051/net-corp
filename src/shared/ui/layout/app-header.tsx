"use client";

import {
  Bell,
  Check,
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMockSession } from "@/shared/providers/mock-session-provider";
import type { AppRole } from "@/shared/types/role";
import { AppBreadcrumb } from "@/shared/ui/navigation/app-breadcrumb";

const roleOptions: Array<{
  role: AppRole;
  label: string;
}> = [
  {
    role: "STAFF",
    label: "Nhân viên",
  },
  {
    role: "MANAGER",
    label: "Quản lý",
  },
  {
    role: "OWNER",
    label: "Chủ trung tâm",
  },
];

export function AppHeader() {
  const { user, role, setRole } = useMockSession();

  return (
    <header className="bg-background/95 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="min-w-0 flex-1 overflow-hidden">
        <AppBreadcrumb />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Thông báo"
          className="relative"
        >
          <Bell className="size-4" />

          <span className="bg-destructive absolute top-2 right-2 size-2 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 gap-2 px-2"
                aria-label="Mở menu tài khoản"
              />
            }
          >
            <Avatar className="size-7">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>

            <div className="hidden text-left sm:block">
              <div className="max-w-40 truncate text-sm font-medium">
                {user.name}
              </div>

              <div className="text-muted-foreground text-xs">
                {user.roleLabel}
              </div>
            </div>

            <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-0.5">
                  <span className="text-foreground">{user.name}</span>

                  <span className="text-muted-foreground text-xs font-normal">
                    {user.email}
                  </span>

                  <span className="text-muted-foreground text-xs font-normal">
                    {user.roleLabel}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel>Chuyển vai trò</DropdownMenuLabel>

              {roleOptions.map((option) => {
                const isActive = role === option.role;

                return (
                  <DropdownMenuItem
                    key={option.role}
                    onClick={() => setRole(option.role)}
                  >
                    <span className="flex-1">{option.label}</span>

                    {isActive ? (
                      <Check className="text-primary size-4" />
                    ) : null}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRound />
                Hồ sơ cá nhân
              </DropdownMenuItem>

              {role === "OWNER" ? (
                <DropdownMenuItem>
                  <Settings />
                  Cài đặt
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" disabled>
                <LogOut />
                Đăng xuất
                <span className="ml-auto text-xs opacity-60">Demo</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
