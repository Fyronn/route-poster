import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import type { AuthUser } from "@/features/auth/types";

type AdminLayoutProps = {
  authUser: AuthUser;
  children: React.ReactNode;
};

export function AdminLayout({ authUser, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar authUser={authUser} />

      <div className="min-h-screen lg:pl-[280px]">
        <AdminTopbar authUser={authUser} />

        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}
