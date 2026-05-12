"use client";

import { FormEvent, useState } from "react";
import { Bus, Plus } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createVehicle } from "../services/vehicle.service";
import type { Vehicle } from "../types";

type VehicleFormState = {
  capacity: string;
  equipment: string;
  model: string;
  plate: string;
  productionYear: string;
  vehicleType: string;
};

const emptyForm: VehicleFormState = {
  capacity: "16",
  equipment: "",
  model: "",
  plate: "",
  productionYear: "",
  vehicleType: "Minibus",
};

function Field({
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

export function VehiclesPage({ vehicles }: { vehicles: Vehicle[] }) {
  const [items, setItems] = useState(vehicles);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof VehicleFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdVehicle = await createVehicle({
        capacity: Number(form.capacity),
        equipment: form.equipment,
        model: form.model,
        plate: form.plate,
        productionYear: form.productionYear
          ? Number(form.productionYear)
          : undefined,
        vehicleType: form.vehicleType,
      });

      setItems((current) => [createdVehicle, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Arac olusturulamadi.",
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
            Arac Ekle
          </Button>
        }
        description="ABC Turizm filosundaki servis araclarini ve operasyon kapasitesini yonetin."
        eyebrow="Admin Operation"
        title="Vehicles"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Filoda kayitli"
            icon={Bus}
            label="Toplam Arac"
            value={items.length}
          />
          <MetricCard
            hint="Atamaya hazir"
            icon={Bus}
            label="Aktif"
            value={items.filter((vehicle) => vehicle.status === "active").length}
          />
          <MetricCard
            hint="Toplam koltuk"
            icon={Bus}
            label="Kapasite"
            value={items.reduce((total, vehicle) => total + vehicle.capacity, 0)}
          />
        </div>

        <TableShell
          description="Arac kayitlari rota onayindan sonraki servis atama adiminda kullanilir."
          searchPlaceholder="Plaka, model veya arac tipi ara..."
          title="Arac Listesi"
        >
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Arac
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tip
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Kapasite
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Donanim
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((vehicle) => (
                <tr className="border-b border-slate-100 last:border-0" key={vehicle.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {vehicle.plate}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {vehicle.model}
                      {vehicle.productionYear ? ` / ${vehicle.productionYear}` : ""}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="neutral">{vehicle.vehicleType}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {vehicle.capacity} koltuk
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {vehicle.equipment ?? "-"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={vehicle.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Yeni arac backend'e kaydedilir ve servis atamalarinda kullanilir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Arac Ekle"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <Field
              label="Plaka"
              onChange={(value) => updateField("plate", value)}
              placeholder="34 ABC 123"
              required
              value={form.plate}
            />
            <Field
              label="Kapasite"
              onChange={(value) => updateField("capacity", value)}
              required
              type="number"
              value={form.capacity}
            />
            <Field
              label="Marka / Model"
              onChange={(value) => updateField("model", value)}
              placeholder="Mercedes Sprinter"
              value={form.model}
            />
            <Field
              label="Uretim Yili"
              onChange={(value) => updateField("productionYear", value)}
              type="number"
              value={form.productionYear}
            />
            <Field
              label="Arac Tipi"
              onChange={(value) => updateField("vehicleType", value)}
              placeholder="Minibus"
              value={form.vehicleType}
            />
            <Field
              label="Donanim"
              onChange={(value) => updateField("equipment", value)}
              placeholder="Klima, kamera, takip cihazi"
              value={form.equipment}
            />
          </div>
          {error ? <p className="px-6 text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button onClick={() => setIsOpen(false)} variant="secondary">
              Vazgec
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
