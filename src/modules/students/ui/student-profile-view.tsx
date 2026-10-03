"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  FileText,
  History,
  Mail,
  MapPin,
  Phone,
  School,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePaymentMockStore } from "@/modules/payments/service/payment-mock-store";
import { StudentPaymentLifecycle } from "@/modules/payments/ui/student-payment-lifecycle";

import type {
  EnrollmentHistoryStatus,
  ProgramCode,
  StudentProfile360,
  StudentSourceCategory,
  StudentStatus,
} from "@/modules/students/model/student.types";

import { StudentAuditHistory } from "@/modules/students/ui/student-audit-history";
import { StudentContractHistory } from "@/modules/students/ui/student-contract-history";
import { StudentCourseHistory } from "@/modules/students/ui/student-course-history";
import { StudentEnrollmentHistory } from "@/modules/students/ui/student-enrollment-history";

import {
  StatusBadge,
  type StatusTone,
} from "@/shared/ui/feedback/status-badge";
import { PageContainer } from "@/shared/ui/layout/page-container";

const programLabels: Record<ProgramCode, string> = {
  NET_HSK: "NET HSK",

  NET_ENGLISH: "NET English",
};

const sourceLabels: Record<StudentSourceCategory, string> = {
  MARKETING: "Marketing",

  EXTERNAL_RELATIONS: "Đối ngoại",

  SELF_SOURCED: "Tự kiếm",
};

const studentStatusLabels: Record<StudentStatus, string> = {
  ACTIVE: "Đang hoạt động",

  INACTIVE: "Ngừng hoạt động",
};

const studentStatusTones: Record<StudentStatus, StatusTone> = {
  ACTIVE: "success",

  INACTIVE: "neutral",
};

const enrollmentStatusLabels: Record<EnrollmentHistoryStatus, string> = {
  DRAFT: "Bản nháp",

  SUBMITTED: "Chờ duyệt",

  RETURNED: "Bị trả lại",

  APPROVED: "Đã duyệt",

  COMPLETED: "Hoàn tất",

  CANCELLED: "Đã hủy",
};

const enrollmentStatusTones: Record<EnrollmentHistoryStatus, StatusTone> = {
  DRAFT: "neutral",

  SUBMITTED: "pending",

  RETURNED: "danger",

  APPROVED: "success",

  COMPLETED: "success",

  CANCELLED: "neutral",
};

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getLatestEnrollment(profile: StudentProfile360) {
  return [...profile.enrollments].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )[0];
}

type InfoItemProps = {
  label: string;

  value?: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>

      <p className="mt-1 text-sm font-medium break-words">{value || "—"}</p>
    </div>
  );
}

type ProfileMetricProps = {
  label: string;

  value: string | number;

  description: string;
};

function ProfileMetric({ label, value, description }: ProfileMetricProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>

        <CardTitle className="text-xl">{value}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

type StudentProfileViewProps = {
  profile: StudentProfile360;
};

export function StudentProfileView({ profile }: StudentProfileViewProps) {
  const { student } = profile;

  /*
   * GĐ7.9:
   * Payment metric và Payment tab không
   * còn dùng profile.payments legacy.
   */
  const { payments } = usePaymentMockStore();

  const studentPayments = payments.filter(
    (payment) => payment.studentId === student.id
  );

  const confirmedPaymentTotal = studentPayments
    .filter((payment) => payment.status === "CONFIRMED")
    .reduce((total, payment) => total + payment.amount, 0);

  const latestEnrollment = getLatestEnrollment(profile);

  const latestPrograms = latestEnrollment
    ? Array.from(
        new Set(
          latestEnrollment.programs.map((programInfo) => programInfo.program)
        )
      )
    : [];

  return (
    <PageContainer
      title={student.fullName}
      description={`${student.studentCode} · Hồ sơ học viên 360°`}
      actions={
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/students" />}
        >
          <ArrowLeft />
          Danh sách học viên
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone={studentStatusTones[student.status]}>
            {studentStatusLabels[student.status]}
          </StatusBadge>

          {latestPrograms.map((program) => (
            <StatusBadge key={program} tone="info">
              {programLabels[program]}
            </StatusBadge>
          ))}
        </div>

        <section
          aria-label="Tổng quan hồ sơ"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <ProfileMetric
            label="Lần ghi danh"
            value={profile.enrollments.length}
            description="Tổng số hồ sơ ghi danh"
          />

          <ProfileMetric
            label="Khóa học"
            value={profile.courses.length}
            description="Toàn bộ khóa trong lịch sử"
          />

          <ProfileMetric
            label="Đã xác nhận"
            value={formatCurrency(confirmedPaymentTotal)}
            description="Tính từ Payment CONFIRMED của GĐ7"
          />

          <ProfileMetric
            label="Hợp đồng"
            value={profile.contracts.length}
            description="Tổng số hợp đồng"
          />
        </section>

        <Tabs defaultValue="overview" className="min-w-0">
          <div className="overflow-x-auto pb-1">
            <TabsList variant="line" className="min-w-max">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>

              <TabsTrigger value="enrollments">
                <ClipboardList />
                Ghi danh ({profile.enrollments.length})
              </TabsTrigger>

              <TabsTrigger value="courses">
                <BookOpen />
                Khóa học ({profile.courses.length})
              </TabsTrigger>

              <TabsTrigger value="payments">
                <WalletCards />
                Thanh toán ({studentPayments.length})
              </TabsTrigger>

              <TabsTrigger value="contracts">
                <FileText />
                Hợp đồng ({profile.contracts.length})
              </TabsTrigger>

              <TabsTrigger value="audit">
                <History />
                Audit ({profile.auditHistory.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-4">
            <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
              <div className="grid min-w-0 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>

                    <CardDescription>
                      Student master của học viên.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                      <InfoItem label="Họ và tên" value={student.fullName} />

                      <InfoItem
                        label="Ngày sinh"
                        value={formatDate(student.dateOfBirth)}
                      />

                      <InfoItem label="Số CCCD" value={student.citizenId} />

                      <InfoItem
                        label="Ngày cấp CCCD"
                        value={formatDate(student.citizenIdIssuedDate)}
                      />

                      <InfoItem
                        label="Mã học viên"
                        value={student.studentCode}
                      />

                      <InfoItem
                        label="Ngày tạo hồ sơ"
                        value={formatDate(student.createdAt)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Liên hệ và học tập</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="flex min-w-0 gap-3">
                        <Phone className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <InfoItem label="Số điện thoại" value={student.phone} />
                      </div>

                      <div className="flex min-w-0 gap-3">
                        <Mail className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <InfoItem label="Email" value={student.email} />
                      </div>

                      <div className="flex min-w-0 gap-3 md:col-span-2">
                        <MapPin className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <InfoItem
                          label="Nơi ở hiện nay / nơi nhận hợp đồng"
                          value={student.currentAddress}
                        />
                      </div>

                      <div className="flex min-w-0 gap-3 md:col-span-2">
                        <School className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <InfoItem label="Trường học" value={student.school} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nguồn học viên</CardTitle>

                    <CardDescription>
                      Nguồn data ban đầu của học viên.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-5 md:grid-cols-2">
                      <InfoItem
                        label="Nhóm nguồn"
                        value={sourceLabels[student.source.category]}
                      />

                      <InfoItem
                        label="Chi tiết"
                        value={student.source.detail}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <aside className="grid min-w-0 content-start gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ghi danh gần nhất</CardTitle>

                    <CardDescription>
                      Hồ sơ ghi danh mới nhất của học viên.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {latestEnrollment ? (
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">
                            {latestEnrollment.enrollmentCode}
                          </p>

                          <StatusBadge
                            tone={
                              enrollmentStatusTones[latestEnrollment.status]
                            }
                          >
                            {enrollmentStatusLabels[latestEnrollment.status]}
                          </StatusBadge>
                        </div>

                        <InfoItem
                          label="Sale phụ trách"
                          value={latestEnrollment.salesName}
                        />

                        <InfoItem
                          label="Ngày tạo"
                          value={formatDate(latestEnrollment.createdAt)}
                        />

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Chương trình và mục tiêu
                          </p>

                          <div className="mt-2 flex flex-col gap-3">
                            {latestEnrollment.programs.map((programInfo) => (
                              <div
                                key={programInfo.program}
                                className="rounded-lg border p-3"
                              >
                                <StatusBadge tone="info">
                                  {programLabels[programInfo.program]}
                                </StatusBadge>

                                <p className="mt-2 text-sm">
                                  {programInfo.outputGoal}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {latestEnrollment.specialRequirements ? (
                          <InfoItem
                            label="Yêu cầu riêng"
                            value={latestEnrollment.specialRequirements}
                          />
                        ) : null}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Học viên chưa có hồ sơ ghi danh.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tình trạng hồ sơ</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-4">
                      <InfoItem
                        label="Cập nhật gần nhất"
                        value={formatDate(student.updatedAt)}
                      />

                      <InfoItem
                        label="Số sự kiện audit"
                        value={String(profile.auditHistory.length)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>

          <TabsContent value="enrollments" className="mt-4">
            <StudentEnrollmentHistory profile={profile} />
          </TabsContent>

          <TabsContent value="courses" className="mt-4">
            <StudentCourseHistory profile={profile} />
          </TabsContent>

          <TabsContent value="payments" className="mt-4">
            <StudentPaymentLifecycle studentId={student.id} />
          </TabsContent>

          <TabsContent value="contracts" className="mt-4">
            <StudentContractHistory profile={profile} />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <StudentAuditHistory profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
