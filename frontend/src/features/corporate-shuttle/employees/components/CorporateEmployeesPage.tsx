"use client";

import { FormEvent, useState } from "react";
import { Edit2Icon, Plus, Trash2Icon, Users } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import {
  deleteCorporateEmployee,
  editCorporateEmployee,
} from "../services/employee.service";

import type {
  CorporateEmployee,
  CorporateEmployeeEditRequest,
} from "../types";

import { registerUser } from "@/features/auth/services/auth.service";
import { RegisterUserPayload } from "@/features/auth/types";

type EmployeeFormState = {
  email: string;
  firstName: string;
  identityNumber: string;
  lastName: string;
  phone: string;
  password: string;
  isActive: boolean;
};

const emptyForm: EmployeeFormState = {
  email: "",
  firstName: "",
  password: "",
  identityNumber: "",
  lastName: "",
  phone: "",
  isActive: true,
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

function getEmployeeKey(employee: CorporateEmployee, index: number) {
  return (
    employee.userId ??
    employee.employeeId ??
    `${employee.clientId ?? "client"}-${employee.email ?? "employee"}-${index}`
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingEmployee, setEditingEmployee] =
    useState<CorporateEmployee | null>(null);

  function updateField(key: keyof EmployeeFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateModal() {
    setEditingEmployee(null);
    setForm(emptyForm);
    setError(null);
    setIsOpen(true);
  }

  function openEditModal(employee: CorporateEmployee) {
    setEditingEmployee(employee);
    setError(null);

    setForm({
      email: employee.email ?? "",
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      phone: employee.phone ?? "",
      identityNumber: "",
      password: "",
      isActive: employee.isActive ?? true,
    });

    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditingEmployee(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const isEditMode = editingEmployee !== null;

    try {
      if (isEditMode) {
        const userId = editingEmployee.userId;

        if (!userId) {
          throw new Error("Güncellenecek çalışan için userId bulunamadı.");
        }

        const editPayload: CorporateEmployeeEditRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          identityNumber: form.identityNumber,
          isActive: form.isActive,
        };

        const updatedEmployee = await editCorporateEmployee(
          clientId,
          userId,
          editPayload,
        );

        if (!updatedEmployee) {
          throw new Error("Çalışan güncellenemedi.");
        }

        setItems((current) =>
          current.map((employee) =>
            employee.userId === userId
              ? {
                  ...employee,
                  firstName: updatedEmployee.firstName,
                  lastName: updatedEmployee.lastName,
                  email: updatedEmployee.email,
                  phone: updatedEmployee.phone,
                  isActive: Boolean(updatedEmployee.isActive),
                }
              : employee,
          ),
        );
      } else {
        const registerUserPayload: RegisterUserPayload = {
          clientId: clientId,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          password: form.password,
          roleId: 7,
          phone: form.phone,
          identityNumber: form.identityNumber,
        };

        await registerUser(registerUserPayload);

        const createdEmployee: CorporateEmployee = {
          clientId: clientId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          isActive: true,
        };

        setItems((current) => [createdEmployee, ...current]);
      }

      closeModal();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : isEditMode
            ? "Çalışan güncellenemedi. Backend veya validasyon hatasını kontrol edin."
            : "Çalışan oluşturulamadı. Backend veya validasyon hatasını kontrol edin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(employee: CorporateEmployee) {
    const userId = employee.userId;

    if (!userId) {
      setError("Silinecek çalışan için userId bulunamadı.");
      return;
    }

    const employeeName = `${employee.firstName ?? ""} ${
      employee.lastName ?? ""
    }`.trim();

    const isConfirmed = window.confirm(
      employeeName
        ? `${employeeName} adlı çalışanı silmek istediğine emin misin?`
        : "Bu çalışanı silmek istediğine emin misin?",
    );

    if (!isConfirmed) return;

    setError(null);
    setIsDeleting(true);

    try {
      await deleteCorporateEmployee(clientId, userId);

      setItems((current) =>
        current.filter((item) => item.userId !== userId),
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Çalışan silinemedi. Backend veya bağlantı hatasını kontrol edin.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <PageSection
        action={
          <Button onClick={openCreateModal}>
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

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

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

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((employee, index) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={getEmployeeKey(employee, index)}
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
                    <StatusBadge
                      status={employee.isActive ? "active" : "pending"}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-teal-600"
                        onClick={() => openEditModal(employee)}
                        type="button"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </button>

                      <button
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isDeleting}
                        onClick={() => handleDelete(employee)}
                        type="button"
                      >
                        <Trash2Icon className="h-4 w-4" />
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
          editingEmployee
            ? "Seçili çalışan bilgilerini güncelleyin."
            : "Yeni çalışan backend'e kaydedilir ve listeye eklenir."
        }
        isOpen={isOpen}
        onClose={closeModal}
        title={editingEmployee ? "Çalışan Düzenle" : "Çalışan Ekle"}
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

            {!editingEmployee ? (
              <InputField
                label="Şifre"
                onChange={(value) => updateField("password", value)}
                placeholder="Yolcu uygulama Şifresi"
                required
                value={form.password}
              />
            ) : null}

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

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Durum
              </span>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isActive: event.target.value === "true",
                  }))
                }
                value={String(form.isActive)}
              >
                <option value="true">Aktif</option>
                <option value="false">Pasif</option>
              </select>
            </label>
          </div>

          {error ? <p className="px-6 text-sm text-red-600">{error}</p> : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button onClick={closeModal} type="button" variant="secondary">
              Vazgeç
            </Button>

            <Button disabled={isSubmitting} type="submit">
              {isSubmitting
                ? editingEmployee
                  ? "Güncelleniyor..."
                  : "Kaydediliyor..."
                : editingEmployee
                  ? "Güncelle"
                  : "Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}