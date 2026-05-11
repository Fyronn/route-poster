import { ClientsListPage } from "@/features/clients/components/ClientsListPage";
import { getClients } from "@/features/clients/services/client.service";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const clients = await getClients();

  return <ClientsListPage clients={clients} />;
}
