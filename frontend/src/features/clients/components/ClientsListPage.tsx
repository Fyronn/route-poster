import Link from "next/link";
import { Building2, Plus, Route, Users } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import type { Client } from "../types";

export function ClientsListPage({ clients }: { clients: Client[] }) {
  const totalEmployees = clients.reduce(
    (total, client) => total + client.employeeCount,
    0,
  );
  const totalRoutes = clients.reduce(
    (total, client) => total + client.routeRequestCount,
    0,
  );

  return (
    <PageSection
      action={
        <Link
          className={buttonVariants({ className: "w-full sm:w-auto" })}
          href="/admin/clients/create"
        >
          <Plus className="h-4 w-4" />
          Yeni Client Ekle
        </Link>
      }
      description="Client organizasyonlarını, aktif taşıma modüllerini ve kurulum durumlarını yönetin."
      title="Clients"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          hint="Aktif kurumsal müşteri"
          icon={Building2}
          label="Toplam Client"
          value={clients.length}
        />
        <MetricCard
          hint="Corporate shuttle çalışanı"
          icon={Users}
          label="Çalışan"
          value={totalEmployees}
        />
        <MetricCard
          hint="İnceleme veya operasyon aşamasında"
          icon={Route}
          label="Rota Talebi"
          value={totalRoutes}
        />
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-3">
        {clients.map((client) => (
          <Link href={`/admin/clients/${client.numericId}`} key={client.id}>
            <Card className="h-full p-5 transition hover:border-teal-200 hover:shadow-md">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Building2 className="h-6 w-6" />
                </div>
                <StatusBadge status={client.setupStatus} />
              </div>
              <h2 className="text-lg font-semibold text-slate-950">
                {client.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {client.transportTypeLabel}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Çalışan</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {client.employeeCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Durak</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {client.stopCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rota</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    {client.routeRequestCount}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <TableShell
        description="Genel client yönetimi burada tutulur; modüle özel kayıtlar kendi feature ekranlarında yönetilir."
        searchPlaceholder="Client, yetkili veya e-posta ara..."
        title="Client Listesi"
      >
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Client
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Taşıma Tipi
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Yetkili
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Lokasyon
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Kurulum
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                Operasyon
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                className="border-b border-slate-100 last:border-0"
                key={client.id}
              >
                <td className="px-5 py-4">
                  <Link
                    className="font-semibold text-slate-950 hover:text-teal-700"
                    href={`/admin/clients/${client.numericId}`}
                  >
                    {client.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">{client.id}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge variant="teal">{client.transportTypeLabel}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {client.contactName}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{client.email}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">
                  {client.district}, {client.city}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={client.setupStatus} />
                </td>
                <td className="px-5 py-4 text-right text-sm text-slate-700">
                  {client.employeeCount} çalışan / {client.routeRequestCount} rota
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </PageSection>
  );
}
