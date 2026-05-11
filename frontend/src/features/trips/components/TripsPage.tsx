"use client";

import { FormEvent, useState } from "react";
import { Calendar, Clock, Plus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
import { formatDate } from "@/lib/utils";

import { createTrip } from "../services/trip.service";
import type { Trip } from "../types";

type FormState = {
  routeId: string;
  startTime: string;
  tripDate: string;
};

const emptyForm: FormState = {
  routeId: "1",
  startTime: "07:30",
  tripDate: new Date().toISOString().slice(0, 10),
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

export function TripsPage({ trips }: { trips: Trip[] }) {
  const [items, setItems] = useState(trips);
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
      const createdTrip = await createTrip({
        routeId: Number(form.routeId),
        startTime: `${form.tripDate}T${form.startTime}:00`,
        tripDate: form.tripDate,
      });

      setItems((current) => [createdTrip, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Sefer oluşturulamadı.",
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
            Sefer Oluştur
          </Button>
        }
        description="Günlük servis seferlerini tarih, saat, rota, araç ve şoför bazında izleyin."
        title="Trips"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Bugünkü sefer planı"
            icon={Calendar}
            label="Toplam Sefer"
            value={items.length}
          />
          <MetricCard
            hint="Araç yolda"
            icon={Clock}
            label="Başladı"
            value={items.filter((trip) => trip.status === "started").length}
          />
          <MetricCard
            hint="Yoklama ve bitiş bilgisi kapandı"
            icon={Calendar}
            label="Tamamlandı"
            value={items.filter((trip) => trip.status === "completed").length}
          />
        </div>

        <TableShell
          description="Sefer durumu planlandı, başladı, tamamlandı veya iptal olarak izlenir."
          searchPlaceholder="Rota, araç veya şoför ara..."
          title="Günlük Seferler"
        >
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Sefer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tarih / Saat
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Rota
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Araç
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Şoför
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((trip) => (
                <tr className="border-b border-slate-100 last:border-0" key={trip.id}>
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    TRP-{trip.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    <p>{formatDate(trip.date)}</p>
                    <p className="mt-1 text-xs text-slate-500">{trip.time}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {trip.routeName}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {trip.vehicle}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {trip.driver}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={trip.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Yeni günlük sefer backend'e kaydedilir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Sefer Oluştur"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <Field
              label="Rota ID"
              onChange={(value) => updateField("routeId", value)}
              required
              type="number"
              value={form.routeId}
            />
            <Field
              label="Tarih"
              onChange={(value) => updateField("tripDate", value)}
              required
              type="date"
              value={form.tripDate}
            />
            <Field
              label="Başlangıç saati"
              onChange={(value) => updateField("startTime", value)}
              required
              type="time"
              value={form.startTime}
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
