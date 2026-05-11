import { CorporateEmployeesPage } from "@/features/corporate-shuttle/employees/components/CorporateEmployeesPage";
import { getCorporateEmployees } from "@/features/corporate-shuttle/employees/services/employee.service";

export const dynamic = "force-dynamic";

export default async function AdminCorporateEmployeesPage() {
  const employees = await getCorporateEmployees();

  return <CorporateEmployeesPage employees={employees} />;
}
