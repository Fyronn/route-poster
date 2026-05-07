import { Building2, MoreVertical, Plus } from "lucide-react";

import { clientsMockData } from "../data/client.mock";

export function ClientsPage() {
  return (
    <div className="min-h-full bg-slate-50 px-6 py-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Manage client organizations and their transportation needs
        </p>

        <button className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      <div
        className="mb-6"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "16px",
        }}
      >
        {clientsMockData.map((client) => (
          <div
            key={client.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
            style={{
              height: "225px",
              padding: "24px",
            }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Building2 className="h-6 w-6" />
              </div>

              <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                {client.status}
              </span>
            </div>

            <h2 className="mb-3 text-lg font-semibold text-slate-950">
              {client.name}
            </h2>

            <p className="mb-6 text-sm text-slate-500">{client.type}</p>

            <div className="flex items-center gap-6">
              <div>
                <p className="mb-1 text-sm text-slate-500">Routes</p>
                <p className="text-sm font-semibold text-slate-950">
                  {client.routeCount}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-slate-500">Riders</p>
                <p className="text-sm font-semibold text-slate-950">
                  {client.riderCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <h2 className="mb-7 text-base font-semibold text-slate-950">
          All Clients
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 pl-2 text-left text-sm font-semibold text-slate-950">
                  Client ID
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Name
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Type
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Routes
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Active Riders
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Contact Person
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Contact Email
                </th>
                <th className="pb-3 text-left text-sm font-semibold text-slate-950">
                  Status
                </th>
                <th className="pb-3 text-right text-sm font-semibold text-slate-950" />
              </tr>
            </thead>

            <tbody>
              {clientsMockData.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="py-4 pl-2 text-sm font-medium text-slate-950">
                    {client.id}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {client.name}
                  </td>

                  <td className="py-4">
                    <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                      {client.type}
                    </span>
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {client.routeCount}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {client.riderCount}
                  </td>

                  <td className="py-4 text-sm text-slate-950">
                    {client.contactPerson}
                  </td>

                  <td className="py-4 text-sm text-slate-500">
                    {client.contactEmail}
                  </td>

                  <td className="py-4">
                    <span className="inline-flex h-6 items-center rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-900">
                      {client.status}
                    </span>
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