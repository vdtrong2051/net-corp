import type { EnrollmentDraft } from "@/modules/enrollments/model/enrollment.types";

const STORAGE_PREFIX = "net-corp:enrollment-draft:";

export function getEnrollmentDraftStorageKey(enrollmentId: string) {
  return `${STORAGE_PREFIX}${enrollmentId}`;
}

export function loadEnrollmentDraftFromStorage(
  enrollmentId: string
): unknown | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(
    getEnrollmentDraftStorageKey(enrollmentId)
  );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveEnrollmentDraftToStorage(enrollment: EnrollmentDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getEnrollmentDraftStorageKey(enrollment.id),
    JSON.stringify(enrollment)
  );
}

export function removeEnrollmentDraftFromStorage(enrollmentId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getEnrollmentDraftStorageKey(enrollmentId));
}
