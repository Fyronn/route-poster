"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus } from "lucide-react";

import { adminSidebarItems } from "@/config/admin-sidebar";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col bg-slate-950 text-white">
      <div className="flex h-[64px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg text-teal-400">
          <Bus className="h-7 w-7" />
        </div>

        <div>
          <h1 className="text-base font-bold leading-none">FleetFlow</h1>
          <p className="mt-1 text-xs text-slate-400">Transport Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {adminSidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-teal-500 text-white"
                  : "text-slate-100 hover:bg-slate-800",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white">
            AM
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">Admin User</p>
            <p className="truncate text-xs text-slate-400">
              admin@fleetflow.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}