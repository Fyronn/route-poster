import { AdminLayout } from "@/components/layout/AdminLayout";
import { requireServerAuthSession } from "@/lib/auth-server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await requireServerAuthSession();

  return <AdminLayout authUser={session.user}>{children}</AdminLayout>;
}
