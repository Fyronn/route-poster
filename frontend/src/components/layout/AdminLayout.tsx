import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="min-h-screen pl-[260px]">
        <AdminTopbar />

        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </div>
    </div>
  );
}