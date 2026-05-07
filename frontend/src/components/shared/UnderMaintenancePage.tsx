import { Clock3, Wrench } from "lucide-react";

type UnderMaintenancePageProps = {
  title?: string;
  description?: string;
};

export function UnderMaintenancePage({
  title = "Sayfa Bakımda",
  description = "Bu sayfa şu anda hazırlanıyor. Kısa süre içinde kullanıma açılacaktır.",
}: UnderMaintenancePageProps) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <Wrench className="h-10 w-10" />
        </div>

        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <Clock3 className="h-4 w-4" />
          Geliştirme devam ediyor
        </div>
      </div>
    </div>
  );
}