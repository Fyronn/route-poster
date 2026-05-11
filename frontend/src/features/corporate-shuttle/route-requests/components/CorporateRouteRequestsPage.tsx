"use client";

import { FormEvent, useState } from "react";
import { Plus, Route } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createCorporateRouteRequest } from "../services/route-request.service";
import type { CorporateRouteRequest } from "../types";

type RouteRequestFormState = {
  direction: string;
  plannedStartTime: string;
  routeName: string;
  shift: string;
  workingDays: string;
};

const emptyForm: RouteRequestFormState = {
  direction: "Gidis",
  plannedStartTime: "07:30",
  routeName: "",
  shift: "Sabah",
  workingDays: "1,2,3,4,5",
};

function InputField({
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CorporateRouteRequestsPage({
  requests,
}: {
  requests: CorporateRouteRequest[];
}) {
  const [items, setItems] = useState(requests);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof RouteRequestFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdRequest = await createCorporateRouteRequest(1, {
        direction: form.direction,
        plannedStartTime: `${form.plannedStartTime}:00`,
        routeName: form.routeName,
        shift: form.shift,
        workingDays: form.workingDays,
      });

      setItems((current) => [createdRequest, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Rota talebi oluşturulamadı. Backend veya validasyon hatasını kontrol edin.",
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
            Rota Talebi Ekle
          </Button>
        }
        description="Şirket yöneticisinin oluşturduğu rota talepleri admin tarafından izlenir ve onay ekranlarına aktarılır."
        eyebrow="Corporate Shuttle"
        title="Route Requests"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Şirket yöneticileri tarafından girildi"
            icon={Route}
            label="Toplam Talep"
            value={items.length}
          />
          <MetricCard
            hint="ABC Turizm incelemesi bekliyor"
            icon={Route}
            label="Gönderilen Plan"
            value={items.filter((request) => request.status === "submitted").length}
          />
          <MetricCard
            hint="Operasyona aktarılabilir"
            icon={Route}
            label="Onaylı Rota"
            value={items.filter((request) => request.status === "approved").length}
          />
        </div>

        <TableShell
          description="Başlangıç, bitiş, durak ve çalışan sayısı operasyonel değerlendirme için gösterilir."
          searchPlaceholder="Rota, client veya başlangıç noktası ara..."
          title="Rota Talepleri"
        >
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Rota
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Başlangıç / Bitiş
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Vardiya
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Kapasite
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tahmin
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((request) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={request.id}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {request.routeName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.clientName}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    <p>{request.startPoint}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.endPoint}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="neutral">{request.shift}</Badge>
                    <p className="mt-2 text-xs text-slate-500">
                      {request.workingDays} / {request.plannedStartTime}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.employeeCount} çalışan, {request.stopCount} durak
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.estimatedDistanceKm} km /{" "}
                    {request.estimatedDurationMin} dk
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Yeni rota talebi backend'e kaydedilir ve listeye eklenir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Rota Talebi Ekle"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <InputField
              label="Rota adı"
              onChange={(value) => updateField("routeName", value)}
              placeholder="Kadıköy - Maslak Sabah Servisi"
              required
              value={form.routeName}
            />
            <SelectField
              label="Vardiya"
              onChange={(value) => updateField("shift", value)}
              options={[
                { label: "Sabah", value: "Sabah" },
                { label: "Akşam", value: "Aksam" },
                { label: "Vardiya", value: "Vardiya" },
              ]}
              value={form.shift}
            />
            <SelectField
              label="Yön"
              onChange={(value) => updateField("direction", value)}
              options={[
                { label: "Gidiş", value: "Gidis" },
                { label: "Dönüş", value: "Donus" },
              ]}
              value={form.direction}
            />
            <InputField
              label="Başlangıç saati"
              onChange={(value) => updateField("plannedStartTime", value)}
              required
              type="time"
              value={form.plannedStartTime}
            />
            <SelectField
              label="Çalışma günleri"
              onChange={(value) => updateField("workingDays", value)}
              options={[
                { label: "Pazartesi - Cuma", value: "1,2,3,4,5" },
                { label: "Pazartesi - Cumartesi", value: "1,2,3,4,5,6" },
              ]}
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
