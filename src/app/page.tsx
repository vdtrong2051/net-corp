import { ArrowRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">NET CORP</h1>

        <p className="text-muted-foreground">
          Internal Enrollment Management System
        </p>

        <Button>
          Khởi động hệ thống
          <ArrowRight />
        </Button>
      </div>
    </main>
  );
}
