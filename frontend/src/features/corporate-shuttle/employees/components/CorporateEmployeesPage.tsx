"use client";

import { FormEvent, useState } from "react";
import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { createCorporateEmployee } from "../services/employee.service";
import type { CorporateEmployee } from "../types";

type EmployeeFormState = {
  email: string;
  firstName: string;
  identityNumber: string;
  lastName: string;
  phone: string;
};

const emptyForm: EmployeeFormState = {
  email: "",
  firstName: "",
  identityNumber: "",
  lastName: "",
  phone: "",
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

export function CorporateEmployeesPage({
  clientId,
  employees,
}: {
  clientId: number;
  employees: CorporateEmployee[];
}) {
  const [items, setItems] = useState(employees);
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof EmployeeFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const createdEmployee = await createCorporateEmployee(clientId, form);
      setItems((current) => [createdEmployee, ...current]);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Çalışan oluşturulamadı. Backend veya validasyon hatasını kontrol edin.",
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
            Çalışan Ekle
          </Button>
        }
        description="Corporate shuttle modülünde servis kullanacak çalışan kayıtlarını yönetin."
        eyebrow="Corporate Shuttle"
        title="Employees"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Servis planına dahil edilecek"
            icon={Users}
            label="Toplam Çalışan"
            value={items.length}
          />
          <MetricCard
            hint="Departman bazlı gruplama için"
            icon={Users}
            label="Aktif Çalışan"
            value={items.filter((employee) => employee.isActive).length}
          />
          <MetricCard
            hint="Adres veya durak bilgisi bekleyen"
            icon={Users}
            label="Bekleyen"
            value={items.filter((employee) => !employee.isActive).length}
          />
        </div>

        <TableShell
          description="Şirket yöneticisinin girdiği çalışan kayıtları admin tarafından izlenir."
          searchPlaceholder="Çalışan, departman veya durak ara..."
          title="Çalışan Listesi"
        >
          <table className="w-full min-w-[1050px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Çalışan
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Departman
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Telefon
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Adres / Bölge
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tercih Edilen Durak
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((employee) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={employee.employeeId}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {employee.email || "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {employee.department || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {employee.phone || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {employee.district || "-"}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {employee.preferredStop || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={employee.isActive ? "active" : "pending"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Yeni çalışan backend'e kaydedilir ve listeye eklenir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Çalışan Ekle"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <InputField
              label="Ad"
              onChange={(value) => updateField("firstName", value)}
              placeholder="Ayşe"
              required
              value={form.firstName}
            />
            <InputField
              label="Soyad"
              onChange={(value) => updateField("lastName", value)}
              placeholder="Kaya"
              required
              value={form.lastName}
            />
            <InputField
              label="E-posta"
              onChange={(value) => updateField("email", value)}
              placeholder="ayse.kaya@firma.com"
              type="email"
              value={form.email}
            />
            <InputField
              label="Telefon"
              onChange={(value) => updateField("phone", value)}
              placeholder="0532 000 00 00"
              value={form.phone}
            />
            <InputField
              label="Kimlik No"
              onChange={(value) => updateField("identityNumber", value)}
              placeholder="Opsiyonel"
              value={form.identityNumber}
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
