"use client";

import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { ConfirmDialog } from "@/shared/ui/feedback/confirm-dialog";

export function PlaygroundActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <ConfirmDialog
        trigger={
          <Button variant="outline">
            <LockKeyhole />
            Test xác nhận
          </Button>
        }
        title="Khóa tài khoản?"
        description="Tài khoản sẽ không thể đăng nhập cho đến khi được mở lại."
        confirmText="Khóa tài khoản"
        destructive
        onConfirm={() => {
          toast.success("Đã xác nhận thao tác thử nghiệm.");
        }}
      />
    </div>
  );
}
