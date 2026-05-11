import { ClientDetailPage } from "@/features/clients/components/ClientDetailPage";
import { getClientById } from "@/features/clients/services/client.service";

export const dynamic = "force-dynamic";

type AdminClientDetailPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function AdminClientDetailPage({
  params,
}: AdminClientDetailPageProps) {
  const { clientId } = await params;
  const client = await getClientById(clientId);

  return <ClientDetailPage client={client} />;
}
