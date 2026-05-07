import {
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

import { changeRequestsMockData } from "../data/change-request.mock";
import type {
  ChangeRequestPriority,
  ChangeRequestStatus,
} from "../types/change-request.types";

function PriorityBadge({ priority }: { priority: ChangeRequestPriority }) {
  const isHigh = priority === "high priority";

  return (
    <span
      className={[
        "inline-flex h-[22px] items-center rounded-md px-2 text-xs font-semibold",
        isHigh ? "bg-red-600 text-white" : "bg-slate-100 text-slate-950",
      ].join(" ")}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: ChangeRequestStatus }) {
  return (
    <span className="inline-flex h-[22px] items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
      {status}
    </span>
  );
}

export function ChangeRequestsPage() {
  const pendingCount = changeRequestsMockData.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = changeRequestsMockData.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = changeRequestsMockData.filter(
    (item) => item.status === "rejected"
  ).length;

  const pendingRequests = changeRequestsMockData.filter(
    (item) => item.status === "pending"
  );

  return (
    <div className="min-h-full bg-slate-50 px-6 py-7">
      <p className="mb-7 text-sm text-slate-500">
        Review and approve route modification requests from clients
      </p>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="flex h-[102px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Clock3 className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {pendingCount}
            </p>
          </div>
        </div>

        <div className="flex h-[102px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Approved</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {approvedCount}
            </p>
          </div>
        </div>

        <div className="flex h-[102px] items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <XCircle className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Rejected</p>
            <p className="mt-1 text-2xl font-bold leading-none text-slate-950">
              {rejectedCount}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="mb-7 text-base font-semibold text-slate-950">
          Route Change Requests
        </h2>

        <div className="mb-8 inline-flex rounded-xl bg-slate-100 p-1">
          <button className="h-8 rounded-lg bg-white px-3 text-sm font-semibold text-slate-950 shadow-sm">
            Pending ({pendingCount})
          </button>

          <button className="h-8 rounded-lg px-3 text-sm font-semibold text-slate-950">
            Approved ({approvedCount})
          </button>

          <button className="h-8 rounded-lg px-3 text-sm font-semibold text-slate-950">
            All Requests
          </button>
        </div>

        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-slate-200 bg-white px-6 py-6"
            >
              <div className="flex items-start justify-between gap-8">
                <div className="min-w-0">
                  <div className="mb-5 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-500" />

                    <span className="text-base font-semibold text-slate-950">
                      {request.id}
                    </span>

                    <PriorityBadge priority={request.priority} />
                    <StatusBadge status={request.status} />
                  </div>

                  <div>
                    <p className="text-base font-semibold text-slate-950">
                      {request.clientName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {request.routeName}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-950">
                      {request.requestType}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {request.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-5 text-sm text-slate-500">
                    <span>Requested by: {request.requestedBy}</span>
                    <span>Date: {request.date}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <button className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>

                  <button className="inline-flex h-9 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800">
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}