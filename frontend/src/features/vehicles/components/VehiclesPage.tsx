import { ChevronDown, MoreVertical, Plus } from "lucide-react";

import { vehiclesMockData } from "../data/vehicle.mock";
import type { VehicleStatus } from "../types/vehicle.types";

function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const isMaintenance = status === "maintenance";

  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        isMaintenance
          ? "bg-red-600 text-white"
          : "border border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

export function VehiclesPage() {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Manage your fleet of vehicles and track their status
        </p>

        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
          <Plus className="h-4 w-4" />
          Add Vehicle
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <button className="flex h-10 w-48 items-center justify-between rounded-md border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm">
          All Statuses
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        <button className="flex h-10 w-48 items-center justify-between rounded-md border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm">
          All Types
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="mb-8 text-base font-semibold text-slate-950">
          Vehicle Fleet
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pl-2 text-left text-sm font-semibold text-slate-950">
                  Vehicle ID
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Type
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Capacity
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Driver
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Current Trip
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Location
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Last Maintenance
                </th>
                <th className="pb-3 text-right text-sm font-semibold text-slate-950" />
              </tr>
            </thead>

            <tbody>
              {vehiclesMockData.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="py-4 pl-2 text-sm font-semibold text-slate-950">
                    {vehicle.id}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.type}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.capacity}
                  </td>

                  <td className="py-4">
                    <VehicleStatusBadge status={vehicle.status} />
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.driver}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.currentTrip}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.location}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {vehicle.lastMaintenance}
                  </td>

                  <td className="py-4 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}