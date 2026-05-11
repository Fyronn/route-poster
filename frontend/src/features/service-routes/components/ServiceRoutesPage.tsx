"use client";

import { FormEvent, useState } from "react";
import { Bus, Plus, Route } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createServiceRoute } from "../services/service-route.service";
import type { ServiceRoute } from "../types";

type FormState = {
  direction: string;
  plannedStartTime: string;
  routeName: string;
  shift: string;
  workingDays: string;
};

const emptyForm: FormState = {
  direction: "Gidis",
  plannedStartTime: "07:30",
  routeName: "",
  shift: "Sabah",
  workingDays: "1,2,3,4,5",
};

function Field({
  label,
  onChange,
  required,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

export function ServiceRoutesPage({ routes }: { routes: ServiceRoute[] }) {
  const [items, setItems] = useState(routes);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdRoute = await createServiceRoute({
        ...form,
        plannedStartTime: `${form.plannedStartTime}:00`,
      });
      setItems((current) => [createdRoute, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Servis rotası oluşturulamadı.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSection
        action={
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Yeni Servis Rotası
          </Button>
        }
        description="Onaylanan rota taleplerinden oluşan gerçek operasyon rotalarını yönetin."
        title="Service Routes"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Operasyon rotası"
            icon={Route}
            label="Toplam Rota"
            value={items.length}
          />
          <MetricCard
            hint="Bugün aktif çalışacak"
            icon={Bus}
            label="Aktif"
            value={items.filter((route) => route.status === "active").length}
          />
          <MetricCard
            hint="Araç veya şoför ataması bekliyor"
            icon={Route}
            label="Planlandı"
            value={items.filter((route) => route.status === "planned").length}
          />
        </div>

        <TableShell
          description="Araç, şoför, durak sayısı ve aktiflik bilgileri operasyon rotası seviyesinde tutulur."
          searchPlaceholder="Rota, client, araç veya şoför ara..."
          title="Gerçek Servis Rotaları"
        >
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Rota
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Araç
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Şoför
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Kapasite
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((route) => (
                <tr className="border-b border-slate-100 last:border-0" key={route.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {route.routeName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {route.workingDays}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {route.clientName}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="neutral">{route.vehicle}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {route.driver}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {route.employeeCount} çalışan / {route.stopCount} durak
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={route.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Operasyon rotası backend'e kaydedilir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni Servis Rotası"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <Field
              label="Rota adı"
              onChange={(value) => updateField("routeName", value)}
              required
              value={form.routeName}
            />
            <Field
              label="Vardiya"
              onChange={(value) => updateField("shift", value)}
              value={form.shift}
            />
            <Field
              label="Yön"
              onChange={(value) => updateField("direction", value)}
              value={form.direction}
            />
            <Field
              label="Başlangıç saati"
              onChange={(value) => updateField("plannedStartTime", value)}
              type="time"
              value={form.plannedStartTime}
            />
            <Field
              label="Çalışma günleri"
              onChange={(value) => updateField("workingDays", value)}
              value={form.workingDays}
            />
          </div>
          {error ? <p className="px-6 text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Vazgeç
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
