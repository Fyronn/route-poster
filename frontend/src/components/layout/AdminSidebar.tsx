"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bus, LogOut } from "lucide-react";

import { adminSidebarItems } from "@/config/admin-sidebar";
import { getAppAccessRole } from "@/features/auth/role-access";
import type { AuthUser } from "@/features/auth/types";
import { clearAuthSession } from "@/lib/auth-client";

function getInitials(user: AuthUser) {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "U";
}

export function AdminSidebar({ authUser }: { authUser: AuthUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentRole = getAppAccessRole(authUser);
  const sidebarItems = adminSidebarItems.filter(
    (item) =>
      currentRole !== "unknown" &&
      (item.roles.includes("all") || item.roles.includes(currentRole)),
  );

  function handleLogout() {
    clearAuthSession();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col bg-slate-950 text-white lg:flex">
      <div className="flex h-[64px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-400/10 text-teal-400">
          <Bus className="h-7 w-7" />
        </div>

        <div>
          <h1 className="text-base font-bold leading-none">FleetFlow</h1>
          <p className="mt-1 text-xs text-slate-400">Transport Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              className={[
                "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
                isActive
                  ? "bg-teal-500 text-white shadow-sm shadow-teal-950/30"
                  : "text-slate-100 hover:bg-slate-800",
              ].join(" ")}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white ring-4 ring-teal-400/20">
            {getInitials(authUser)}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {authUser.firstName} {authUser.lastName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {authUser.email}
            </p>
            <p className="mt-1 truncate text-[11px] font-semibold uppercase text-teal-300">
              {currentRole === "service-manager"
                ? "Servis sorumlusu"
                : currentRole === "admin"
                  ? "Admin"
                  : "Rol tanimsiz"}
            </p>
          </div>
          <button
            aria-label="Cikis yap"
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
