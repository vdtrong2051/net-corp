"use client";

import * as React from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Info,
  Plus,
  Save,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { typography } from "@/shared/config/typography";
import { DataTable } from "@/shared/ui/data-table/data-table";
import { AppDialogContent } from "@/shared/ui/feedback/app-dialog-content";
import { ConfirmDialog } from "@/shared/ui/feedback/confirm-dialog";
import { EmptyState } from "@/shared/ui/feedback/empty-state";
import { ErrorState } from "@/shared/ui/feedback/error-state";
import { LoadingButton } from "@/shared/ui/feedback/loading-button";
import { LoadingState } from "@/shared/ui/feedback/loading-state";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";
import { DatePicker } from "@/shared/ui/form/date-picker";

import { type AppTableFeatures } from "@/shared/ui/data-table/data-table";
import type { ColumnDef } from "@tanstack/react-table";

type DemoRow = {
  id: string;
  name: string;
  status: string;
};

const demoColumns: ColumnDef<AppTableFeatures, DemoRow>[] = [
  {
    accessorKey: "id",
    header: "Mã",
  },
  {
    accessorKey: "name",
    header: "Học viên",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <StatusBadge tone="pending">{row.original.status}</StatusBadge>
    ),
  },
];

const demoData: DemoRow[] = [
  {
    id: "HV001",
    name: "Nguyễn Văn A",
    status: "Chờ duyệt",
  },
  {
    id: "HV002",
    name: "Trần Thị B",
    status: "Chờ duyệt",
  },
];

export function DesignSystemShowcase() {
  const [date, setDate] = React.useState<Date>();
  const [program, setProgram] = React.useState<string>("");

  return (
    <div className="space-y-8">
      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Phân cấp chữ dùng chung trong toàn hệ thống.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <div className={typography.pageTitle}>Page Title</div>
            <div className={typography.small}>24px · Semibold</div>
          </div>

          <div>
            <div className={typography.sectionTitle}>Section Title</div>
            <div className={typography.small}>18px · Semibold</div>
          </div>

          <div>
            <div className={typography.cardTitle}>Card Title</div>
            <div className={typography.small}>16px · Medium</div>
          </div>

          <p className={typography.body}>
            Nội dung thông thường trong hệ thống NET CORP.
          </p>

          <p className={typography.muted}>Nội dung mô tả hoặc thông tin phụ.</p>

          <p className={typography.small}>Metadata · cập nhật 10 phút trước</p>

          <p className={`${typography.body} ${typography.numeric}`}>
            12.500.000 ₫ · 70% · 3 khóa học
          </p>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Colors</CardTitle>
          <CardDescription>
            Hệ màu trạng thái, không phụ thuộc từng module nghiệp vụ.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-success/30 bg-success/10 text-success rounded-lg border p-4">
              <div className="font-medium">Success</div>
              <div className="mt-1 text-sm">Đã duyệt / Đã thanh toán</div>
            </div>

            <div className="border-warning/30 bg-warning/10 text-warning rounded-lg border p-4">
              <div className="font-medium">Warning</div>
              <div className="mt-1 text-sm">Chờ duyệt / Cần chú ý</div>
            </div>

            <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4">
              <div className="font-medium">Danger</div>
              <div className="mt-1 text-sm">Lỗi / Quá hạn</div>
            </div>

            <div className="border-info/30 bg-info/10 text-info rounded-lg border p-4">
              <div className="font-medium">Info</div>
              <div className="mt-1 text-sm">Đang xử lý</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing</CardTitle>
          <CardDescription>
            Khoảng cách chuẩn của layout NET CORP.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <SpacingDemo label="Action gap · 8px" gap="action" />

          <SpacingDemo label="Content gap · 16px" gap="content" />

          <SpacingDemo label="Section gap · 24px" gap="section" />
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Variant, kích thước và trạng thái.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">Variants</p>

            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus />
                Default
              </Button>

              <Button variant="secondary">Secondary</Button>

              <Button variant="outline">Outline</Button>

              <Button variant="ghost">Ghost</Button>

              <Button variant="destructive">
                <Trash2 />
                Destructive
              </Button>

              <Button variant="link">Link</Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">States</p>

            <div className="flex flex-wrap gap-2">
              <Button disabled>Disabled</Button>

              <LoadingButton loading loadingText="Đang lưu...">
                Lưu
              </LoadingButton>

              <Button variant="outline" size="icon" aria-label="Lưu">
                <Save />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Form Controls</CardTitle>
          <CardDescription>
            Input, textarea, select và date picker.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Họ và tên</FieldLabel>

              <Input placeholder="Nguyễn Văn A" />

              <FieldDescription>Input mặc định.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Chương trình</FieldLabel>

              <Select
                value={program}
                onValueChange={(value) => {
                  setProgram(value ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chương trình" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="HSK">NET HSK</SelectItem>

                  <SelectItem value="ENGLISH">NET English</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Ngày sinh</FieldLabel>

              <DatePicker value={date} onChange={setDate} disableFuture />
            </Field>

            <Field data-invalid>
              <FieldLabel>Email</FieldLabel>

              <Input aria-invalid defaultValue="email-sai" />

              <FieldError>Email không đúng định dạng.</FieldError>
            </Field>

            <Field className="md:col-span-2">
              <FieldLabel>Ghi chú</FieldLabel>

              <Textarea placeholder="Yêu cầu hoặc ghi chú..." rows={4} />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Status Badge */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badge</CardTitle>
          <CardDescription>
            Semantic status dùng chung giữa các module.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <StatusBadge tone="neutral">Chưa thanh toán</StatusBadge>

          <StatusBadge tone="pending">
            <Clock3 />
            Chờ duyệt
          </StatusBadge>

          <StatusBadge tone="success">
            <CheckCircle2 />
            Đã duyệt
          </StatusBadge>

          <StatusBadge tone="warning">
            <AlertTriangle />
            Thanh toán một phần
          </StatusBadge>

          <StatusBadge tone="danger">Bị trả lại</StatusBadge>

          <StatusBadge tone="info">
            <Info />
            Đang xử lý
          </StatusBadge>
        </CardContent>
      </Card>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Hai density chính của hệ thống.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                Dùng cho dashboard, detail và form.
              </CardDescription>
            </CardHeader>

            <CardContent>Nội dung card mặc định.</CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Compact Card</CardTitle>
              <CardDescription>
                Dùng cho metadata hoặc nội dung nhỏ.
              </CardDescription>
            </CardHeader>

            <CardContent>Nội dung compact.</CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>DataTable</CardTitle>
          <CardDescription>
            Table chuẩn dùng chung trong các màn danh sách.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable columns={demoColumns} data={demoData} />
        </CardContent>
      </Card>

      {/* Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
          <CardDescription>
            Dialog nhập liệu và dialog xác nhận.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline">
                  <CalendarDays />
                  Mở Dialog
                </Button>
              }
            />

            <AppDialogContent size="md">
              <DialogHeader>
                <DialogTitle>Dialog mẫu</DialogTitle>

                <DialogDescription>
                  Dialog kích thước trung bình.
                </DialogDescription>
              </DialogHeader>

              <div className="py-2 text-sm">Nội dung dialog.</div>

              <DialogFooter>
                <Button>Lưu</Button>
              </DialogFooter>
            </AppDialogContent>
          </Dialog>

          <ConfirmDialog
            trigger={
              <Button variant="destructive">
                <Trash2 />
                Test xác nhận
              </Button>
            }
            title="Xác nhận thao tác?"
            description="Đây là dialog xác nhận hành động nguy hiểm."
            confirmText="Xác nhận"
            destructive
            onConfirm={() => {
              toast.success("Đã xác nhận.");
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>
            Tabs cho các màn detail như Student 360.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList variant="line">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>

              <TabsTrigger value="enrollments">Ghi danh</TabsTrigger>

              <TabsTrigger value="payments">Thanh toán</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="pt-4">
              Tổng quan học viên.
            </TabsContent>

            <TabsContent value="enrollments" className="pt-4">
              Danh sách ghi danh.
            </TabsContent>

            <TabsContent value="payments" className="pt-4">
              Lịch sử thanh toán.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
          <CardDescription>Feedback sau thao tác.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => toast.success("Thao tác thành công.")}>
            Success
          </Button>

          <Button
            variant="outline"
            onClick={() => toast.info("Thông tin hệ thống.")}
          >
            Info
          </Button>

          <Button variant="outline" onClick={() => toast.warning("Cần chú ý.")}>
            Warning
          </Button>

          <Button
            variant="destructive"
            onClick={() => toast.error("Có lỗi xảy ra.")}
          >
            Error
          </Button>
        </CardContent>
      </Card>

      {/* Feedback states */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback States</CardTitle>
          <CardDescription>Empty, loading và error.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
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

          <LoadingState rows={3} />

          <ErrorState
            title="Không thể tải dữ liệu"
            description="Đây là trạng thái lỗi thử nghiệm."
          />
        </CardContent>
      </Card>
    </div>
  );
}

type SpacingDemoProps = {
  label: string;
  gap: "action" | "content" | "section";
};

const gapStyles = {
  action: "gap-2",
  content: "gap-4",
  section: "gap-6",
} as const;

function SpacingDemo({ label, gap }: SpacingDemoProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>

      <div className={`flex ${gapStyles[gap]}`}>
        <div className="bg-muted size-10 rounded-lg" />
        <div className="bg-muted size-10 rounded-lg" />
        <div className="bg-muted size-10 rounded-lg" />
      </div>
    </div>
  );
}
