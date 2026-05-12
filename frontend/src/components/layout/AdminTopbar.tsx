import { Bell, Search } from "lucide-react";
import type { AuthUser } from "@/features/auth/types";

export function AdminTopbar({ authUser }: { authUser: AuthUser }) {
  return (
    <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="lg:hidden">
        <p className="text-sm font-semibold text-slate-950">FleetFlow</p>
        <p className="text-xs text-slate-500">Admin Panel</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm md:flex">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            className="w-[320px] border-none bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-500"
            placeholder="Search clients, routes, trips..."
            type="text"
          />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-900 hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-900" />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            3
          </span>
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-950">
            {authUser.firstName} {authUser.lastName}
          </p>
          <p className="text-xs text-slate-500">
            {authUser.clientId ? `Kurum #${authUser.clientId}` : "ABC Turizm"}
          </p>
        </div>
      </div>
    </header>
  );
}
