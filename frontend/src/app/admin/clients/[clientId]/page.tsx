import { ClientDetailPage } from "@/features/clients/components/ClientDetailPage";
import { getClientById } from "@/features/clients/services/client.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

type AdminClientDetailPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function AdminClientDetailPage({
  params,
}: AdminClientDetailPageProps) {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const { clientId } = await params;
  const client = await getClientById(clientId, {
    authToken: session.token,
  });

  return <ClientDetailPage client={client} />;
}
