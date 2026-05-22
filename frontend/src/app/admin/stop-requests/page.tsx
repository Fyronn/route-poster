import { StopApprovalsPage } from "@/features/stop-approvals/components/StopApprovalsPage";
import { getClients } from '@/features/clients/services/client.service';
import { ensureAdminAccess, requireServerAuthSession } from '@/lib/auth-server';
import React from 'react';

export const dynamic = "force-dynamic";

export default async function StopsRequestPage() {
    const session = await requireServerAuthSession();
    ensureAdminAccess(session);
    
    // Fetch clients using server-side auth token
    const clients = await getClients({ authToken: session.token });

    return <StopApprovalsPage initialClients={clients} />;
}

