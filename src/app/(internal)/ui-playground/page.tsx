import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DemoForm } from "@/app/(internal)/dashboard/demo-form";
import { DemoStudentsTable } from "@/app/(internal)/dashboard/demo-students-table";
import { DemoToast } from "@/app/(internal)/dashboard/demo-toast";

import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { ErrorState } from "@/shared/ui/feedback/error-state";
import { LoadingState } from "@/shared/ui/feedback/loading-state";
import { PageContainer } from "@/shared/ui/layout/page-container";

import { PlaygroundActions } from "./playground-actions";

export default function UIPlaygroundPage() {
  return (
    <PageContainer
      title="UI Playground"
      description="Kiểm tra các component nền dùng chung của NET CORP."
      actions={
        <Button>
          <Plus />
          Action mẫu
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Buttons + Badge */}
        <Card>
          <CardHeader>
            <CardTitle>Button & trạng thái</CardTitle>
            <CardDescription>
              Các trạng thái giao diện thường dùng trong hệ thống.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">
            <Button>Mặc định</Button>

            <Button variant="outline">Outline</Button>

            <Button variant="destructive">Nguy hiểm</Button>

            <Badge variant="outline">
              <Clock3 />
              Chờ duyệt
            </Badge>

            <Badge variant="outline">
              <CheckCircle2 />
              Đã duyệt
            </Badge>

            <Badge variant="outline">
              <AlertTriangle />
              Cần xử lý
            </Badge>
          </CardContent>
        </Card>

        {/* Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Dialog & xác nhận</CardTitle>
            <CardDescription>
              Kiểm tra các thao tác cần người dùng xác nhận.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <PlaygroundActions />
          </CardContent>
        </Card>

        {/* Toast */}
        <Card>
          <CardHeader>
            <CardTitle>Toast</CardTitle>
            <CardDescription>Success, info, warning và error.</CardDescription>
          </CardHeader>

          <CardContent>
            <DemoToast />
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>DataTable</CardTitle>
            <CardDescription>
              Bảng generic sử dụng TanStack Table.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DemoStudentsTable />
          </CardContent>
        </Card>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
            <CardDescription>
              React Hook Form + Zod + Field pattern.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <DemoForm />
          </CardContent>
        </Card>

        {/* Empty */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State</CardTitle>
          </CardHeader>

          <CardContent>
            <EmptyState
              title="Chưa có học viên"
              description="Danh sách hiện chưa có học viên nào."
              icon={<UserPlus className="text-muted-foreground size-5" />}
              action={
                <Button>
                  <Plus />
                  Thêm học viên
                </Button>
              }
            />
          </CardContent>
        </Card>

        {/* Loading */}
        <Card>
          <CardHeader>
            <CardTitle>Loading State</CardTitle>
          </CardHeader>

          <CardContent>
            <LoadingState rows={4} />
          </CardContent>
        </Card>

        {/* Error */}
        <Card>
          <CardHeader>
            <CardTitle>Error State</CardTitle>
          </CardHeader>

          <CardContent>
            <ErrorState
              title="Không thể tải dữ liệu"
              description="Đây là trạng thái lỗi thử nghiệm của UI Playground."
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
