import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <p className="text-muted-foreground text-sm font-medium">404</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Không tìm thấy trang
        </h1>

        <p className="text-muted-foreground mt-3 text-sm">
          Trang bạn đang truy cập không tồn tại hoặc đã được thay đổi.
        </p>

        <Button render={<Link href="/dashboard" />} className="mt-6">
          Về Dashboard
        </Button>
      </div>
    </main>
  );
}
