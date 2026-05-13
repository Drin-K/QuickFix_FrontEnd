import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { routePaths } from "@/routes/routePaths";
import {
  adminService,
  type AdminDashboardStats,
  type AdminRecentActivity,
} from "@/services/admin.service";
import { clearAuthSession } from "@/utils/auth";

type DashboardStateProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  tone?: "default" | "error";
};

type KpiCard = {
  label: string;
  value: number;
  meta: string;
  tone: "neutral" | "warning" | "success";
};

const numberFormatter = new Intl.NumberFormat("en-US");

const formatNumber = (value: number) => numberFormatter.format(value);

const formatActivityDate = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const buildKpiCards = (stats: AdminDashboardStats): KpiCard[] => [
  {
    label: "Total providers",
    value: stats.totalProviders,
    meta: "All provider profiles",
    tone: "neutral",
  },
  {
    label: "Pending providers",
    value: stats.pendingProviders,
    meta: "Waiting for review",
    tone: "warning",
  },
  {
    label: "Verified providers",
    value: stats.verifiedProviders,
    meta: "Approved provider profiles",
    tone: "success",
  },
  {
    label: "Pending documents",
    value: stats.pendingDocuments,
    meta: "Documents in admin queue",
    tone: "warning",
  },
  {
    label: "Active services",
    value: stats.activeServices,
    meta: "Visible marketplace services",
    tone: "success",
  },
  {
    label: "Clients",
    value: stats.clientsCount,
    meta: "Registered client accounts",
    tone: "neutral",
  },
];

const AdminDashboardState = ({
  title,
  description,
  action,
  tone = "default",
}: DashboardStateProps) => (
  <AdminLayout>
    <section className="section admin-dashboard">
      <div className="container">
        <div
          className={
            tone === "error"
              ? "admin-dashboard-state admin-dashboard-state--error"
              : "admin-dashboard-state"
          }
          aria-live="polite"
        >
          <span className="eyebrow">Admin dashboard</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {action ? (
            <button className="button" type="button" onClick={action.onClick}>
              {action.label}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  </AdminLayout>
);

const ActivityMeta = ({ activity }: { activity: AdminRecentActivity }) => {
  const formattedDate = formatActivityDate(activity.occurredAt);
  const metaItems = [
    activity.type,
    activity.status,
    activity.actor,
    formattedDate,
  ].filter(Boolean);

  if (metaItems.length === 0) {
    return null;
  }

  return (
    <div className="admin-activity-item__meta">
      {metaItems.map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  );
};

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage("Only admins can open the dashboard.");
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Dashboard statistics could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <AdminDashboardState
        description="Fetching provider, document, service, and client metrics from the backend."
        title="Loading dashboard stats."
      />
    );
  }

  if (errorMessage || !stats) {
    return (
      <AdminDashboardState
        action={{
          label: "Try again",
          onClick: () => {
            void loadStats();
          },
        }}
        description={errorMessage ?? "The dashboard endpoint did not return statistics."}
        title="Dashboard could not be loaded."
        tone="error"
      />
    );
  }

  const kpiCards = buildKpiCards(stats);
  const primarySummary =
    stats.pendingProviders + stats.pendingDocuments > 0
      ? "Review pending provider and document items first."
      : "Queues look clear. Keep monitoring new activity.";

  return (
    <AdminLayout>
      <section className="section admin-dashboard">
        <div className="container">
          <div className="workspace-hero admin-dashboard__hero">
            <div>
              <span className="eyebrow">Admin dashboard</span>
              <h1>System overview.</h1>
              <p>
                Track marketplace health, provider verification, client growth, and
                recent operational activity from one admin view.
              </p>
            </div>

            <aside className="workspace-summary-card admin-dashboard__summary">
              <span>Current focus</span>
              <strong>{primarySummary}</strong>
              <p>
                {formatNumber(stats.pendingProviders)} providers and{" "}
                {formatNumber(stats.pendingDocuments)} documents are waiting for action.
              </p>
            </aside>
          </div>

          <div className="admin-kpi-grid" aria-label="Admin key performance indicators">
            {kpiCards.map((card) => (
              <article
                className={`admin-kpi-card admin-kpi-card--${card.tone}`}
                key={card.label}
              >
                <span>{card.label}</span>
                <strong>{formatNumber(card.value)}</strong>
                <p>{card.meta}</p>
              </article>
            ))}
          </div>

          <section className="admin-activity-panel" aria-labelledby="recent-activity-title">
            <div className="admin-activity-panel__header">
              <div>
                <span className="eyebrow">Recent activity</span>
                <h2 id="recent-activity-title">Latest system updates</h2>
              </div>
              <span>{formatNumber(stats.recentActivity.length)} item(s)</span>
            </div>

            {stats.recentActivity.length === 0 ? (
              <div className="admin-activity-empty">
                <strong>No recent activity yet.</strong>
                <p>New provider, document, service, and client events will appear here.</p>
              </div>
            ) : (
              <ul className="admin-activity-list">
                {stats.recentActivity.map((activity, index) => (
                  <li className="admin-activity-item" key={activity.id}>
                    <span className="admin-activity-item__marker">{index + 1}</span>
                    <div>
                      <h3>{activity.title}</h3>
                      {activity.description ? <p>{activity.description}</p> : null}
                      <ActivityMeta activity={activity} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </AdminLayout>
  );
};
