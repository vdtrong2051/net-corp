import { ownerDashboardMock } from "@/modules/dashboard/data/dashboard.mock";
import { DashboardActivity } from "@/modules/dashboard/ui/dashboard-activity";
import { DashboardKpiCard } from "@/modules/dashboard/ui/dashboard-kpi-card";
import { DashboardSummary } from "@/modules/dashboard/ui/dashboard-summary";
import { DashboardWorkQueue } from "@/modules/dashboard/ui/dashboard-work-queue";
import { PageContainer } from "@/shared/ui/layout/page-container";

export function OwnerDashboard() {
  const dashboard = ownerDashboardMock;

  return (
    <PageContainer
      title={dashboard.title}
      description={dashboard.description}
    >
      <div className="flex flex-col gap-6">
        <section
          aria-label="Chỉ số tổng quan"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboard.kpis.map((kpi) => (
            <DashboardKpiCard
              key={kpi.id}
              kpi={kpi}
            />
          ))}
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section
            aria-label={dashboard.primaryQueue.title}
            className="min-w-0"
          >
            <DashboardWorkQueue
              queue={dashboard.primaryQueue}
              maxItems={6}
            />
          </section>

          <aside className="grid min-w-0 content-start gap-6">
            {dashboard.summary?.length ? (
              <DashboardSummary
                title="Tình hình trung tâm"
                items={dashboard.summary}
              />
            ) : null}

            {dashboard.recentActivity?.length ? (
              <DashboardActivity
                items={dashboard.recentActivity}
              />
            ) : null}
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}