"use client";

import { FormEvent, useState } from "react";
import { Bus, DeleteIcon, Edit2Icon, Plus } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import {
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "../services/vehicle.service";
import type { Vehicle } from "../types";

type VehicleFormState = {
  capacity: string;
  equipment: string;
  model: string;
  plate: string;
  productionYear: string;
  vehicleType: string;
  isActive: boolean;
};

const emptyForm: VehicleFormState = {
  capacity: "16",
  equipment: "",
  model: "",
  plate: "",
  productionYear: "",
  vehicleType: "Minibus",
  isActive: true,
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

function SelectField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>

      <select
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        onChange={(event) => onChange(event.target.value === "true")}
        value={String(value)}
      >
        <option value="true">Aktif</option>
        <option value="false">Pasif</option>
      </select>
    </label>
  );
}

export function VehiclesPage({ vehicles }: { vehicles: Vehicle[] }) {
  const [items, setItems] = useState(vehicles);
  const [form, setForm] = useState<VehicleFormState>(emptyForm);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const isEditMode = editingVehicle !== null;

  function updateField(key: keyof VehicleFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateModal() {
    setEditingVehicle(null);
    setForm(emptyForm);
    setError(null);
    setIsOpen(true);
  }

  function openEditModal(vehicle: Vehicle) {
    setEditingVehicle(vehicle);

    setForm({
      plate: vehicle.plateNumber ?? "",
      capacity: String(vehicle.capacity ?? ""),
      model: vehicle.brandModel ?? "",
      productionYear: vehicle.productionYear
        ? String(vehicle.productionYear)
        : "",
      vehicleType: vehicle.vehicleType ?? "",
      equipment: vehicle.equipmentFeatures ?? "",
      isActive: vehicle.isActive ?? true,
    });

    setError(null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingVehicle(null);
    setForm(emptyForm);
    setError(null);
  }

  function createVehiclePayload() {
    return {
      capacity: Number(form.capacity),
      equipment: form.equipment,
      model: form.model,
      plate: form.plate,
      productionYear: form.productionYear
        ? Number(form.productionYear)
        : undefined,
      vehicleType: form.vehicleType,
    };
  }

  function createVehicleUpdatePayload() {
    return {
      plateNumber: form.plate,
      capacity: Number(form.capacity),
      brandModel: form.model,
      productionYear: form.productionYear
        ? Number(form.productionYear)
        : undefined,
      vehicleType: form.vehicleType,
      equipmentFeatures: form.equipment,
      isActive: form.isActive,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode && editingVehicle) {
        const updatePayload = createVehicleUpdatePayload();

        const updatedVehicle = await updateVehicle(
          editingVehicle.vehicleId,
          updatePayload,
        );

        setItems((current) =>
          current.map((vehicle) =>
            vehicle.vehicleId === editingVehicle.vehicleId
              ? {
                  ...vehicle,
                  ...(updatedVehicle ?? updatePayload),
                }
              : vehicle,
          ),
        );
      } else {
        const createdVehicle = await createVehicle(createVehiclePayload());

        setItems((current) => [createdVehicle, ...current]);
      }

      closeModal();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : isEditMode
            ? "Araç güncellenemedi."
            : "Araç oluşturulamadı.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    const isConfirmed = window.confirm(
      `${vehicle.plateNumber || "Bu araç"} kaydını silmek istediğine emin misin?`,
    );

    if (!isConfirmed) return;

    setError(null);
    setIsDeletingId(vehicle.vehicleId);

    try {
      await deleteVehicle(vehicle.vehicleId);

      setItems((current) =>
        current.filter((item) => item.vehicleId !== vehicle.vehicleId),
      );
    } catch (deleteError) {
      console.error("Araç silme işlemi sırasında hata oluştu", deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Araç silinemedi.",
      );
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <>
      <PageSection
        action={
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            Araç Ekle
          </Button>
        }
        description="ABC Turizm filosundaki servis araçlarını ve operasyon kapasitesini yönetin."
        eyebrow="Admin Operation"
        title="Vehicles"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Filoda kayıtlı"
            icon={Bus}
            label="Toplam Araç"
            value={items.length}
          />

          <MetricCard
            hint="Atamaya hazır"
            icon={Bus}
            label="Aktif"
            value={items.filter((vehicle) => vehicle.isActive).length}
          />

          <MetricCard
            hint="Toplam koltuk"
            icon={Bus}
            label="Kapasite"
            value={items.reduce(
              (total, vehicle) => total + vehicle.capacity,
              0,
            )}
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <TableShell
          description="Araç kayıtları rota onayından sonraki servis atama adımında kullanılır."
          searchPlaceholder="Plaka, model veya araç tipi ara..."
          title="Araç Listesi"
        >
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Araç
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tip
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Kapasite
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Donanım
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((vehicle) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={vehicle.vehicleId}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {vehicle.plateNumber || "-"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {vehicle.brandModel || "-"}
                      {vehicle.productionYear
                        ? ` / ${vehicle.productionYear}`
                        : ""}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="neutral">
                      {vehicle.vehicleType || "-"}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {vehicle.capacity} koltuk
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {vehicle.equipmentFeatures ?? "-"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={vehicle.isActive ? "active" : "inactive"}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                        onClick={() => openEditModal(vehicle)}
                        title="Aracı düzenle"
                        type="button"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </button>

                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeletingId === vehicle.vehicleId}
                        onClick={() => handleDelete(vehicle)}
                        title="Aracı sil"
                        type="button"
                      >
                        <DeleteIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description={
          isEditMode
            ? "Araç bilgilerini güncelleyin."
            : "Yeni araç backend'e kaydedilir ve servis atamalarında kullanılır."
        }
        isOpen={isOpen}
        onClose={closeModal}
        title={isEditMode ? "Araç Güncelle" : "Araç Ekle"}
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
              label="Üretim Yılı"
              onChange={(value) => updateField("productionYear", value)}
              type="number"
              value={form.productionYear}
            />

            <Field
              label="Araç Tipi"
              onChange={(value) => updateField("vehicleType", value)}
              placeholder="Minibus"
              value={form.vehicleType}
            />

            <Field
              label="Donanım"
              onChange={(value) => updateField("equipment", value)}
              placeholder="Klima, kamera, takip cihazı"
              value={form.equipment}
            />

            <SelectField
              label="Durum"
              onChange={(value) => updateField("isActive", value)}
              value={form.isActive}
            />
          </div>

          {error ? <p className="px-6 text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button onClick={closeModal} type="button" variant="secondary">
              Vazgeç
            </Button>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? isEditMode
                  ? "Güncelleniyor..."
                  : "Kaydediliyor..."
                : isEditMode
                  ? "Güncelle"
                  : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}