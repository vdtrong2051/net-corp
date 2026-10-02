import { staffDashboardMock } from "@/modules/dashboard/data/dashboard.mock";
import { DashboardActivity } from "@/modules/dashboard/ui/dashboard-activity";
import { DashboardKpiCard } from "@/modules/dashboard/ui/dashboard-kpi-card";
import { DashboardQuickActions } from "@/modules/dashboard/ui/dashboard-quick-actions";
import { DashboardWorkQueue } from "@/modules/dashboard/ui/dashboard-work-queue";
import { PageContainer } from "@/shared/ui/layout/page-container";

export function StaffDashboard() {
  const dashboard = staffDashboardMock;

  return (
    <PageContainer
      title={dashboard.title}
      description={dashboard.description}
    >
      <div className="flex flex-col gap-6">
        <section
          aria-label="Chỉ số công việc"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {dashboard.kpis.map((kpi) => (
            <DashboardKpiCard
              key={kpi.id}
              kpi={kpi}
            />
          ))}
        </section>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
          <section
            aria-label={dashboard.primaryQueue.title}
            className="min-w-0"
          >
            <DashboardWorkQueue
              queue={dashboard.primaryQueue}
              maxItems={5}
            />
          </section>

          <aside className="grid min-w-0 content-start gap-6">
            {dashboard.quickActions?.length ? (
              <DashboardQuickActions
                actions={dashboard.quickActions}
              />
            ) : null}

            {dashboard.recentActivity?.length ? (
              <DashboardActivity
                items={dashboard.recentActivity}
              />
            ) : null}
          </aside>
        </div>

        {dashboard.secondaryQueues?.length ? (
          <section
            aria-label="Công việc khác"
            className="grid min-w-0 gap-6 lg:grid-cols-2"
          >
            {dashboard.secondaryQueues.map((queue) => (
              <DashboardWorkQueue
                key={queue.id}
                queue={queue}
                maxItems={5}
              />
            ))}
          </section>
        ) : null}
      </div>
    </PageContainer>
  );
}