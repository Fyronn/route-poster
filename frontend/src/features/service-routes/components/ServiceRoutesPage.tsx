import { Clock, MapPin, MoreVertical, Plus } from "lucide-react";

import { serviceRoutesMockData } from "../data/service-route.mock";

export function ServiceRoutesPage() {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Manage routes and schedules across all clients
        </p>

        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
          <Plus className="h-4 w-4" />
          Create Route
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        {serviceRoutesMockData.map((route) => (
          <div
            key={route.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
            style={{
              height: "322px",
              padding: "24px",
            }}
          >
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  {route.name}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {route.clientName}
                </p>
              </div>

              <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                {route.status}
              </span>
            </div>

            <div className="mt-9 mb-5 grid grid-cols-2 gap-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-slate-500" />

                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {route.stops}
                  </p>
                  <p className="text-xs text-slate-500">Stops</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-4 w-4 text-slate-500" />

                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {route.durationMinutes} min
                  </p>
                  <p className="text-xs text-slate-500">Duration</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Distance</p>
                <p className="text-sm font-semibold text-slate-950">
                  {route.distanceKm} km
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Active Riders</p>
                <p className="text-sm font-semibold text-slate-950">
                  {route.activeRiders}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Frequency</p>
                <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                  {route.frequency}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button className="h-9 flex-1 rounded-md border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-950 hover:bg-slate-100">
                View Details
              </button>

              <button className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}