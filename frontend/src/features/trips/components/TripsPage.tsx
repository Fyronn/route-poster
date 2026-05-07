import { Calendar, ChevronDown, Filter, Plus } from "lucide-react";

import { tripsMockData } from "../data/trip.mock";

export function TripsPage() {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6">
      <div className="mb-7">
        <p className="text-sm text-slate-500">
          Manage and schedule trips across all routes
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="flex h-10 min-w-[160px] items-center justify-between rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm">
            All Statuses
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button className="flex h-10 min-w-[160px] items-center justify-between rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm">
            All Routes
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm">
            <Calendar className="h-4 w-4" />
            Today: May 6, 2026
          </button>

          <button className="flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
            <Plus className="h-4 w-4" />
            Schedule Trip
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <h2 className="mb-6 text-base font-semibold text-slate-950">
          Trip Schedule
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Trip ID
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Route
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Vehicle
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Driver
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Current Stop
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  ETA
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Riders
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Delay
                </th>
              </tr>
            </thead>

            <tbody>
              {tripsMockData.map((trip) => {
                const riderPercent = Math.round(
                  (trip.riders.current / trip.riders.capacity) * 100
                );

                return (
                  <tr
                    key={trip.id}
                    className="border-b border-slate-200 last:border-0"
                  >
                    <td className="py-3 text-sm font-medium text-slate-950">
                      {trip.id}
                    </td>

                    <td className="py-3 text-sm text-slate-950">
                      {trip.route}
                    </td>

                    <td className="py-3 text-sm text-slate-950">
                      {trip.vehicle}
                    </td>

                    <td className="py-3 text-sm text-slate-950">
                      {trip.driver}
                    </td>

                    <td className="py-3">
                      <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900">
                        {trip.status}
                      </span>
                    </td>

                    <td className="py-3 text-sm text-slate-950">
                      {trip.currentStop}
                    </td>

                    <td className="py-3 text-sm text-slate-950">
                      {trip.eta}
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="min-w-[42px] text-sm text-slate-900">
                          {trip.riders.current}/{trip.riders.capacity}
                        </span>

                        <div className="h-2 w-14 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-700"
                            style={{ width: `${riderPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3">
                      <span className="inline-flex rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-900">
                        {trip.delayMinutes === 0
                          ? "On Time"
                          : `+${trip.delayMinutes} min`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}