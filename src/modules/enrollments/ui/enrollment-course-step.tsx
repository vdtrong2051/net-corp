"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { courseCatalogMock } from "@/modules/courses/data/course-catalog.mock";
import {
  courseDeliveryModeLabels,
  courseProgramLabels,
  courseTrackLabels,
  type CourseCatalogItem,
} from "@/modules/courses/model/course.types";
import type {
  EnrollmentItemClassMode,
  EnrollmentItemDraft,
  EnrollmentProgramSelection,
} from "@/modules/enrollments/model/enrollment.types";
import {
  buildScholarshipSelection,
  buildVoucherSelection,
  calculateFinalTuition,
  scholarshipOptions,
  voucherOptions,
} from "@/modules/enrollments/service/enrollment-pricing";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

/*
 * ============================================================
 * CLASS MOCK
 *
 * Module Classes thật nằm ở GĐ11.
 *
 * Hiện chỉ mock một số lớp để Course Builder có UX:
 * "Đã có lớp" hoặc "Thời gian dự kiến".
 * ============================================================
 */

const classOptionsByCourse: Record<string, string[]> = {
  "course-small-group-ielts-foundation": ["FOUND.13", "FOUND.14"],

  "course-small-group-ielts-4-5": ["IELTS45-A01"],

  "course-small-group-hsk-1-3-0": ["HSK1-A01"],

  "course-small-group-hsk-3-3-0": ["HSK3-A01"],

  "course-small-group-hsk-4-3-0": ["HSK4-A01"],

  "course-one-to-one-english-foundation": ["1TO1-EF-09"],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function getScholarshipOptionId(item: EnrollmentItemDraft) {
  return item.scholarship?.id ?? "NONE";
}

function getVoucherOptionCode(item: EnrollmentItemDraft) {
  return item.voucher?.code ?? "NONE";
}

function getClassModeLabel(mode: EnrollmentItemClassMode) {
  return mode === "CLASS" ? "Đã có lớp" : "Chưa có lớp";
}

type EnrollmentCourseStepProps = {
  programs: EnrollmentProgramSelection[];

  value: EnrollmentItemDraft[];

  onChange: (value: EnrollmentItemDraft[]) => void;
};

export function EnrollmentCourseStep({
  programs,
  value,
  onChange,
}: EnrollmentCourseStepProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const selectedProgramCodes = useMemo(
    () => new Set(programs.map((item) => item.program)),
    [programs]
  );

  const availableCourses = useMemo(
    () =>
      courseCatalogMock.filter((course) =>
        selectedProgramCodes.has(course.program)
      ),
    [selectedProgramCodes]
  );

  const selectedCourse = useMemo(
    () => availableCourses.find((course) => course.id === selectedCourseId),
    [availableCourses, selectedCourseId]
  );

  function updateItem(itemId: string, patch: Partial<EnrollmentItemDraft>) {
    onChange(
      value.map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  }

  function addCourse() {
    if (!selectedCourse) {
      toast.error("Chưa chọn khóa học");

      return;
    }

    const duplicated = value.some(
      (item) => item.courseCatalogId === selectedCourse.id
    );

    if (duplicated) {
      toast.error("Khóa học đã được thêm", {
        description: selectedCourse.name,
      });

      return;
    }

    const item: EnrollmentItemDraft = {
      id: `enrollment-item-${crypto.randomUUID()}`,

      courseCatalogId: selectedCourse.id,

      program: selectedCourse.program,

      track: selectedCourse.track,

      deliveryMode: selectedCourse.deliveryMode,

      courseName: selectedCourse.name,

      classMode: "EXPECTED_START",

      classCode: undefined,

      expectedStart: undefined,

      baseTuition: selectedCourse.baseTuition,

      scholarship: undefined,

      voucher: undefined,

      finalTuition: selectedCourse.baseTuition,
    };

    onChange([...value, item]);

    setSelectedCourseId("");

    toast.success("Đã thêm khóa học", {
      description: selectedCourse.name,
    });
  }

  function removeCourse(itemId: string) {
    onChange(value.filter((item) => item.id !== itemId));
  }

  function changeClassMode(
    item: EnrollmentItemDraft,
    mode: EnrollmentItemClassMode
  ) {
    updateItem(item.id, {
      classMode: mode,

      classCode: mode === "CLASS" ? item.classCode : undefined,

      expectedStart: mode === "EXPECTED_START" ? item.expectedStart : undefined,
    });
  }

  function changeScholarship(item: EnrollmentItemDraft, optionId: string) {
    const scholarship = buildScholarshipSelection(optionId, item.baseTuition);

    const finalTuition = calculateFinalTuition({
      baseTuition: item.baseTuition,

      scholarship,

      voucher: item.voucher,
    });

    updateItem(item.id, {
      scholarship,
      finalTuition,
    });
  }

  function changeVoucher(item: EnrollmentItemDraft, voucherCode: string) {
    const voucher = buildVoucherSelection(voucherCode);

    const finalTuition = calculateFinalTuition({
      baseTuition: item.baseTuition,

      scholarship: item.scholarship,

      voucher,
    });

    updateItem(item.id, {
      voucher,
      finalTuition,
    });
  }

  function getCourseTriggerLabel(course?: CourseCatalogItem) {
    if (!course) {
      return "Chọn khóa học...";
    }

    return `${courseProgramLabels[course.program]} · ${course.name}`;
  }

  const totalBaseTuition = value.reduce(
    (total, item) => total + item.baseTuition,
    0
  );

  const totalFinalTuition = value.reduce(
    (total, item) => total + item.finalTuition,
    0
  );

  const totalDiscount = Math.max(totalBaseTuition - totalFinalTuition, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Khóa học</h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Thêm một hoặc nhiều khóa thuộc các chương trình đã chọn.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thêm khóa học</CardTitle>

          <CardDescription>
            Danh sách chỉ hiển thị khóa thuộc NET English / NET HSK đã chọn ở
            bước trước.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1">
              <Select
                value={selectedCourseId}
                onValueChange={(nextValue) =>
                  setSelectedCourseId(nextValue ?? "")
                }
              >
                <SelectTrigger className="w-full">
                  <span className="truncate text-left">
                    {getCourseTriggerLabel(selectedCourse)}
                  </span>
                </SelectTrigger>

                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {courseProgramLabels[course.program]} · {course.name} ·{" "}
                      {courseDeliveryModeLabels[course.deliveryMode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={addCourse}
              disabled={!selectedCourseId}
            >
              <Plus />
              Thêm khóa
            </Button>
          </div>
        </CardContent>
      </Card>

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">Chưa có khóa học</p>

          <p className="text-muted-foreground mt-1 text-sm">
            Thêm ít nhất một khóa để tiếp tục hồ sơ ghi danh.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {value.map((item, index) => {
            const classOptions =
              classOptionsByCourse[item.courseCatalogId] ?? [];

            const scholarshipId = getScholarshipOptionId(item);

            const voucherCode = getVoucherOptionCode(item);

            return (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle>
                          {index + 1}. {item.courseName}
                        </CardTitle>

                        <StatusBadge tone="info">
                          {courseProgramLabels[item.program]}
                        </StatusBadge>
                      </div>

                      <CardDescription className="mt-1">
                        {courseTrackLabels[item.track]} ·{" "}
                        {courseDeliveryModeLabels[item.deliveryMode]}
                      </CardDescription>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Xóa ${item.courseName}`}
                      onClick={() => removeCourse(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <label
                          htmlFor={`class-mode-${item.id}`}
                          className="text-sm font-medium"
                        >
                          Xếp lớp
                        </label>

                        <Select
                          value={item.classMode}
                          onValueChange={(nextValue) =>
                            changeClassMode(
                              item,
                              (nextValue ??
                                "EXPECTED_START") as EnrollmentItemClassMode
                            )
                          }
                        >
                          <SelectTrigger
                            id={`class-mode-${item.id}`}
                            className="w-full"
                          >
                            <span>{getClassModeLabel(item.classMode)}</span>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="CLASS">Đã có lớp</SelectItem>

                            <SelectItem value="EXPECTED_START">
                              Chưa có lớp
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {item.classMode === "CLASS" ? (
                        <div className="grid gap-2">
                          <label
                            htmlFor={`class-code-${item.id}`}
                            className="text-sm font-medium"
                          >
                            Lớp
                          </label>

                          {classOptions.length > 0 ? (
                            <Select
                              value={item.classCode ?? ""}
                              onValueChange={(nextValue) =>
                                updateItem(item.id, {
                                  classCode: nextValue ?? undefined,
                                })
                              }
                            >
                              <SelectTrigger
                                id={`class-code-${item.id}`}
                                className="w-full"
                              >
                                <span className="truncate">
                                  {item.classCode ?? "Chọn lớp..."}
                                </span>
                              </SelectTrigger>

                              <SelectContent>
                                {classOptions.map((classCode) => (
                                  <SelectItem key={classCode} value={classCode}>
                                    {classCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={`class-code-${item.id}`}
                              value={item.classCode ?? ""}
                              onChange={(event) =>
                                updateItem(item.id, {
                                  classCode: event.target.value,
                                })
                              }
                              placeholder="Nhập mã lớp"
                            />
                          )}

                          <p className="text-muted-foreground text-xs">
                            Danh sách lớp thật sẽ lấy từ module Classes ở GĐ11.
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          <label
                            htmlFor={`expected-start-${item.id}`}
                            className="text-sm font-medium"
                          >
                            Thời gian dự kiến
                          </label>

                          <Input
                            id={`expected-start-${item.id}`}
                            type="month"
                            value={item.expectedStart ?? ""}
                            onChange={(event) =>
                              updateItem(item.id, {
                                expectedStart: event.target.value,
                              })
                            }
                          />

                          <p className="text-muted-foreground text-xs">
                            Dùng khi chưa có lớp chính thức.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                          <label
                            htmlFor={`scholarship-${item.id}`}
                            className="text-sm font-medium"
                          >
                            Học bổng
                          </label>

                          <Select
                            value={scholarshipId}
                            onValueChange={(nextValue) =>
                              changeScholarship(item, nextValue ?? "NONE")
                            }
                          >
                            <SelectTrigger
                              id={`scholarship-${item.id}`}
                              className="w-full"
                            >
                              <span>
                                {scholarshipOptions.find(
                                  (option) => option.id === scholarshipId
                                )?.label ?? "Không học bổng"}
                              </span>
                            </SelectTrigger>

                            <SelectContent>
                              {scholarshipOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <label
                            htmlFor={`voucher-${item.id}`}
                            className="text-sm font-medium"
                          >
                            Voucher
                          </label>

                          <Select
                            value={voucherCode}
                            onValueChange={(nextValue) =>
                              changeVoucher(item, nextValue ?? "NONE")
                            }
                          >
                            <SelectTrigger
                              id={`voucher-${item.id}`}
                              className="w-full"
                            >
                              <span>
                                {voucherOptions.find(
                                  (option) => option.code === voucherCode
                                )?.label ?? "Không voucher"}
                              </span>
                            </SelectTrigger>

                            <SelectContent>
                              {voucherOptions.map((option) => (
                                <SelectItem
                                  key={option.code}
                                  value={option.code}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <p className="text-muted-foreground text-xs">
                            Voucher hiện là mock UI, chưa phải policy chính
                            thức.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg border p-4">
                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Học phí gốc
                          </p>

                          <p className="mt-1 font-medium tabular-nums">
                            {formatCurrency(item.baseTuition)}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Học bổng
                          </p>

                          <p className="mt-1 font-medium tabular-nums">
                            -
                            {formatCurrency(
                              item.scholarship?.discountAmount ?? 0
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Voucher
                          </p>

                          <p className="mt-1 font-medium tabular-nums">
                            -{formatCurrency(item.voucher?.discountAmount ?? 0)}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground text-xs">
                            Học phí cuối
                          </p>

                          <p className="mt-1 text-lg font-semibold tabular-nums">
                            {formatCurrency(item.finalTuition)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card>
            <CardHeader>
              <CardTitle>Tổng học phí</CardTitle>

              <CardDescription>
                Tổng của toàn bộ khóa trong Enrollment này.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs">Giá gốc</p>

                  <p className="mt-1 font-medium tabular-nums">
                    {formatCurrency(totalBaseTuition)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Tổng ưu đãi</p>

                  <p className="mt-1 font-medium tabular-nums">
                    -{formatCurrency(totalDiscount)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-xs">Học phí cuối</p>

                  <p className="mt-1 text-xl font-semibold tabular-nums">
                    {formatCurrency(totalFinalTuition)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
