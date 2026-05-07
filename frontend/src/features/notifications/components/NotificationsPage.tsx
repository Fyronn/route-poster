import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Trash2,
  XCircle,
} from "lucide-react";

import { notificationsMockData } from "../data/notification.mock";
import type { NotificationType } from "../types/notification.types";

function NotificationIcon({ type }: { type: NotificationType }) {
  if (type === "warning") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
        <AlertTriangle className="h-5 w-5" />
      </div>
    );
  }

  if (type === "info") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <Info className="h-5 w-5" />
      </div>
    );
  }

  if (type === "success") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
        <CheckCircle2 className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
      <XCircle className="h-5 w-5" />
    </div>
  );
}

export function NotificationsPage() {
  const unreadCount = notificationsMockData.filter((item) => item.isUnread).length;
  const urgentCount = notificationsMockData.filter((item) => item.isUrgent).length;
  const todayCount = notificationsMockData.length;

  return (
    <div className="min-h-full bg-slate-50 px-6 py-7">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Stay updated with system alerts and important notifications
        </p>

        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-50">
            Mark All as Read
          </button>

          <button className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-slate-50">
            <Trash2 className="h-4 w-4" />
            Clear All
          </button>
        </div>
      </div>

      <div
        className="mb-6"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        <div className="flex h-[104px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <Bell className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Unread</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {unreadCount}
            </p>
          </div>
        </div>

        <div className="flex h-[104px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Urgent</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {urgentCount}
            </p>
          </div>
        </div>

        <div className="flex h-[104px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Info className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Today</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {todayCount}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="mb-8 text-base font-semibold text-slate-950">
          Notification Center
        </h2>

        <div className="mb-8 inline-flex rounded-xl bg-slate-100 p-1">
          <button className="h-8 rounded-lg bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm">
            All ({notificationsMockData.length})
          </button>

          <button className="h-8 rounded-lg px-3 text-sm font-semibold text-slate-950">
            Unread ({unreadCount})
          </button>

          <button className="h-8 rounded-lg px-3 text-sm font-semibold text-slate-950">
            Alerts
          </button>
        </div>

        <div className="space-y-4">
          {notificationsMockData.map((notification) => (
            <div
              key={notification.id}
              className={[
                "rounded-lg border px-4 py-4",
                notification.isUnread
                  ? "border-teal-500 bg-teal-50/40"
                  : "border-slate-200 bg-slate-50",
              ].join(" ")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: "84px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <NotificationIcon type={notification.type} />

                <div>
                  <div
                    className="mb-1"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <h3 className="text-sm font-semibold text-slate-950">
                      {notification.title}
                    </h3>

                    {notification.isUnread && (
                      <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-500">
                    {notification.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {notification.timeAgo}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  flexShrink: 0,
                }}
              >
                {notification.isUnread && (
                  <button className="text-sm font-semibold text-slate-950 hover:text-teal-700">
                    Mark Read
                  </button>
                )}

                <button className="text-slate-950 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}