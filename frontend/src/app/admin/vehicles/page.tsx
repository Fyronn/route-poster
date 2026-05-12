import { VehiclesPage } from "@/features/vehicles/components/VehiclesPage";
import { getVehicles } from "@/features/vehicles/services/vehicle.service";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);

  const vehicles = await getVehicles({ authToken: session.token });

  return <VehiclesPage vehicles={vehicles} />;
}
