import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { adminSidebarItems } from "@/config/admin-sidebar";
import { getAppAccessRole } from "@/features/auth/role-access";
import type { AuthUser } from "@/features/auth/types";

type AdminLayoutProps = {
  authUser: AuthUser;
  children: React.ReactNode;
};

export function AdminLayout({ authUser, children }: AdminLayoutProps) {
  const currentRole = getAppAccessRole(authUser);
  const sidebarItems = adminSidebarItems.filter(
    (item) =>
      currentRole !== "unknown" &&
      (item.roles.includes("all") || item.roles.includes(currentRole)),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar authUser={authUser} sidebarItems={sidebarItems} />

      <div className="min-h-screen lg:pl-[280px]">
        <AdminTopbar authUser={authUser} />

        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
