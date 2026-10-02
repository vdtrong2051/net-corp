import { notFound } from "next/navigation";

import { getStudentProfileMock } from "@/modules/students/data/student.mock";
import { StudentProfileView } from "@/modules/students/ui/student-profile-view";

type StudentProfilePageProps = {
  params: Promise<{
    studentId: string;
  }>;
};

export default async function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { studentId } = await params;

  const profile = getStudentProfileMock(studentId);

  if (!profile) {
    notFound();
  }

  return <StudentProfileView profile={profile} />;
}
