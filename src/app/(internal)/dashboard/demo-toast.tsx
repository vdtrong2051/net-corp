"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function DemoToast() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => {
          toast.success("Lưu hồ sơ thành công.");
        }}
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast.info("Hồ sơ đang chờ quản lý kiểm tra.");
        }}
      >
        Info Toast
      </Button>

      <Button
        variant="outline"
        onClick={() => {
          toast.warning("Học viên chưa đóng đủ học phí.");
        }}
      >
        Warning Toast
      </Button>

      <Button
        variant="destructive"
        onClick={() => {
          toast.error("Không thể lưu hồ sơ.");
        }}
      >
        Error Toast
      </Button>
    </div>
  );
}
