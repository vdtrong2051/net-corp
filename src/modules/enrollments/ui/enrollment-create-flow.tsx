"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Save,
  Send,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  enrollmentDraftsMock,
  enrollmentSalesOptionsMock,
} from "@/modules/enrollments/data/enrollment.mock";
import type {
  EnrollmentContractDraft,
  EnrollmentDraft,
  EnrollmentItemDraft,
  EnrollmentPaymentPlan,
  EnrollmentProgramSelection,
} from "@/modules/enrollments/model/enrollment.types";
import {
  loadEnrollmentDraftFromStorage,
  removeEnrollmentDraftFromStorage,
  saveEnrollmentDraftToStorage,
} from "@/modules/enrollments/service/enrollment-draft-storage";
import { EnrollmentCommercialStep } from "@/modules/enrollments/ui/enrollment-commercial-step";
import { EnrollmentCourseStep } from "@/modules/enrollments/ui/enrollment-course-step";
import { EnrollmentProgramStep } from "@/modules/enrollments/ui/enrollment-program-step";
import {
  EnrollmentReviewStep,
  type EnrollmentReviewIssue,
} from "@/modules/enrollments/ui/enrollment-review-step";
import { EnrollmentStudentSelector } from "@/modules/enrollments/ui/enrollment-student-selector";
import {
  enrollmentSaveDraftSchema,
  enrollmentSubmitSchema,
} from "@/modules/enrollments/validation/enrollment.schema";
import type { StudentListItem } from "@/modules/students/model/student.types";
import { StudentFormDialog } from "@/modules/students/ui/student-form-dialog";
import type { StudentFormValues } from "@/modules/students/validation/student.schema";
import { PageContainer } from "@/shared/ui/layout/page-container";

type EnrollmentCreateFlowProps = {
  initialStudents: StudentListItem[];

  initialEnrollment?: EnrollmentDraft;
};

type CreateStep = 1 | 2 | 3 | 4 | 5;

type DraftIdentity = {
  id: string;

  enrollmentCode: string;

  createdAt: string;
};

function normalizePhone(value: string) {
  const compact = value.replace(/[\s.-]/g, "");

  if (compact.startsWith("+84")) {
    return `0${compact.slice(3)}`;
  }

  return compact;
}

function findDuplicateStudent(
  students: StudentListItem[],
  values: StudentFormValues
) {
  const citizenId = values.citizenId.trim();

  const phone = normalizePhone(values.phone);

  const email = values.email.trim().toLowerCase();

  for (const student of students) {
    if (student.citizenId.trim() === citizenId) {
      return "CCCD";
    }

    if (normalizePhone(student.phone) === phone) {
      return "số điện thoại";
    }

    if (student.email.trim().toLowerCase() === email) {
      return "email";
    }
  }

  return null;
}

function generateStudentCode(students: StudentListItem[]) {
  const year = new Date().getFullYear();

  const prefix = `HV-${year}-`;

  const maxNumber = students.reduce((max, student) => {
    if (!student.studentCode.startsWith(prefix)) {
      return max;
    }

    const value = Number.parseInt(student.studentCode.slice(prefix.length), 10);

    if (Number.isNaN(value)) {
      return max;
    }

    return Math.max(max, value);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;
}

function getNextEnrollmentCode() {
  const year = new Date().getFullYear();

  const prefix = `ENR-${year}-`;

  const maxNumber = enrollmentDraftsMock.reduce((max, enrollment) => {
    if (!enrollment.enrollmentCode.startsWith(prefix)) {
      return max;
    }

    const value = Number.parseInt(
      enrollment.enrollmentCode.slice(prefix.length),
      10
    );

    if (Number.isNaN(value)) {
      return max;
    }

    return Math.max(max, value);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(4, "0")}`;
}

function buildStudentFromForm(
  students: StudentListItem[],
  values: StudentFormValues
): StudentListItem {
  const now = new Date().toISOString();

  return {
    id: `student-${crypto.randomUUID()}`,

    studentCode: generateStudentCode(students),

    fullName: values.fullName.trim(),

    dateOfBirth: values.dateOfBirth,

    citizenId: values.citizenId.trim(),

    citizenIdIssuedDate: values.citizenIdIssuedDate,

    phone: values.phone.trim(),

    email: values.email.trim().toLowerCase(),

    currentAddress: values.currentAddress.trim(),

    school: values.school?.trim() || undefined,

    source: {
      category: values.sourceCategory,

      detail: values.sourceDetail.trim(),
    },

    status: values.status,

    createdAt: now,

    updatedAt: now,

    latestPrograms: [],

    latestEnrollmentStatus: undefined,

    latestEnrollmentAt: undefined,

    assignedSalesName: undefined,
  };
}

function getIssueStep(path: PropertyKey[]): EnrollmentReviewIssue["step"] {
  const root = String(path[0] ?? "");

  if (root === "studentId") {
    return 1;
  }

  if (root === "programs") {
    return 2;
  }

  if (root === "items") {
    return 3;
  }

  return 4;
}

function mapValidationIssues(
  issues: Array<{
    path: PropertyKey[];

    message: string;
  }>
): EnrollmentReviewIssue[] {
  return issues.map((issue) => ({
    step: getIssueStep(issue.path),

    message: issue.message,
  }));
}

function isCoursePlacementComplete(item: EnrollmentItemDraft) {
  if (item.classMode === "CLASS") {
    return Boolean(item.classCode?.trim());
  }

  return Boolean(item.expectedStart?.trim());
}

function isPaymentPlanComplete(enrollment: EnrollmentDraft) {
  return enrollment.items.every((item) => {
    const plan = enrollment.paymentPlan.items.find(
      (candidate) => candidate.enrollmentItemId === item.id
    );

    if (!plan || plan.lines.length === 0) {
      return false;
    }

    const total = plan.lines.reduce((sum, line) => sum + line.amount, 0);

    return total === item.finalTuition;
  });
}

function getResumeStep(enrollment?: EnrollmentDraft): CreateStep {
  if (!enrollment) {
    return 1;
  }

  if (
    enrollment.programs.length === 0 ||
    enrollment.programs.some(
      (program) =>
        !program.inputAssessmentUrl?.trim() || !program.outputGoal.trim()
    )
  ) {
    return 2;
  }

  if (
    enrollment.items.length === 0 ||
    enrollment.items.some((item) => !isCoursePlacementComplete(item))
  ) {
    return 3;
  }

  if (
    !isPaymentPlanComplete(enrollment) ||
    !enrollment.salesPersonId?.trim() ||
    !enrollment.specialRequirements?.trim() ||
    !enrollment.contract?.documentUrl?.trim()
  ) {
    return 4;
  }

  return 5;
}

type StepIndicatorProps = {
  step: number;

  currentStep: CreateStep;

  title: string;
};

function StepIndicator({ step, currentStep, title }: StepIndicatorProps) {
  const completed = step < currentStep;

  const active = step === currentStep;

  return (
    <div
      className={[
        "rounded-lg border p-3 transition-colors",

        active ? "border-primary/40 bg-primary/5" : "",

        completed ? "bg-muted/40" : "",

        step > currentStep ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-2">
        {completed ? (
          <CheckCircle2 className="text-primary size-4 shrink-0" />
        ) : (
          <span className="text-muted-foreground text-xs font-medium">
            {step}
          </span>
        )}

        <p className="text-xs font-medium">{title}</p>
      </div>

      {active ? (
        <p className="text-muted-foreground mt-1 text-xs">Đang thực hiện</p>
      ) : null}
    </div>
  );
}

export function EnrollmentCreateFlow({
  initialStudents,
  initialEnrollment,
}: EnrollmentCreateFlowProps) {
  const isEditing = Boolean(initialEnrollment);

  const initialStudent = initialEnrollment
    ? (initialStudents.find(
        (student) => student.id === initialEnrollment.studentId
      ) ?? null)
    : null;

  const [students, setStudents] = useState<StudentListItem[]>(
    () => initialStudents
  );

  const [selectedStudent, setSelectedStudent] =
    useState<StudentListItem | null>(() => initialStudent);

  const [programs, setPrograms] = useState<EnrollmentProgramSelection[]>(
    () => initialEnrollment?.programs ?? []
  );

  const [items, setItems] = useState<EnrollmentItemDraft[]>(
    () => initialEnrollment?.items ?? []
  );

  const [paymentPlan, setPaymentPlan] = useState<EnrollmentPaymentPlan>(
    () =>
      initialEnrollment?.paymentPlan ?? {
        items: [],
      }
  );

  const [salesPersonId, setSalesPersonId] = useState<string | undefined>(
    () => initialEnrollment?.salesPersonId
  );

  const [specialRequirements, setSpecialRequirements] = useState(
    () => initialEnrollment?.specialRequirements ?? ""
  );

  const [contract, setContract] = useState<EnrollmentContractDraft | undefined>(
    () => initialEnrollment?.contract
  );

  const [currentStep, setCurrentStep] = useState<CreateStep>(() =>
    getResumeStep(initialEnrollment)
  );

  const [createStudentOpen, setCreateStudentOpen] = useState(false);

  const [reviewIssues, setReviewIssues] = useState<EnrollmentReviewIssue[]>([]);

  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  const draftIdentityRef = useRef<DraftIdentity | null>(
    initialEnrollment
      ? {
          id: initialEnrollment.id,

          enrollmentCode: initialEnrollment.enrollmentCode,

          createdAt: initialEnrollment.createdAt,
        }
      : null
  );

  /*
   * ============================================================
   * RESTORE MOCK DRAFT
   * ============================================================
   */
  useEffect(() => {
    if (!initialEnrollment) {
      return;
    }

    const stored = loadEnrollmentDraftFromStorage(initialEnrollment.id);

    if (!stored) {
      return;
    }

    const parsed = enrollmentSaveDraftSchema.safeParse(stored);

    if (!parsed.success) {
      removeEnrollmentDraftFromStorage(initialEnrollment.id);

      return;
    }

    const saved = parsed.data;

    if (saved.id !== initialEnrollment.id) {
      return;
    }

    const savedStudent = initialStudents.find(
      (student) => student.id === saved.studentId
    );

    if (!savedStudent) {
      return;
    }

    const restoredDraft = saved as EnrollmentDraft;

    /*
     * Không setState đồng bộ trực tiếp
     * trong effect.
     *
     * Restore được đẩy sang task kế tiếp,
     * tránh react-hooks/set-state-in-effect.
     */
    const timeoutId = window.setTimeout(() => {
      setSelectedStudent(savedStudent);

      setPrograms(restoredDraft.programs);

      setItems(restoredDraft.items);

      setPaymentPlan(restoredDraft.paymentPlan);

      setSalesPersonId(restoredDraft.salesPersonId);

      setSpecialRequirements(restoredDraft.specialRequirements ?? "");

      setContract(restoredDraft.contract);

      draftIdentityRef.current = {
        id: restoredDraft.id,

        enrollmentCode: restoredDraft.enrollmentCode,

        createdAt: restoredDraft.createdAt,
      };

      setCurrentStep(getResumeStep(restoredDraft));

      setRestoredFromStorage(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [initialEnrollment, initialStudents]);

  function ensureDraftIdentity() {
    if (draftIdentityRef.current) {
      return draftIdentityRef.current;
    }

    const identity: DraftIdentity = {
      id: `enrollment-${crypto.randomUUID()}`,

      enrollmentCode: getNextEnrollmentCode(),

      createdAt: new Date().toISOString(),
    };

    draftIdentityRef.current = identity;

    return identity;
  }

  function resetEnrollmentData() {
    setPrograms([]);

    setItems([]);

    setPaymentPlan({
      items: [],
    });

    setSalesPersonId(undefined);

    setSpecialRequirements("");

    setContract(undefined);

    setReviewIssues([]);
  }

  function handleSelectStudent(student: StudentListItem) {
    if (selectedStudent && selectedStudent.id !== student.id) {
      resetEnrollmentData();
    }

    setSelectedStudent(student);

    toast.success("Đã chọn học viên", {
      description: `${student.studentCode} · ${student.fullName}`,
    });
  }

  function handleCreateStudent(values: StudentFormValues) {
    const duplicateField = findDuplicateStudent(students, values);

    if (duplicateField) {
      toast.error("Không thể tạo học viên", {
        description: `Đã tồn tại học viên có ${duplicateField} này.`,
      });

      return;
    }

    const newStudent = buildStudentFromForm(students, values);

    setStudents((current) => [newStudent, ...current]);

    setSelectedStudent(newStudent);

    resetEnrollmentData();

    setCreateStudentOpen(false);

    setCurrentStep(2);

    toast.success("Đã tạo và chọn học viên", {
      description: `${newStudent.studentCode} · ${newStudent.fullName}`,
    });
  }

  function handleProgramsChange(nextPrograms: EnrollmentProgramSelection[]) {
    const nextProgramCodes = new Set(nextPrograms.map((item) => item.program));

    const remainingItems = items.filter((item) =>
      nextProgramCodes.has(item.program)
    );

    const remainingItemIds = new Set(remainingItems.map((item) => item.id));

    setItems(remainingItems);

    setPaymentPlan((current) => ({
      items: current.items.filter((plan) =>
        remainingItemIds.has(plan.enrollmentItemId)
      ),
    }));

    setPrograms(nextPrograms);

    setReviewIssues([]);
  }

  function handleItemsChange(nextItems: EnrollmentItemDraft[]) {
    const nextItemById = new Map(nextItems.map((item) => [item.id, item]));

    const previousItemById = new Map(items.map((item) => [item.id, item]));

    setPaymentPlan((current) => ({
      items: current.items.filter((plan) => {
        const nextItem = nextItemById.get(plan.enrollmentItemId);

        const previousItem = previousItemById.get(plan.enrollmentItemId);

        if (!nextItem || !previousItem) {
          return false;
        }

        return nextItem.finalTuition === previousItem.finalTuition;
      }),
    }));

    setItems(nextItems);

    setReviewIssues([]);
  }

  function buildEnrollmentDraft(
    status: "DRAFT" | "SUBMITTED"
  ): EnrollmentDraft | null {
    if (!selectedStudent) {
      return null;
    }

    const identity = ensureDraftIdentity();

    const now = new Date().toISOString();

    const selectedSale = enrollmentSalesOptionsMock.find(
      (sale) => sale.id === salesPersonId
    );

    return {
      id: identity.id,

      enrollmentCode: identity.enrollmentCode,

      studentId: selectedStudent.id,

      programs,

      items,

      paymentPlan,

      salesPersonId,

      salesName: selectedSale?.name,

      specialRequirements: specialRequirements.trim() || undefined,

      contract,

      status,

      createdAt: identity.createdAt,

      updatedAt: now,

      submittedAt: status === "SUBMITTED" ? now : undefined,
    };
  }

  function handleSaveDraft() {
    if (!selectedStudent) {
      toast.error("Chưa chọn học viên", {
        description: "Chọn Student trước khi lưu nháp.",
      });

      return;
    }

    const draft = buildEnrollmentDraft("DRAFT");

    if (!draft) {
      return;
    }

    const result = enrollmentSaveDraftSchema.safeParse(draft);

    if (!result.success) {
      const firstIssue = result.error.issues[0];

      toast.error("Không thể lưu nháp", {
        description: firstIssue?.message ?? "Dữ liệu nháp không hợp lệ.",
      });

      return;
    }

    saveEnrollmentDraftToStorage(draft);

    setReviewIssues([]);

    toast.success("Đã lưu nháp", {
      description: `${draft.enrollmentCode} đã được lưu trong mock storage của trình duyệt.`,
    });
  }

  function handleSubmit() {
    if (!selectedStudent) {
      toast.error("Chưa chọn học viên");

      setCurrentStep(1);

      return;
    }

    const draft = buildEnrollmentDraft("SUBMITTED");

    if (!draft) {
      return;
    }

    const result = enrollmentSubmitSchema.safeParse(draft);

    if (!result.success) {
      const issues = mapValidationIssues(result.error.issues);

      setReviewIssues(issues);

      setCurrentStep(5);

      toast.error("Hồ sơ chưa đủ điều kiện gửi duyệt", {
        description: `Còn ${issues.length} vấn đề cần hoàn thiện.`,
      });

      return;
    }

    setReviewIssues([]);

    /*
     * Draft không còn cần restore
     * sau khi đã Submit thành công.
     */
    removeEnrollmentDraftFromStorage(draft.id);

    toast.success("Hồ sơ hợp lệ", {
      description: `${draft.enrollmentCode} đã mô phỏng chuyển sang trạng thái Chờ duyệt.`,
    });
  }

  function goToProgramStep() {
    if (!selectedStudent) {
      toast.error("Chưa chọn học viên");

      return;
    }

    setCurrentStep(2);
  }

  function goToCourseStep() {
    if (programs.length === 0) {
      toast.error("Chưa chọn chương trình", {
        description: "Chọn ít nhất NET English hoặc NET HSK.",
      });

      return;
    }

    setCurrentStep(3);
  }

  function goToCommercialStep() {
    if (items.length === 0) {
      toast.error("Chưa có khóa học", {
        description: "Thêm ít nhất một khóa học.",
      });

      return;
    }

    setCurrentStep(4);
  }

  function goToReviewStep() {
    setReviewIssues([]);

    setCurrentStep(5);
  }

  function handleEditStep(step: 1 | 2 | 3 | 4) {
    setReviewIssues([]);

    setCurrentStep(step);
  }

  return (
    <>
      <PageContainer
        title={isEditing ? "Tiếp tục ghi danh" : "Tạo ghi danh"}
        description={
          isEditing
            ? `${initialEnrollment?.enrollmentCode ?? ""} · tiếp tục hoàn thiện hồ sơ nháp.`
            : "Tạo hồ sơ ghi danh mới cho học viên."
        }
        actions={
          <>
            {selectedStudent && currentStep !== 5 ? (
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                <Save />
                Lưu nháp
              </Button>
            ) : null}

            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/enrollments" />}
            >
              <ArrowLeft />
              Danh sách ghi danh
            </Button>
          </>
        }
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
          {isEditing ? (
            <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
              <div>
                <p className="text-xs font-medium">Hồ sơ nháp</p>

                <p className="mt-1 text-sm font-semibold">
                  {initialEnrollment?.enrollmentCode}
                </p>
              </div>

              {restoredFromStorage ? (
                <p className="text-muted-foreground text-xs">
                  Đã khôi phục bản lưu gần nhất trên trình duyệt.
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Đang dùng dữ liệu mock gốc.
                </p>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <StepIndicator
              step={1}
              currentStep={currentStep}
              title="Học viên"
            />

            <StepIndicator
              step={2}
              currentStep={currentStep}
              title="Chương trình"
            />

            <StepIndicator
              step={3}
              currentStep={currentStep}
              title="Khóa học"
            />

            <StepIndicator
              step={4}
              currentStep={currentStep}
              title="Thanh toán"
            />

            <StepIndicator step={5} currentStep={currentStep} title="Review" />
          </div>

          {currentStep === 1 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Chọn học viên</CardTitle>

                  <CardDescription>
                    Tìm Student đã có trong hệ thống hoặc tạo mới ngay trong
                    luồng ghi danh.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <EnrollmentStudentSelector
                    students={students}
                    selectedStudentId={selectedStudent?.id}
                    onSelect={handleSelectStudent}
                    onCreateStudent={() => setCreateStudentOpen(true)}
                  />
                </CardContent>
              </Card>

              {selectedStudent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <CheckCircle2 className="size-5" />
                      </div>

                      <div>
                        <CardTitle>Học viên đã chọn</CardTitle>

                        <CardDescription>
                          Enrollment mới sẽ được gắn với Student này.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Mã học viên
                        </p>

                        <p className="mt-1 font-medium">
                          {selectedStudent.studentCode}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">Họ tên</p>

                        <p className="mt-1 font-medium">
                          {selectedStudent.fullName}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">
                          Số điện thoại
                        </p>

                        <p className="mt-1 font-medium">
                          {selectedStudent.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>

                        <p className="mt-1 font-medium break-all">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/30 mt-5 rounded-lg border p-4">
                      <div className="flex gap-3">
                        <UserRound className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                        <div>
                          <p className="text-sm font-medium">Nguồn học viên</p>

                          <p className="text-muted-foreground mt-1 text-sm">
                            {selectedStudent.source.detail}
                          </p>

                          <p className="text-muted-foreground mt-1 text-xs">
                            Nguồn Student được giữ nguyên, không bị ghi đè bởi
                            lần ghi danh.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="button"
                  disabled={!selectedStudent}
                  onClick={goToProgramStep}
                >
                  Tiếp tục
                  <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {currentStep === 2 ? (
            <>
              {selectedStudent ? (
                <Card size="sm">
                  <CardContent>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Học viên
                        </p>

                        <p className="mt-1 font-medium">
                          {selectedStudent.studentCode} ·{" "}
                          {selectedStudent.fullName}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                      >
                        Đổi học viên
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardContent>
                  <EnrollmentProgramStep
                    value={programs}
                    onChange={handleProgramsChange}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft />
                  Quay lại
                </Button>

                <Button
                  type="button"
                  disabled={programs.length === 0}
                  onClick={goToCourseStep}
                >
                  Tiếp tục đến khóa học
                  <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {currentStep === 3 ? (
            <>
              {selectedStudent ? (
                <Card size="sm">
                  <CardContent>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          Hồ sơ đang tạo
                        </p>

                        <p className="mt-1 font-medium">
                          {selectedStudent.studentCode} ·{" "}
                          {selectedStudent.fullName}
                        </p>

                        <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-2 text-xs">
                          {programs.map((program) => (
                            <span key={program.program}>
                              {program.program === "NET_ENGLISH"
                                ? "NET English"
                                : "NET HSK"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(2)}
                      >
                        Sửa chương trình
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardContent>
                  <EnrollmentCourseStep
                    programs={programs}
                    value={items}
                    onChange={handleItemsChange}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <ArrowLeft />
                  Quay lại
                </Button>

                <Button
                  type="button"
                  disabled={items.length === 0}
                  onClick={goToCommercialStep}
                >
                  Tiếp tục thanh toán
                  <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {currentStep === 4 && selectedStudent ? (
            <>
              <Card size="sm">
                <CardContent>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Hồ sơ đang tạo
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedStudent.studentCode} ·{" "}
                        {selectedStudent.fullName}
                      </p>

                      <p className="text-muted-foreground mt-1 text-xs">
                        {items.length} khóa học
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(3)}
                    >
                      Sửa khóa học
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <EnrollmentCommercialStep
                    student={selectedStudent}
                    items={items}
                    paymentPlan={paymentPlan}
                    onPaymentPlanChange={(value) => {
                      setPaymentPlan(value);

                      setReviewIssues([]);
                    }}
                    salesPersonId={salesPersonId}
                    onSalesPersonIdChange={(value) => {
                      setSalesPersonId(value);

                      setReviewIssues([]);
                    }}
                    specialRequirements={specialRequirements}
                    onSpecialRequirementsChange={(value) => {
                      setSpecialRequirements(value);

                      setReviewIssues([]);
                    }}
                    contract={contract}
                    onContractChange={(value) => {
                      setContract(value);

                      setReviewIssues([]);
                    }}
                  />
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  <ArrowLeft />
                  Quay lại
                </Button>

                <Button type="button" onClick={goToReviewStep}>
                  Review hồ sơ
                  <ArrowRight />
                </Button>
              </div>
            </>
          ) : null}

          {currentStep === 5 && selectedStudent ? (
            <>
              <EnrollmentReviewStep
                student={selectedStudent}
                programs={programs}
                items={items}
                paymentPlan={paymentPlan}
                salesPersonId={salesPersonId}
                specialRequirements={specialRequirements}
                contract={contract}
                issues={reviewIssues}
                onEditStep={handleEditStep}
              />

              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(4)}
                >
                  <ArrowLeft />
                  Quay lại
                </Button>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                  >
                    <Save />
                    Lưu nháp
                  </Button>

                  <Button type="button" onClick={handleSubmit}>
                    <Send />
                    Gửi duyệt
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </PageContainer>

      <StudentFormDialog
        open={createStudentOpen}
        mode="create"
        student={null}
        onOpenChange={setCreateStudentOpen}
        onSubmit={handleCreateStudent}
      />
    </>
  );
}
