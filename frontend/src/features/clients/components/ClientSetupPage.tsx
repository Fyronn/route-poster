import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDot, Clock3 } from "lucide-react";

import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn } from "@/lib/utils";

import type { Client, SetupChecklistItem } from "../types";

function getProgress(items: SetupChecklistItem[]) {
  const completed = items.filter((item) => item.status === "completed").length;
  return Math.round((completed / items.length) * 100);
}

export function ClientSetupPage({
  client,
  checklist,
}: {
  client: Client;
  checklist: SetupChecklistItem[];
}) {
  const progress = getProgress(checklist);

  return (
    <PageSection
      description="Client oluşturulduktan sonra corporate shuttle kurulum adımları buradan izlenir."
      title={`${client.name} Setup Checklist`}
    >
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Kurulum İlerlemesi
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              %{progress}
            </p>
          </div>
          <div className="w-full lg:max-w-xl">
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {checklist.length} adımdan{" "}
              {checklist.filter((item) => item.status === "completed").length}{" "}
              tanesi tamamlandı.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {checklist.map((item, index) => {
          const isCompleted = item.status === "completed";
          const isWaiting = item.status === "waiting";
          const Icon = isCompleted ? CheckCircle2 : isWaiting ? Clock3 : CircleDot;

          return (
            <Card className="p-5" key={item.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : isWaiting
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-500",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold uppercase text-slate-400">
                        Adım {index + 1}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h2 className="mt-2 font-semibold text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.href ? (
                  <Link
                    className={buttonVariants({
                      variant: isCompleted ? "secondary" : "primary",
                      className: "shrink-0",
                    })}
                    href={item.href}
                  >
                    Adıma Git
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </PageSection>
  );
}
