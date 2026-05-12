import { redirect } from "next/navigation";

import { LoginPage } from "@/features/auth/components/LoginPage";
import { getDefaultPathForUser } from "@/features/auth/role-access";
import { getServerAuthSession } from "@/lib/auth-server";

export default async function LoginRoutePage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect(getDefaultPathForUser(session.user) ?? "/unauthorized");
  }

  return <LoginPage />;
}
