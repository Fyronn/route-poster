import { RouteRequestApprovalsPage } from "@/features/route-request-approvals/components/RouteRequestApprovalsPage";
import { getRouteRequestApprovals } from "@/features/route-request-approvals/services/route-request-approval.service";
import { getDrivers } from "@/features/drivers/services/driver.service";
import { getVehicles } from "@/features/vehicles/services/vehicle.service";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminRouteRequestApprovalsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const approvals = await getRouteRequestApprovals({ authToken: session.token });
  const drivers = await getDrivers({ authToken: session.token });
  const vehicles = await getVehicles({ authToken: session.token });

  return (
    <RouteRequestApprovalsPage
      approvals={approvals}
      drivers={drivers}
      vehicles={vehicles}
    />
  );
}
