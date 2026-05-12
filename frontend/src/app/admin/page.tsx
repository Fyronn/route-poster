import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bus,
  Building2,
  CheckSquare,
  MapPin,
  Route,
  Send,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { clientsMockData } from "@/features/clients/constants";
import {
  getScopedClientId,
  isAdminUser,
  isServiceManager,
  requireServerAuthSession,
} from "@/lib/auth-server";

const adminDashboardLinks = [
  {
    title: "Client olustur",
    description: "Corporate shuttle moduluyle yeni client kurulumunu baslat.",
    href: "/admin/clients/create",
    icon: Building2,
  },
  {
    title: "Suruculer",
    description: "Rotalara atanacak sofor kayitlarini yonet.",
    href: "/admin/drivers",
    icon: Users,
  },
  {
    title: "Araclar",
    description: "Servis filosunu ve kapasite bilgisini yonet.",
    href: "/admin/vehicles",
    icon: Bus,
  },
  {
    title: "Rota onaylari",
    description: "Gelen rota taleplerini onayla ve servis atamasini baslat.",
    href: "/admin/route-request-approvals",
    icon: CheckSquare,
  },
];

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireServerAuthSession();
  const clientId = getScopedClientId(session);
  const isAdmin = isAdminUser(session.user);
  const isServiceManagerUser = isServiceManager(session.user);

  if (!isAdmin && !isServiceManagerUser) {
    redirect("/unauthorized");
  }

  if (isServiceManagerUser && !session.user.clientId) {
    redirect("/unauthorized");
  }

  const links = isServiceManagerUser
    ? [
        {
          title: "Calisanlar",
          description: "Kendi kurumunuzun servis kullanacak calisanlarini yonetin.",
          href: "/admin/corporate-shuttle/employees",
          icon: Users,
        },
        {
          title: "Durak talepleri",
          description: "Kendi kurumunuz icin durak taleplerini olusturun.",
          href: "/admin/corporate-shuttle/stops",
          icon: MapPin,
        },
        {
          title: "Rota talepleri",
          description: "Durak sirasi ve saatleriyle rota talebi gonderin.",
          href: "/admin/corporate-shuttle/route-requests",
          icon: Route,
        },
      ]
    : adminDashboardLinks;

  return (
    <PageSection
      description="Role gore ayrilmis corporate employee shuttle operasyon paneli."
      title="Dashboard"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          hint={isServiceManagerUser ? "Oturumdaki kurum" : "Corporate shuttle"}
          icon={Building2}
          label={isServiceManagerUser ? "Kurum ID" : "Aktif Client"}
          value={isServiceManagerUser ? clientId : clientsMockData.length}
        />
        <MetricCard
          hint={isServiceManagerUser ? "Admin incelemesine gidecek" : "Onay bekliyor"}
          icon={Send}
          label={isServiceManagerUser ? "Talep Akisi" : "Plan Talebi"}
          value={isServiceManagerUser ? 3 : 2}
        />
        <MetricCard
          hint={isServiceManagerUser ? "Durak ve rota hazirligi" : "Operasyon karari"}
          icon={Route}
          label={isServiceManagerUser ? "Hazirlik" : "Rota Karari"}
          value={isServiceManagerUser ? 2 : 4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {links.map((item) => {
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
                Ac
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          );
        })}
      </div>
    </PageSection>
  );
}
