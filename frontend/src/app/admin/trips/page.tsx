import { TripsPage } from "@/features/trips/components/TripsPage";
import { getTrips } from "@/features/trips/services/trip.service";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
  const trips = await getTrips();

  return <TripsPage trips={trips} />;
}
