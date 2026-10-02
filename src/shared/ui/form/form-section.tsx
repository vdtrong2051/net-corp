import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { typography } from "@/shared/config/typography";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-5", className)}>
      <div>
        <h2 className={typography.sectionTitle}>{title}</h2>

        {description ? (
          <p className={cn("mt-1", typography.muted)}>{description}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
