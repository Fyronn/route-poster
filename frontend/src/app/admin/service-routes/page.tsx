import { ServiceRoutesPage } from "@/features/service-routes/components/ServiceRoutesPage";
import { getServiceRoutes } from "@/features/service-routes/services/service-route.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminServiceRoutesPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const routes = await getServiceRoutes({
    authToken: session.token,
    clientId: null,
  });

  return <ServiceRoutesPage routes={routes} />;
}
