"use client";

import { FormEvent, useState } from "react";
import { MapPin, Plus } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createCorporateStop } from "../services/stop.service";
import type { CorporateStopRequest } from "../types";

const stopTypeLabels: Record<CorporateStopRequest["stopType"], string> = {
  pickup: "Alış",
  dropoff: "Bırakış",
  both: "Alış / Bırakış",
};

type StopFormState = {
  address: string;
  latitude: string;
  longitude: string;
  operatorNote: string;
  stopName: string;
};

const emptyForm: StopFormState = {
  address: "",
  latitude: "",
  longitude: "",
  operatorNote: "",
  stopName: "",
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

export function CorporateStopsPage({
  clientId,
  stops,
}: {
  clientId: number;
  stops: CorporateStopRequest[];
}) {
  const [items, setItems] = useState(stops);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof StopFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdStop = await createCorporateStop(clientId, {
        address: form.address,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        operatorNote: form.operatorNote,
        stopName: form.stopName,
      });

      setItems((current) => [createdStop, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Durak talebi oluşturulamadı. Backend veya validasyon hatasını kontrol edin.",
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
            Durak Talebi Ekle
          </Button>
        }
        description="Şirket yöneticisinin çalışan lokasyonlarına göre oluşturduğu durak taleplerini inceleyin."
        eyebrow="Corporate Shuttle"
        title="Stops"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="İnceleme ve onay akışında"
            icon={MapPin}
            label="Durak Talebi"
            value={items.length}
          />
          <MetricCard
            hint="Rotaya bağlanmaya hazır"
            icon={MapPin}
            label="Onaylı Durak"
            value={items.filter((stop) => stop.status === "approved").length}
          />
          <MetricCard
            hint="Bu duraklara bağlı çalışan"
            icon={MapPin}
            label="Çalışan"
            value={items.reduce((total, stop) => total + stop.employeeCount, 0)}
          />
        </div>

        <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_360px]">
          <TableShell
            description="Durak tipi, lokasyon ve talep durumunu takip edin."
            searchPlaceholder="Durak veya lokasyon ara..."
            title="Durak Talepleri"
          >
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Durak
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Tip
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Çalışan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((stop) => (
                  <tr
                    className="border-b border-slate-100 last:border-0"
                    key={stop.id}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {stop.stopName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {stop.address}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="neutral">
                        {stopTypeLabels[stop.stopType]}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {stop.employeeCount}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={stop.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>

          <Card className="min-h-[360px] overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold text-slate-950">Harita Alanı</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gerçek harita entegrasyonu için hazır placeholder.
              </p>
            </div>
            <div className="flex h-[280px] items-center justify-center bg-[linear-gradient(135deg,#f8fafc_25%,#eef2f7_25%,#eef2f7_50%,#f8fafc_50%,#f8fafc_75%,#eef2f7_75%)] bg-[length:28px_28px]">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
                <MapPin className="mx-auto h-6 w-6 text-teal-700" />
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  Durak lokasyonları
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Map provider bağlandığında burada görüntülenecek.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </PageSection>

      <Modal
        description="Yeni durak talebi backend'e kaydedilir ve listeye eklenir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Durak Talebi Ekle"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <InputField
              label="Durak adı"
              onChange={(value) => updateField("stopName", value)}
              placeholder="Kadıköy Rıhtım"
              required
              value={form.stopName}
            />
            <InputField
              label="Adres"
              onChange={(value) => updateField("address", value)}
              placeholder="Kadıköy, İstanbul"
              value={form.address}
            />
            <InputField
              label="Enlem"
              onChange={(value) => updateField("latitude", value)}
              placeholder="40.9900"
              type="number"
              value={form.latitude}
            />
            <InputField
              label="Boylam"
              onChange={(value) => updateField("longitude", value)}
              placeholder="29.0200"
              type="number"
              value={form.longitude}
            />
            <div className="md:col-span-2">
              <InputField
                label="Operatör notu"
                onChange={(value) => updateField("operatorNote", value)}
                placeholder="Opsiyonel"
                value={form.operatorNote}
              />
            </div>
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
