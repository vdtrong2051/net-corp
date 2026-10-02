import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  courseDeliveryModeLabels,
  courseProgramLabels,
} from "@/modules/courses/model/course.types";
import { getCourseCatalogItem } from "@/modules/courses/data/course-catalog.mock";
import type {
  CourseHistoryStatus,
  StudentProfile360,
} from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const statusLabels: Record<CourseHistoryStatus, string> = {
  WAITING_CLASS: "Chờ xếp lớp",
  ACTIVE: "Đang học",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<CourseHistoryStatus, StatusTone> = {
  WAITING_CLASS: "pending",
  ACTIVE: "info",
  COMPLETED: "success",
  CANCELLED: "neutral",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

type StudentCourseHistoryProps = {
  profile: StudentProfile360;
};

export function StudentCourseHistory({ profile }: StudentCourseHistoryProps) {
  if (profile.courses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Chưa có khóa học</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Học viên chưa đăng ký khóa học nào.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {profile.courses.map((course) => {
        const catalogItem = getCourseCatalogItem(course.courseCatalogId);

        const remainingAmount = Math.max(
          course.tuitionAfterScholarship - course.paidAmount,
          0
        );

        return (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{course.courseName}</CardTitle>

                  <div className="mt-2 flex flex-wrap gap-1">
                    <StatusBadge tone="info">
                      {courseProgramLabels[course.program]}
                    </StatusBadge>

                    {catalogItem ? (
                      <StatusBadge tone="neutral">
                        {courseDeliveryModeLabels[catalogItem.deliveryMode]}
                      </StatusBadge>
                    ) : null}
                  </div>
                </div>

                <StatusBadge tone={statusTones[course.status]}>
                  {statusLabels[course.status]}
                </StatusBadge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs">Lớp</p>

                  <p className="mt-1 font-medium">
                    {course.classCode ?? course.expectedStart ?? "Chưa xếp lớp"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">
                    Học phí sau học bổng
                  </p>

                  <p className="mt-1 font-medium">
                    {formatCurrency(course.tuitionAfterScholarship)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Đã ghi nhận</p>

                  <p className="mt-1 font-medium">
                    {formatCurrency(course.paidAmount)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Còn lại</p>

                  <p className="mt-1 font-medium">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-muted-foreground text-xs">Học bổng</p>

                  <p className="mt-1 text-sm">
                    {course.scholarshipNote ?? "Không có"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Khóa catalog</p>

                  <p className="mt-1 text-sm">
                    {catalogItem
                      ? `${catalogItem.name} · ${formatCurrency(
                          catalogItem.baseTuition
                        )}`
                      : course.courseCatalogId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
