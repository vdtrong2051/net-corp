import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { enrollmentListMock } from "@/modules/enrollments/data/enrollment.mock";
import { EnrollmentListTable } from "@/modules/enrollments/ui/enrollment-list-table";
import { PageContainer } from "@/shared/ui/layout/page-container";

export default function EnrollmentsPage() {
  const totalEnrollments = enrollmentListMock.length;

  const draftCount = enrollmentListMock.filter(
    (enrollment) => enrollment.status === "DRAFT"
  ).length;

  const submittedCount = enrollmentListMock.filter(
    (enrollment) => enrollment.status === "SUBMITTED"
  ).length;

  const mixedProgramCount = enrollmentListMock.filter(
    (enrollment) => enrollment.programs.length > 1
  ).length;

  return (
    <PageContainer
      title="Ghi danh"
      description="Quản lý các lần ghi danh, chương trình, khóa học và trạng thái hồ sơ."
      actions={
        <Button
          nativeButton={false}
          render={<Link href="/enrollments/create" />}
        >
          <Plus />
          Tạo ghi danh
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <section
          aria-label="Tổng quan ghi danh"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card size="sm">
            <CardHeader>
              <CardDescription>Tổng hồ sơ</CardDescription>

              <CardTitle className="text-xl">{totalEnrollments}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Tất cả hồ sơ ghi danh mock
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription>Bản nháp</CardDescription>

              <CardTitle className="text-xl">{draftCount}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Hồ sơ chưa gửi duyệt
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription>Chờ duyệt</CardDescription>

              <CardTitle className="text-xl">{submittedCount}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Hồ sơ đã gửi quản lý
              </p>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription>Ghi danh hỗn hợp</CardDescription>

              <CardTitle className="text-xl">{mixedProgramCount}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-xs">
                Có cả NET HSK và NET English
              </p>
            </CardContent>
          </Card>
        </section>

        <section
          aria-label="Danh sách ghi danh"
          className="flex min-w-0 flex-col gap-4"
        >
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Danh sách ghi danh
              </h2>

              <p className="text-muted-foreground text-sm">
                {totalEnrollments} hồ sơ
              </p>
            </div>

            <p className="text-muted-foreground text-xs">
              Có thể bắt đầu hồ sơ mới từ nút Tạo ghi danh.
            </p>
          </div>

          <EnrollmentListTable data={enrollmentListMock} />
        </section>
      </div>
    </PageContainer>
  );
}
