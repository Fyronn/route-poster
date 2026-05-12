import { DriversPage } from "@/features/drivers/components/DriversPage";
import { getDrivers } from "@/features/drivers/services/driver.service";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminDriversPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);

  const drivers = await getDrivers({ authToken: session.token });

  return <DriversPage drivers={drivers} />;
}
