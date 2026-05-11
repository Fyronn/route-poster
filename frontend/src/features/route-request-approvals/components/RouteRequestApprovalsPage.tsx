import { Check, Eye, RefreshCcw, Route, X } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import type { RouteRequestApproval } from "../types";

export function RouteRequestApprovalsPage({
  approvals,
}: {
  approvals: RouteRequestApproval[];
}) {
  const selected = approvals[0];

  return (
    <PageSection
      description="Şirket yöneticilerinden gelen rota isteklerini operasyon kararı verecek şekilde değerlendirin."
      eyebrow="Admin Approval"
      title="Route Request Approvals"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard
          hint="Rota seviyesinde gelen karar işi"
          icon={Route}
          label="Toplam İstek"
          value={approvals.length}
        />
        <MetricCard
          hint="Operasyon ekibi bekliyor"
          icon={Route}
          label="Talep Edildi"
          value={approvals.filter((approval) => approval.status === "requested").length}
        />
        <MetricCard
          hint="Gerçek rota oluşturulabilir"
          icon={Check}
          label="Onaylı"
          value={approvals.filter((approval) => approval.status === "approved").length}
        />
        <MetricCard
          hint="Şirket yöneticisine geri dönecek"
          icon={RefreshCcw}
          label="Revizyon"
          value={
            approvals.filter((approval) => approval.status === "revision_requested")
              .length
          }
        />
      </div>

      <div className="grid gap-5 2xl:grid-cols-[1fr_420px]">
        <TableShell
          description="Başlangıç, bitiş, duraklar, çalışan sayısı ve tahmini süre rota kararını destekler."
          searchPlaceholder="Client, rota veya lokasyon ara..."
          title="Rota Onay Kuyruğu"
        >
          <table className="w-full min-w-[1300px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Client / Rota
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Başlangıç
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Bitiş
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Duraklar
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tahmin
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                  Aksiyon
                </th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={approval.id}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {approval.routeName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {approval.clientName} · {approval.requestedBy}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {approval.startPoint}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {approval.endPoint}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {approval.stopCount} durak / {approval.employeeCount} çalışan
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {approval.estimatedDistanceKm} km ·{" "}
                    {approval.estimatedDurationMin} dk
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={approval.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="success">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary">
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="danger">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>

        {selected ? (
          <Card className="h-fit p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-teal-700">
                  Detay Görüntüle
                </p>
                <h2 className="mt-2 font-semibold text-slate-950">
                  {selected.routeName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.clientName}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Operasyon Tahmini
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {selected.estimatedDistanceKm} km,{" "}
                  {selected.estimatedDurationMin} dk, {selected.stopCount} durak
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Araç Önerisi
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {selected.vehicleSuggestion}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Duraklar
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Kozyatağı", "Ümraniye", "FSM", "Maslak"].map((stop) => (
                    <Badge key={stop} variant="neutral">
                      {stop}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="success">
                  Onayla
                </Button>
                <Button size="sm" variant="secondary">
                  Revizyon
                </Button>
                <Button size="sm" variant="danger">
                  Reddet
                </Button>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </PageSection>
  );
}
