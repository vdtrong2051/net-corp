import { Card, CardContent } from "@/components/ui/card";
import type {
  AuditActorRole,
  StudentProfile360,
} from "@/modules/students/model/student.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

const roleLabels: Record<AuditActorRole, string> = {
  OWNER: "Chủ trung tâm",
  MANAGER: "Quản lý",
  STAFF: "Nhân viên",
};

const actionLabels: Record<string, string> = {
  CREATE_STUDENT: "Tạo học viên",
  CREATE_ENROLLMENT: "Tạo ghi danh",
  CREATE_MIXED_ENROLLMENT: "Tạo ghi danh hỗn hợp",
  SUBMIT_ENROLLMENT: "Gửi duyệt",
  RETURN_ENROLLMENT: "Trả lại ghi danh",
  APPROVE_ENROLLMENT: "Duyệt ghi danh",
  COMPLETE_ENROLLMENT: "Hoàn tất ghi danh",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

type StudentAuditHistoryProps = {
  profile: StudentProfile360;
};

export function StudentAuditHistory({ profile }: StudentAuditHistoryProps) {
  const events = [...profile.auditHistory].sort(
    (a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)
  );

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Chưa có lịch sử thay đổi</p>

        <p className="text-muted-foreground mt-1 text-sm">
          Hồ sơ chưa có sự kiện audit nào.
        </p>
      </div>
    );
  }

  return (
    <div className="relative ml-2 border-l pl-6">
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.id} className="relative">
            <span className="bg-background border-primary absolute top-5 -left-[31px] size-3 rounded-full border-2" />

            <Card>
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {actionLabels[event.action] ?? event.action}
                    </p>

                    <p className="text-muted-foreground mt-1 text-sm">
                      {event.description}
                    </p>
                  </div>

                  <StatusBadge tone="neutral">
                    {roleLabels[event.actorRole]}
                  </StatusBadge>
                </div>

                <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  <span>{event.actorName}</span>

                  <span>{formatDateTime(event.occurredAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
