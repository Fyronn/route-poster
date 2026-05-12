import { ClientSetupPage } from "@/features/clients/components/ClientSetupPage";
import { setupChecklist } from "@/features/clients/constants";
import { getClientById } from "@/features/clients/services/client.service";
import {
  ensureAdminAccess,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

type AdminClientSetupPageProps = {
  params: Promise<{
    clientId: string;
  }>;
};

export default async function AdminClientSetupPage({
  params,
}: AdminClientSetupPageProps) {
  const session = await requireServerAuthSession();
  ensureAdminAccess(session);
  const { clientId } = await params;
  const client = await getClientById(clientId, {
    authToken: session.token,
  });

  return <ClientSetupPage checklist={setupChecklist} client={client} />;
}
