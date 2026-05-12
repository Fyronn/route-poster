import { CorporateStopsPage } from "@/features/corporate-shuttle/stops/components/CorporateStopsPage";
import { getCorporateStops } from "@/features/corporate-shuttle/stops/services/stop.service";
import {
  ensureServiceManagerAccess,
  getScopedClientId,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminCorporateStopsPage() {
  const session = await requireServerAuthSession();
  ensureServiceManagerAccess(session);
  const clientId = getScopedClientId(session);
  const stops = await getCorporateStops(clientId, {
    authToken: session.token,
  });

  return <CorporateStopsPage clientId={clientId} stops={stops} />;
}
