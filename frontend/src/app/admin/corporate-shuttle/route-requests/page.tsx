import { CorporateRouteRequestsPage } from "@/features/corporate-shuttle/route-requests/components/CorporateRouteRequestsPage";
import { getCorporateRouteRequests } from "@/features/corporate-shuttle/route-requests/services/route-request.service";

export const dynamic = "force-dynamic";

export default async function AdminCorporateRouteRequestsPage() {
  const requests = await getCorporateRouteRequests();

  return <CorporateRouteRequestsPage requests={requests} />;
}
