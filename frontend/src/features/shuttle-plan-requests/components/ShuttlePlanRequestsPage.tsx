import { Check, Eye, RefreshCcw, Send, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
import { formatDate } from "@/lib/utils";

import type { ShuttlePlanRequest } from "../types";

export function ShuttlePlanRequestsPage({
  requests,
}: {
  requests: ShuttlePlanRequest[];
}) {
  return (
    <PageSection
      description="Şirket yöneticilerinin ABC Turizm onayına gönderdiği servis planlarını inceleyin."
      eyebrow="Admin Approval"
      title="Shuttle Plan Requests"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard
          hint="İnceleme kuyruğundaki planlar"
          icon={Send}
          label="Toplam Talep"
          value={requests.length}
        />
        <MetricCard
          hint="Admin kararı bekliyor"
          icon={Send}
          label="Bekleyen"
          value={requests.filter((request) => request.status === "submitted").length}
        />
        <MetricCard
          hint="Operasyona aktarılmaya hazır"
          icon={Check}
          label="Onaylı"
          value={requests.filter((request) => request.status === "approved").length}
        />
        <MetricCard
          hint="Şirket yöneticisine geri dönecek"
          icon={RefreshCcw}
          label="Revizyon"
          value={
            requests.filter((request) => request.status === "revision_requested")
              .length
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <TableShell
          description="Onayla, reddet veya revizyon iste aksiyonları plan seviyesinde kurgulanır."
          searchPlaceholder="Client veya gönderen ara..."
          title="Plan Talepleri"
        >
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Gönderen
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Plan Özeti
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
              {requests.map((request) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={request.id}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {request.clientName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(request.submittedAt)}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.submittedBy}
                  </td>
                  <td className="px-5 py-4">
                    <p className="max-w-md text-sm text-slate-700">
                      {request.summary}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.employeeCount} çalışan, {request.stopCount} durak,{" "}
                      {request.routeCount} rota
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="success">
                        <Check className="h-3.5 w-3.5" />
                        Onayla
                      </Button>
                      <Button size="sm" variant="secondary">
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Revizyon
                      </Button>
                      <Button size="sm" variant="danger">
                        <X className="h-3.5 w-3.5" />
                        Reddet
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>

        <Card className="h-fit p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Detay Paneli</h2>
              <p className="text-sm text-slate-500">Plan karar notları</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            Seçili plan için rota kırılımı, durak yoğunluğu, tahmini araç
            ihtiyacı ve revizyon notları bu panelde gösterilebilir. Backend
            detay endpointi geldiğinde modal yerine bu panel beslenecek.
          </div>
        </Card>
      </div>
    </PageSection>
  );
}
