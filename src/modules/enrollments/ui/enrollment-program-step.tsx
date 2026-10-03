"use client";

import { BookOpen, Check, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { EnrollmentProgramSelection } from "@/modules/enrollments/model/enrollment.types";
import type { ProgramCode } from "@/modules/students/model/student.types";
import { StatusBadge } from "@/shared/ui/feedback/status-badge";

type ProgramOption = {
  program: ProgramCode;
  title: string;
  description: string;
};

const programOptions: ProgramOption[] = [
  {
    program: "NET_ENGLISH",
    title: "NET English",
    description: "IELTS, TOEIC, giao tiếp và các khóa tiếng Anh.",
  },
  {
    program: "NET_HSK",
    title: "NET HSK",
    description: "Các khóa tiếng Trung theo lộ trình HSK 3.0.",
  },
];

type EnrollmentProgramStepProps = {
  value: EnrollmentProgramSelection[];

  onChange: (value: EnrollmentProgramSelection[]) => void;
};

export function EnrollmentProgramStep({
  value,
  onChange,
}: EnrollmentProgramStepProps) {
  function isSelected(program: ProgramCode) {
    return value.some((item) => item.program === program);
  }

  function toggleProgram(program: ProgramCode) {
    if (isSelected(program)) {
      onChange(value.filter((item) => item.program !== program));

      return;
    }

    onChange([
      ...value,
      {
        program,
        inputAssessmentUrl: "",
        outputGoal: "",
      },
    ]);
  }

  function updateProgram(
    program: ProgramCode,
    patch: Partial<EnrollmentProgramSelection>
  ) {
    onChange(
      value.map((item) =>
        item.program === program
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Chọn chương trình
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Một hồ sơ ghi danh có thể chứa NET English, NET HSK hoặc cả hai.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {programOptions.map((option) => {
          const selected = isSelected(option.program);

          const Icon = option.program === "NET_ENGLISH" ? Languages : BookOpen;

          return (
            <Card
              key={option.program}
              className={selected ? "ring-primary/40 ring-2" : undefined}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="size-5" />
                    </div>

                    <div>
                      <CardTitle>{option.title}</CardTitle>

                      <CardDescription className="mt-1">
                        {option.description}
                      </CardDescription>
                    </div>
                  </div>

                  {selected ? (
                    <StatusBadge tone="success">Đã chọn</StatusBadge>
                  ) : null}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  type="button"
                  variant={selected ? "secondary" : "outline"}
                  className="w-full"
                  aria-pressed={selected}
                  onClick={() => toggleProgram(option.program)}
                >
                  {selected ? (
                    <>
                      <Check />
                      Bỏ chọn
                    </>
                  ) : (
                    <>
                      <Check />
                      Chọn chương trình
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="font-medium">Chưa chọn chương trình</p>

          <p className="text-muted-foreground mt-1 text-sm">
            Chọn ít nhất NET English hoặc NET HSK để tiếp tục hồ sơ ghi danh.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div>
            <h3 className="font-medium">Đầu vào và mục tiêu</h3>

            <p className="text-muted-foreground mt-1 text-sm">
              Khai báo riêng cho từng chương trình đã chọn.
            </p>
          </div>

          {value.map((programInfo) => {
            const title =
              programInfo.program === "NET_ENGLISH" ? "NET English" : "NET HSK";

            return (
              <Card key={programInfo.program}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <CardTitle>{title}</CardTitle>

                      <CardDescription>
                        Thông tin học thuật của chương trình này.
                      </CardDescription>
                    </div>

                    <StatusBadge tone="info">{title}</StatusBadge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <label
                        htmlFor={`input-${programInfo.program}`}
                        className="text-sm font-medium"
                      >
                        Kết quả / link test đầu vào
                      </label>

                      <Input
                        id={`input-${programInfo.program}`}
                        type="url"
                        value={programInfo.inputAssessmentUrl ?? ""}
                        onChange={(event) =>
                          updateProgram(programInfo.program, {
                            inputAssessmentUrl: event.target.value,
                          })
                        }
                        placeholder="https://..."
                      />

                      <p className="text-muted-foreground text-xs">
                        Có thể để trống khi lưu nháp. Trước khi gửi duyệt phải
                        hoàn thiện.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor={`goal-${programInfo.program}`}
                        className="text-sm font-medium"
                      >
                        Mục tiêu đầu ra
                      </label>

                      <Textarea
                        id={`goal-${programInfo.program}`}
                        value={programInfo.outputGoal}
                        onChange={(event) =>
                          updateProgram(programInfo.program, {
                            outputGoal: event.target.value,
                          })
                        }
                        placeholder={
                          programInfo.program === "NET_ENGLISH"
                            ? "VD: IELTS 6.5, TOEIC 750..."
                            : "VD: HSK 4, HSK 5..."
                        }
                        className="min-h-24"
                      />

                      <p className="text-muted-foreground text-xs">
                        Mục tiêu này gắn với lần ghi danh, không phải Student
                        master.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
