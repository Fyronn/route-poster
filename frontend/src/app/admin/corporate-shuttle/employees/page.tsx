import { CorporateEmployeesPage } from "@/features/corporate-shuttle/employees/components/CorporateEmployeesPage";
import { getCorporateEmployees } from "@/features/corporate-shuttle/employees/services/employee.service";
import {
  ensureServiceManagerAccess,
  getScopedClientId,
  requireServerAuthSession,
} from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export default async function AdminCorporateEmployeesPage() {
  const session = await requireServerAuthSession();
  ensureServiceManagerAccess(session);
  const clientId = getScopedClientId(session);
  const employees = await getCorporateEmployees(clientId, {
    authToken: session.token,
  });

  return <CorporateEmployeesPage clientId={clientId} employees={employees} />;
}
