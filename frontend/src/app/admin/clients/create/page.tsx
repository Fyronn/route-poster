import { ClientCreateWizard } from "@/features/clients/components/ClientCreateWizard";
import { ensureAdminAccess, requireServerAuthSession } from "@/lib/auth-server";

export default async function AdminClientCreatePage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);

  return <ClientCreateWizard />;
}
