"use client";

import { FormEvent, useState } from "react";
import { Plus, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createDriver } from "../services/driver.service";
import type { Driver } from "../types";

type DriverFormState = {
  email: string;
  firstName: string;
  identityNumber: string;
  lastName: string;
  phone: string;
};

const emptyForm: DriverFormState = {
  email: "",
  firstName: "",
  identityNumber: "",
  lastName: "",
  phone: "",
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

export function DriversPage({ drivers }: { drivers: Driver[] }) {
  const [items, setItems] = useState(drivers);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof DriverFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdDriver = await createDriver(form);
      setItems((current) => [createdDriver, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Surucu olusturulamadi.",
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
            Surucu Ekle
          </Button>
        }
        description="ABC Turizm operasyonunda servis rotalarina atanacak suruculeri yonetin."
        eyebrow="Admin Operation"
        title="Drivers"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Sistemde kayitli"
            icon={UserRoundCheck}
            label="Toplam Surucu"
            value={items.length}
          />
          <MetricCard
            hint="Atamaya hazir"
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

        <TableShell
          description="Surucu kayitlari rota onayindan sonraki servis atama adiminda kullanilir."
          searchPlaceholder="Surucu, telefon veya e-posta ara..."
          title="Surucu Listesi"
        >
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Surucu
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
              </tr>
            </thead>
            <tbody>
              {items.map((driver) => (
                <tr className="border-b border-slate-100 last:border-0" key={driver.userId}>
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
                    <StatusBadge status={driver.isActive ? "active" : "inactive"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Yeni surucu backend'e kaydedilir ve rota atamalarinda kullanilir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Surucu Ekle"
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
