"use client";

import { FormEvent, useState } from "react";
import { DeleteIcon, EditIcon, Plus, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import {
  createDriver,
  deleteDriver,
  updateDriver,
} from "../services/driver.service";
import type { Driver } from "../types";

type DriverFormState = {
  email: string;
  firstName: string;
  identityNumber: string;
  lastName: string;
  phone: string;
  isActive: boolean;
};

const emptyForm: DriverFormState = {
  email: "",
  firstName: "",
  identityNumber: "",
  lastName: "",
  phone: "",
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

export function DriversPage({ drivers }: { drivers: Driver[] }) {
  const [items, setItems] = useState(drivers);
  const [form, setForm] = useState<DriverFormState>(emptyForm);

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const isEditMode = editingDriver !== null;

  function updateField(key: keyof DriverFormState, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateModal() {
    setEditingDriver(null);
    setForm(emptyForm);
    setError(null);
    setIsOpen(true);
  }

  function openEditModal(driver: Driver) {
    setEditingDriver(driver);

    setForm({
      firstName: driver.firstName ?? "",
      lastName: driver.lastName ?? "",
      email: driver.email ?? "",
      phone: driver.phone ?? "",
      identityNumber: driver.identityNumber ?? "",
      isActive: driver.isActive ?? true,
    });

    setError(null);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingDriver(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditMode && editingDriver) {
        const updatedDriver = await updateDriver(editingDriver.userId, form);

        setItems((current) =>
          current.map((driver) =>
            driver.userId === editingDriver.userId
              ? {
                  ...driver,
                  ...(updatedDriver ?? form),
                }
              : driver,
          ),
        );
      } else {
        const createdDriver = await createDriver(form);

        setItems((current) => [createdDriver, ...current]);
      }

      closeModal();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : isEditMode
            ? "Sürücü güncellenemedi."
            : "Sürücü oluşturulamadı.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(driver: Driver) {
    const isConfirmed = window.confirm(
      `${driver.firstName} ${driver.lastName} adlı sürücüyü silmek istediğine emin misin?`,
    );

    if (!isConfirmed) return;

    setError(null);
    setIsDeletingId(driver.userId);

    try {
      await deleteDriver(driver.userId);

      setItems((current) =>
        current.filter((item) => item.userId !== driver.userId),
      );
    } catch (deleteError) {
      console.error("Silme işlemi sırasında bir sorun oluştu", deleteError);

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Sürücü silinemedi.",
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
            Sürücü Ekle
          </Button>
        }
        description="ABC Turizm operasyonunda servis rotalarına atanacak sürücüleri yönetin."
        eyebrow="Admin Operation"
        title="Drivers"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Sistemde kayıtlı"
            icon={UserRoundCheck}
            label="Toplam Sürücü"
            value={items.length}
          />

          <MetricCard
            hint="Atamaya hazır"
            icon={UserRoundCheck}
            label="Aktif"
            value={items.filter((driver) => driver.isActive).length}
          />

          <MetricCard
            hint="Pasif veya izinli"
            icon={UserRoundCheck}
            label="Pasif"
            value={items.filter((driver) => !driver.isActive).length}
          />
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <TableShell
          description="Sürücü kayıtları rota onayından sonraki servis atama adımında kullanılır."
          searchPlaceholder="Sürücü, telefon veya e-posta ara..."
          title="Sürücü Listesi"
        >
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Sürücü
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Telefon
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Kimlik No
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
              {items.map((driver) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={driver.userId}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {driver.firstName} {driver.lastName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {driver.email || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {driver.phone || "-"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {driver.identityNumber || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={driver.isActive ? "active" : "inactive"}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                        onClick={() => openEditModal(driver)}
                        title="Sürücüyü düzenle"
                        type="button"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>

                      <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeletingId === driver.userId}
                        onClick={() => handleDelete(driver)}
                        title="Sürücüyü sil"
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
            ? "Sürücü bilgilerini güncelleyin."
            : "Yeni sürücü backend'e kaydedilir ve rota atamalarında kullanılır."
        }
        isOpen={isOpen}
        onClose={closeModal}
        title={isEditMode ? "Sürücü Güncelle" : "Sürücü Ekle"}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <Field
              label="Ad"
              onChange={(value) => updateField("firstName", value)}
              placeholder="Mehmet"
              required
              value={form.firstName}
            />

            <Field
              label="Soyad"
              onChange={(value) => updateField("lastName", value)}
              placeholder="Kaya"
              required
              value={form.lastName}
            />

            <Field
              label="E-posta"
              onChange={(value) => updateField("email", value)}
              placeholder="mehmet@abcturizm.com"
              type="email"
              value={form.email}
            />

            <Field
              label="Telefon"
              onChange={(value) => updateField("phone", value)}
              placeholder="0532 000 00 00"
              value={form.phone}
            />

            <Field
              label="Kimlik No"
              onChange={(value) => updateField("identityNumber", value)}
              placeholder="Opsiyonel"
              value={form.identityNumber}
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