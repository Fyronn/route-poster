import { CorporateShuttlePlanPage } from "@/features/corporate-shuttle/shuttle-plan/components/CorporateShuttlePlanPage";
import { getCorporateShuttlePlan } from "@/features/corporate-shuttle/shuttle-plan/services/shuttle-plan.service";

export default async function AdminCorporateShuttlePlanPage() {
  const plan = await getCorporateShuttlePlan();

  return <CorporateShuttlePlanPage plan={plan} />;
}
