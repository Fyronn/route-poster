import { CorporateRouteRequestsPage } from "@/features/corporate-shuttle/route-requests/components/CorporateRouteRequestsPage";
import { getCorporateRouteRequests } from "@/features/corporate-shuttle/route-requests/services/route-request.service";
import { getCorporateStops } from "@/features/corporate-shuttle/stops/services/stop.service";
import {
  ensureServiceManagerAccess,
  getScopedClientId,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminCorporateRouteRequestsPage() {
  const session = await requireServerAuthSession();
  ensureServiceManagerAccess(session);
  const clientId = getScopedClientId(session);
  const requests = await getCorporateRouteRequests(clientId, {
    authToken: session.token,
  });
  const stops = await getCorporateStops(clientId, {
    authToken: session.token,
  });

  return (
    <CorporateRouteRequestsPage
      clientId={clientId}
      requests={requests}
      stops={stops}
    />
  );
}
