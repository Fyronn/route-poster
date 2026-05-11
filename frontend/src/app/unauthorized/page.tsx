import Link from "next/link";

import { buttonVariants } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">
          Yetkisiz Erişim
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz.
        </p>
        <Link
          className={buttonVariants({ className: "mt-6" })}
          href="/admin"
        >
          Admin Paneline Dön
        </Link>
      </div>
    </main>
  );
}
