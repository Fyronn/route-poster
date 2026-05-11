import { ShuttlePlanRequestsPage } from "@/features/shuttle-plan-requests/components/ShuttlePlanRequestsPage";
import { getShuttlePlanRequests } from "@/features/shuttle-plan-requests/services/shuttle-plan-request.service";

export const dynamic = "force-dynamic";

export default async function AdminShuttlePlanRequestsPage() {
  const requests = await getShuttlePlanRequests();

  return <ShuttlePlanRequestsPage requests={requests} />;
}
