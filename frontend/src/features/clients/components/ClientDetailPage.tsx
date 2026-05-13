import Link from "next/link";
import {
  Building2,
  ClipboardList,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";

import type { Client } from "../types";

const quickLinks = [
  {
    title: "Setup Checklist",
    description: "Client kurulum ilerlemesini ve eksik adımları takip et.",
    href: "setup",
    icon: ClipboardList,
  },
  {
    title: "Employees",
    description: "Corporate shuttle çalışan listesine git.",
    href: "/admin/corporate-shuttle/employees",
    icon: Users,
  },
  {
    title: "Route Requests",
    description: "Şirket yöneticisinden gelen rota taleplerini izle.",
    href: "/admin/corporate-shuttle/route-requests",
    icon: Route,
  },
  {
    title: "Shuttle Plan",
    description: "Servis planı özetini ve gönderim durumunu incele.",
    href: "/admin/corporate-shuttle/shuttle-plan",
    icon: Send,
  },
];

export function ClientDetailPage({ client }: { client: Client }) {
  return (
    <PageSection
      action={
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={`/admin/clients/${client.clientId}/setup`}
        >
          <ClipboardList className="h-4 w-4" />
          Setup Checklist
        </Link>
      }
      description="Genel client bilgileri burada tutulur; corporate shuttle iş akışları kendi modül sayfalarında yönetilir."
      title={client.clientName}
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          hint="Servis kullanacak kayıtlı çalışan"
          icon={Users}
          label="Çalışan"
          value={client.employeeCount || 0}
        />
        <MetricCard
          hint="Şirket yöneticisi tarafından önerilen"
          icon={MapPin}
          label="Durak Talebi"
          value={client.stopCount || 0}
        />
        <MetricCard
          hint="Onay akışında veya operasyona aktarılmış"
          icon={Route}
          label="Rota Talebi"
          value={client.routeRequestCount || 0}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            description="Client kaydı taşıma tipi özelinden bağımsız tutulur."
            title="Client Genel Bilgileri"
          />
          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Client ID
                </p>
                <p className="mt-1 font-semibold text-slate-950">CLT-{String(client.clientId).padStart(3, "0")}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Taşıma Tipi
                </p>
                <div className="mt-2">
                  <Badge variant="teal">Şirket personel servisi</Badge>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Yetkili
                </p>
                <p className="mt-1 font-semibold text-slate-950">
                  {client.authorizedPerson || "-"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Kurulum Durumu
                </p>
                <div className="mt-2">
                  <StatusBadge status={client.setupStatus || "pending"} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 md:grid-cols-3">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">E-posta</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {client.email || "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Telefon</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {client.phone || "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Adres</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {client.district}, {client.city}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">Aktif Modül</h2>
              <p className="mt-1 text-sm text-slate-500">
                Şirket personel servisi
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Kurulum Modeli
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-950">
              {client.setupPreference === "Company Managed"
                ? "Şirket yöneticisi kurar"
                : client.setupPreference === "Hybrid"
                  ? "Karışık model"
                  : "ABC Turizm kurar"}
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          const href = link.href.startsWith("/")
            ? link.href
            : `/admin/clients/${client.clientId}/${link.href}`;

          return (
            <Link href={href} key={link.title}>
              <Card className="h-full p-5 transition hover:border-teal-200 hover:shadow-md">
                <Icon className="h-5 w-5 text-teal-700" />
                <h3 className="mt-4 font-semibold text-slate-950">
                  {link.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {link.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageSection>
  );
}
