import { TripsPage } from "@/features/trips/components/TripsPage";
import { getTrips, getTripAssignments } from "@/features/trips/services/trip.service";
import { getRouteRequestApprovals } from "@/features/route-request-approvals/services/route-request-approval.service";
import { getVehicles } from "@/features/vehicles/services/vehicle.service";
import { getDrivers } from "@/features/drivers/services/driver.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);

  const [tripAssignments, trips, routes, vehicles, drivers] = await Promise.all([
    getTripAssignments({ authToken: session.token }),
    getTrips({ authToken: session.token }),
    getRouteRequestApprovals({ authToken: session.token }),
    getVehicles({ authToken: session.token }),
    getDrivers({ authToken: session.token }),
  ]);

  return (
    <TripsPage
      initialTripAssignments={tripAssignments}
      trips={trips}
      routes={routes}
      vehicles={vehicles}
      drivers={drivers}
    />
  );
}
