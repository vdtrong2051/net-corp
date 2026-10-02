import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  EnrollmentHistoryStatus,
  ProgramCode,
  StudentProfile360,
} from "@/modules/students/model/student.types";
import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";

const programLabels: Record<ProgramCode, string> = {
  NET_HSK: "NET HSK",
  NET_ENGLISH: "NET English",
};

const statusLabels: Record<EnrollmentHistoryStatus, string> = {
  DRAFT: "Bản nháp",
  SUBMITTED: "Chờ duyệt",
  RETURNED: "Bị trả lại",
  APPROVED: "Đã duyệt",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
};

const statusTones: Record<EnrollmentHistoryStatus, StatusTone> = {
  DRAFT: "neutral",
  SUBMITTED: "pending",
  RETURNED: "danger",
  APPROVED: "success",
  COMPLETED: "success",
  CANCELLED: "neutral",
};

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type StudentEnrollmentHistoryProps = {
  profile: StudentProfile360;
};

export function StudentEnrollmentHistory({
  profile,
}: StudentEnrollmentHistoryProps) {
  const enrollments = [...profile.enrollments].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

  if (enrollments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Chưa có lịch sử ghi danh</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Học viên chưa có hồ sơ ghi danh nào.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {enrollments.map((enrollment) => {
        const courses = profile.courses.filter(
          (course) => course.enrollmentId === enrollment.id
        );

        return (
          <Card key={enrollment.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{enrollment.enrollmentCode}</CardTitle>

                  <CardDescription className="mt-1">
                    Tạo lúc {formatDateTime(enrollment.createdAt)}
                  </CardDescription>
                </div>

                <StatusBadge tone={statusTones[enrollment.status]}>
                  {statusLabels[enrollment.status]}
                </StatusBadge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Sale phụ trách
                    </p>

                    <p className="mt-1 font-medium">{enrollment.salesName}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">
                      Số khóa trong ghi danh
                    </p>

                    <p className="mt-1 font-medium">{courses.length}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs">Ngày duyệt</p>

                    <p className="mt-1 font-medium">
                      {formatDateTime(enrollment.approvedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2 text-xs">
                    Chương trình
                  </p>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {enrollment.programs.map((programInfo) => (
                      <div
                        key={programInfo.program}
                        className="rounded-lg border p-4"
                      >
                        <StatusBadge tone="info">
                          {programLabels[programInfo.program]}
                        </StatusBadge>

                        <div className="mt-3">
                          <p className="text-muted-foreground text-xs">
                            Mục tiêu đầu ra
                          </p>

                          <p className="mt-1 text-sm">
                            {programInfo.outputGoal}
                          </p>
                        </div>

                        <div className="mt-3">
                          <p className="text-muted-foreground text-xs">
                            Kết quả test đầu vào
                          </p>

                          {programInfo.inputAssessmentUrl ? (
                            <Button
                              nativeButton={false}
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              render={
                                <a
                                  href={programInfo.inputAssessmentUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                />
                              }
                            >
                              <ExternalLink />
                              Mở kết quả test
                            </Button>
                          ) : (
                            <p className="mt-1 text-sm">Chưa có</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {enrollment.specialRequirements ? (
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Yêu cầu riêng
                    </p>

                    <p className="mt-1 text-sm">
                      {enrollment.specialRequirements}
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
