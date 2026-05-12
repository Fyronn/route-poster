import { TripsPage } from "@/features/trips/components/TripsPage";
import { getTrips } from "@/features/trips/services/trip.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const trips = await getTrips({
    authToken: session.token,
  });

  return <TripsPage trips={trips} />;
}
