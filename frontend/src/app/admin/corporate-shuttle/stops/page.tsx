import { CorporateStopsPage } from "@/features/corporate-shuttle/stops/components/CorporateStopsPage";
import { getCorporateStops } from "@/features/corporate-shuttle/stops/services/stop.service";

export const dynamic = "force-dynamic";

export default async function AdminCorporateStopsPage() {
  const stops = await getCorporateStops();

  return <CorporateStopsPage stops={stops} />;
}
