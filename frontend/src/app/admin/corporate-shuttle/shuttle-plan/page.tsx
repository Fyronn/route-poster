import { CorporateShuttlePlanPage } from "@/features/corporate-shuttle/shuttle-plan/components/CorporateShuttlePlanPage";
import { getCorporateShuttlePlan } from "@/features/corporate-shuttle/shuttle-plan/services/shuttle-plan.service";
import {
  ensureServiceManagerAccess,
  getScopedClientId,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminCorporateShuttlePlanPage() {
  const session = await requireServerAuthSession();
  ensureServiceManagerAccess(session);
  const clientId = getScopedClientId(session);
  const plan = await getCorporateShuttlePlan();

  return <CorporateShuttlePlanPage clientId={clientId} plan={plan} />;
}
