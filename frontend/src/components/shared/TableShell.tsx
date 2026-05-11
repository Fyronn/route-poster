import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function TableShell({
  title,
  description,
  searchPlaceholder = "Ara...",
  filterLabel = "Filtrele",
  action,
  children,
}: {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  filterLabel?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm sm:w-72">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              placeholder={searchPlaceholder}
              type="search"
            />
          </label>
          <Button variant="secondary">
            <SlidersHorizontal className="h-4 w-4" />
            {filterLabel}
          </Button>
          {action}
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}
