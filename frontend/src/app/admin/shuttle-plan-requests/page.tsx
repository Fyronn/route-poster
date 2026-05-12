import { ShuttlePlanRequestsPage } from "@/features/shuttle-plan-requests/components/ShuttlePlanRequestsPage";
import { getShuttlePlanRequests } from "@/features/shuttle-plan-requests/services/shuttle-plan-request.service";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminShuttlePlanRequestsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const requests = await getShuttlePlanRequests({ authToken: session.token });

  return <ShuttlePlanRequestsPage requests={requests} />;
}
