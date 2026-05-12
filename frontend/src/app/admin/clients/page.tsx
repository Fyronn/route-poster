import { ClientsListPage } from "@/features/clients/components/ClientsListPage";
import { getClients } from "@/features/clients/services/client.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);

  

  const clients = await getClients({ authToken: session.token });

  return <ClientsListPage clients={clients} />;
}
