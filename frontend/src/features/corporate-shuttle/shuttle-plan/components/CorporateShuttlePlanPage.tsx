import { Eye, Route, Send, Users, MapPin } from "lucide-react";

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
  plan: ShuttlePlanSummary;
}) {
  return (
    <PageSection
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary">
            <Eye className="h-4 w-4" />
            Planı İncele
          </Button>
          <Button>
            <Send className="h-4 w-4" />
            ABC Turizm&apos;e Gönder
          </Button>
        </div>
      }
      description="Şirket yöneticisinin hazırladığı çalışan, durak ve rota taleplerinin servis planı özeti."
      eyebrow="Corporate Shuttle"
      title="Shuttle Plan"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard
          hint="Plan kapsamındaki çalışan"
          icon={Users}
          label="Çalışan"
          value={plan.employeeCount}
        />
        <MetricCard
          hint="Önerilen durak noktası"
          icon={MapPin}
          label="Durak"
          value={plan.stopCount}
        />
        <MetricCard
          hint="Plan içindeki rota talebi"
          icon={Route}
          label="Rota Talebi"
          value={plan.routeRequestCount}
        />
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-500">Gönderim Durumu</p>
          <div className="mt-3">
            <StatusBadge status={plan.status} />
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {plan.submittedAt ? formatDate(plan.submittedAt) : "Henüz gönderilmedi"}
          </p>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            description="Admin onayından sonra bu talepler gerçek service route kayıtlarına dönüşür."
            title="Plan Rota Özeti"
          />
          <CardContent className="space-y-4">
            {plan.routes.map((route) => (
              <div
                className="rounded-2xl border border-slate-200 p-4"
                key={route.id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {route.routeName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {route.startPoint} → {route.endPoint}
                    </p>
                  </div>
                  <StatusBadge status={route.status} />
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                  <span>{route.employeeCount} çalışan</span>
                  <span>{route.stopCount} durak</span>
                  <span>{route.estimatedDurationMin} dk tahmini süre</span>
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
              <p className="text-slate-500">Gönderen Yönetici</p>
              <p className="mt-1 font-semibold text-slate-950">
                {plan.managerName}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Admin Aksiyonu</p>
              <p className="mt-1 text-slate-700">
                Plan, shuttle plan requests ekranında onaylanır, reddedilir veya
                revizyon istenir.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageSection>
  );
}
