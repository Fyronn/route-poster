import { ServiceRoutesPage } from "@/features/service-routes/components/ServiceRoutesPage";
import { getServiceRoutes } from "@/features/service-routes/services/service-route.service";

export const dynamic = "force-dynamic";

export default async function AdminServiceRoutesPage() {
  const routes = await getServiceRoutes();

  return <ServiceRoutesPage routes={routes} />;
}
