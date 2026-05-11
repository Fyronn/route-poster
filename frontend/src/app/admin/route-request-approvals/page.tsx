import { RouteRequestApprovalsPage } from "@/features/route-request-approvals/components/RouteRequestApprovalsPage";
import { getRouteRequestApprovals } from "@/features/route-request-approvals/services/route-request-approval.service";

export const dynamic = "force-dynamic";

export default async function AdminRouteRequestApprovalsPage() {
  const approvals = await getRouteRequestApprovals();

  return <RouteRequestApprovalsPage approvals={approvals} />;
}
