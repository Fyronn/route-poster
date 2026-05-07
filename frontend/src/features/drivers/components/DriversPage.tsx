import { ChevronDown, MoreVertical, Phone, Plus, Star } from "lucide-react";

import { driversMockData } from "../data/driver.mock";

export function DriversPage() {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Manage drivers and monitor their activity
        </p>

        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
          <Plus className="h-4 w-4" />
          Add Driver
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <button className="flex h-10 w-48 items-center justify-between rounded-md border border-slate-100 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm">
          All Statuses
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="mb-8 text-base font-semibold text-slate-950">
          Driver Roster
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pl-2 text-left text-sm font-semibold text-slate-950">
                  Driver ID
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Name
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Contact
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Current Vehicle
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Trips Today
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Rating
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  License Expiry
                </th>
                <th className="pb-3 text-right text-sm font-semibold text-slate-950" />
              </tr>
            </thead>

            <tbody>
              {driversMockData.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="py-4 pl-2 text-sm font-semibold text-slate-950">
                    {driver.id}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {driver.name}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-950">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {driver.contact}
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                      {driver.status}
                    </span>
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {driver.currentVehicle}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {driver.tripsToday}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-950">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {driver.rating}
                    </div>
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {driver.licenseExpiry}
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