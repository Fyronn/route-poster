import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, Route, Send } from "lucide-react";

import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { clientsMockData } from "@/features/clients/constants";

const dashboardLinks = [
  {
    title: "Client oluştur",
    description: "Corporate shuttle modülüyle yeni client kurulumunu başlat.",
    href: "/admin/clients/create",
    icon: Building2,
  },
  {
    title: "Setup checklist",
    description: "Client kurulum adımlarını ve eksikleri izle.",
    href: "/admin/clients/1/setup",
    icon: ClipboardList,
  },
  {
    title: "Plan talepleri",
    description: "ABC Turizm onayı bekleyen servis planlarını incele.",
    href: "/admin/shuttle-plan-requests",
    icon: Send,
  },
  {
    title: "Rota onayları",
    description: "Operasyonel rota kararlarını rota seviyesinde ver.",
    href: "/admin/route-request-approvals",
    icon: Route,
  },
];

export default function AdminDashboardPage() {
  return (
    <PageSection
      description="Corporate employee shuttle admin operasyonları için hızlı erişim."
      title="Dashboard"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          hint="Corporate shuttle odağında"
          icon={Building2}
          label="Aktif Client"
          value={clientsMockData.length}
        />
        <MetricCard
          hint="Onay akışında bekleyen"
          icon={Send}
          label="Plan Talebi"
          value={2}
        />
        <MetricCard
          hint="Operasyona dönüşecek"
          icon={Route}
          label="Rota Kararı"
          value={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Card className="p-5" key={item.href}>
              <Icon className="h-5 w-5 text-teal-700" />
              <h2 className="mt-4 font-semibold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
              <Link
                className={buttonVariants({
                  variant: "secondary",
                  className: "mt-5 w-full",
                })}
                href={item.href}
              >
                Aç
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          );
        })}
      </div>
    </PageSection>
  );
}
