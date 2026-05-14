import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  const displayValue =
    typeof value === "number" && !Number.isFinite(value) ? 0 : value;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {displayValue}
          </p>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
