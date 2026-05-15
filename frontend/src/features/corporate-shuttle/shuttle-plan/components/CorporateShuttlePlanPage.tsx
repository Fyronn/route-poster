"use client";

import { Eye, MapPin, Route, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

import type { ShuttlePlanSummary } from "../types";

export function CorporateShuttlePlanPage({
  plan,
}: {
  clientId: number;
  plan: ShuttlePlanSummary;
}) {
  return (
    <PageSection
      action={
        <Button variant="secondary">
          <Eye className="h-4 w-4" />
          Plani Incele
        </Button>
      }
      description="Servis yoneticisinin olusturdugu calisan, durak ve rota taleplerinin servis plani ozeti."
      eyebrow="Servis Yonetimi"
      title="Servis Plani"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard
          hint="Plan kapsamindaki calisan"
          icon={Users}
          label="Calisan"
          value={plan.employeeCount}
        />
        <MetricCard
          hint="Onerilen durak noktasi"
          icon={MapPin}
          label="Durak"
          value={plan.stopCount}
        />
        <MetricCard
          hint="Plan icindeki rota talebi"
          icon={Route}
          label="Rota Talebi"
          value={plan.routeRequestCount}
        />
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Durum</p>
          <div className="mt-3">
            <StatusBadge status={plan.status} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {plan.submittedAt ? formatDate(plan.submittedAt) : "Rota talepleri direkt onaya duser"}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            description="Admin onayindan sonra talepler operasyon rotasina aktarilir."
            title="Plan Rota Ozeti"
          />
          <CardContent className="space-y-4">
            {plan.routes.map((route) => (
              <div
                className="rounded-2xl border border-slate-200 p-4"
                key={route.routeId}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {route.routeName || "-"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {route.startPoint || "-"} - {route.endPoint || "-"}
                    </p>
                  </div>
                  <StatusBadge status={route.status || "requested"} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                  <span>{route.employeeCount || 0} calisan</span>
                  <span>{route.stopCount || 0} durak</span>
                  <span>{route.estimatedDurationMinutes || 0} dk tahmini sure</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-slate-950">Plan Bilgisi</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-slate-500">Client</p>
              <p className="mt-1 font-semibold text-slate-950">
                {plan.clientName}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Gonderen Yonetici</p>
              <p className="mt-1 font-semibold text-slate-950">
                {plan.managerName}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Admin Aksiyonu</p>
              <p className="mt-1 text-slate-700">
                Rota talebi olusturuldugunda direkt admin onay ekranina duser.
                Admin talebi onaylar veya zorunlu red sebebiyle reddeder.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageSection>
  );
}
