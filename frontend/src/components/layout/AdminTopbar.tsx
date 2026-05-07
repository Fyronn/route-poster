"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/live-operations": "Live Operations",
  "/admin/trips": "Trips",
  "/admin/clients": "Clients",
  "/admin/vehicles": "Vehicles",
  "/admin/drivers": "Drivers",
  "/admin/service-routes": "Routes",
  "/admin/riders": "Riders",
  "/admin/change-requests": "Change Requests",
  "/admin/reports": "Reports & Analytics",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
};

export function AdminTopbar() {
  const pathname = usePathname();

  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-2 md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search trips, routes, drivers..."
            className="w-[280px] border-none bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="relative">
          <Bell className="h-5 w-5 text-slate-900" />

          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
}