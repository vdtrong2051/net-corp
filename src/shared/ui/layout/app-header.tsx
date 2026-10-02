"use client";

import { Bell, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";

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
import { AppBreadcrumb } from "@/shared/ui/navigation/app-breadcrumb";

export function AppHeader() {
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
              <AvatarFallback>NV</AvatarFallback>
            </Avatar>

            <div className="hidden text-left sm:block">
              <div className="max-w-32 truncate text-sm font-medium">
                Nguyễn Văn Demo
              </div>

              <div className="text-muted-foreground text-xs">Chủ trung tâm</div>
            </div>

            <ChevronDown className="text-muted-foreground hidden size-4 sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>Nguyễn Văn Demo</span>

                  <span className="text-muted-foreground text-xs font-normal">
                    Chủ trung tâm
                  </span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem>
                <UserRound />
                Hồ sơ cá nhân
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings />
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <LogOut />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
