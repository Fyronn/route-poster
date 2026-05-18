import { RouteRequestApprovalsPage } from "@/features/route-request-approvals/components/RouteRequestApprovalsPage";
import { getRouteRequestApprovals } from "@/features/route-request-approvals/services/route-request-approval.service";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminRouteRequestApprovalsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const approvals = await getRouteRequestApprovals({ authToken: session.token });

  return <RouteRequestApprovalsPage approvals={approvals} />;
}
