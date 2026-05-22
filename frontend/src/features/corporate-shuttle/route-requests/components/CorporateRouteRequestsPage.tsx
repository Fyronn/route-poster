"use client";

import { FormEvent, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  MapPin,
  Plus,
  Route,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
import type { CorporateEmployee } from "@/features/corporate-shuttle/employees/types";
import type { CorporateStopRequest } from "@/features/corporate-shuttle/stops/types";

import { createCorporateRouteRequest } from "../services/route-request.service";
import type { CorporateRouteRequest, RouteRequestStopPlan } from "../types";

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
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
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

function PanelCard({
  children,
  description,
  icon,
  right,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              {icon}
            </div>
          ) : null}

          <div>
            <h3 className="text-base font-bold text-slate-950">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {right}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function normalizeStopPlan(plan: RouteRequestStopPlan[]) {
  return plan.map((stop, index) => ({ ...stop, sequence: index + 1 }));
}

function getStopId(stop: CorporateStopRequest) {
  const stopId = Number(stop.stopId);
  return Number.isFinite(stopId) && stopId > 0 ? stopId : null;
}

function getEmployeeId(employee: CorporateEmployee) {
  const employeeId = Number(employee.userId ?? employee.employeeId);
  return Number.isFinite(employeeId) && employeeId > 0 ? employeeId : null;
}

function getEmployeeName(employee: CorporateEmployee) {
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
    "Isimsiz calisan"
  );
}

function getRequestKey(request: CorporateRouteRequest, index: number) {
  return (
    request.routeId ??
    `${request.clientId ?? "client"}-${request.routeName ?? "route"}-${index}`
  );
}

function getRouteStopCount(request: CorporateRouteRequest) {
  return (
    request.stops?.length ??
    request.stopIds?.length ??
    request.plannedStops?.length ??
    request.stopCount ??
    null
  );
}

function getRoutePassengerCount(request: CorporateRouteRequest) {
  return (
    request.passengers?.length ??
    request.passengerIds?.length ??
    request.selectedPassengers?.length ??
    request.employeeCount ??
    null
  );
}

function formatRouteScope(request: CorporateRouteRequest) {
  return `${getRouteStopCount(request) ?? "-"} durak / ${
    getRoutePassengerCount(request) ?? "-"
  } calisan`;
}

function normalizeStatus(status?: string | null) {
  const normalized = String(status ?? "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");

  return normalized;
}

function isRequested(status?: string | null) {
  return normalizeStatus(status) === "requested";
}

function isApproved(status?: string | null) {
  return normalizeStatus(status) === "approved";
}

function isRejected(status?: string | null) {
  return normalizeStatus(status) === "rejected";
}

function getDecisionReason(request: CorporateRouteRequest) {
  return (
    request.rejectionReason ||
    request.rejectReason ||
    request.decisionNote ||
    request.comments ||
    request.operatorNote ||
    null
  );
}

export function CorporateRouteRequestsPage({
  clientId,
  employees,
  requests,
  stops,
}: {
  clientId: number;
  employees: CorporateEmployee[];
  requests: CorporateRouteRequest[];
  stops: CorporateStopRequest[];
}) {
  const [items, setItems] = useState(requests);
  const [form, setForm] = useState(emptyForm);
  const [stopPlan, setStopPlan] = useState<RouteRequestStopPlan[]>([]);
  const [selectedPassengerIds, setSelectedPassengerIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof RouteRequestFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openRouteRequestPanel() {
    setError(null);
    setMessage(null);
    setIsOpen(true);
  }

  function closeRouteRequestPanel() {
    setIsOpen(false);
  }

  function resetRouteRequestForm() {
    setForm(emptyForm);
    setStopPlan([]);
    setSelectedPassengerIds([]);
  }

  function togglePassenger(employee: CorporateEmployee) {
    const employeeId = getEmployeeId(employee);
    if (employeeId === null) return;

    setSelectedPassengerIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  }

  function addStop(stop: CorporateStopRequest) {
    const stopId = getStopId(stop);
    if (stopId === null) return;

    setStopPlan((current) => {
      if (current.some((item) => item.stopId === stopId)) return current;

      return [
        ...current,
        {
          sequence: current.length + 1,
          stopId,
          stopName: stop.stopName || "",
        },
      ];
    });
  }

  function removeStop(stopId: number) {
    setStopPlan((current) =>
      normalizeStopPlan(current.filter((stop) => stop.stopId !== stopId)),
    );
  }

  function moveStop(stopId: number, direction: "up" | "down") {
    setStopPlan((current) => {
      const index = current.findIndex((stop) => stop.stopId === stopId);
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return normalizeStopPlan(next);
    });
  }

  function updateStopTime(stopId: number, estimatedArrivalTime: string) {
    setStopPlan((current) =>
      current.map((stop) =>
        stop.stopId === stopId ? { ...stop, estimatedArrivalTime } : stop,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      if (stopPlan.length === 0) {
        throw new Error("Rota talebi icin en az bir durak secmelisiniz.");
      }

      if (selectedPassengerIds.length === 0) {
        throw new Error("Rota talebi icin en az bir calisan secmelisiniz.");
      }

      const createdRequest = await createCorporateRouteRequest(clientId, {
        direction: form.direction,
        passengerIds: selectedPassengerIds,
        plannedStartTime: `${form.plannedStartTime}:00`,
        plannedStops: stopPlan,
        routeName: form.routeName,
        shiftType: form.shift,
        operatingDays: form.workingDays,
      });

      setItems((current) => [
        {
          ...createdRequest,
          status: "Requested",
        },
        ...current,
      ]);

      resetRouteRequestForm();
      setIsOpen(false);
      setMessage("Rota talebi olusturuldu ve ABC Turizm onayina dustu.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Rota talebi olusturulamadi. Backend veya validasyon hatasini kontrol edin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSection
        action={
          <Button onClick={openRouteRequestPanel}>
            <Plus className="h-4 w-4" />
            Rota Talebi Ekle
          </Button>
        }
        description="Duraklari siralayip calisanlari secerek rota talebi olusturun. Talep direkt ABC Turizm onayina duser."
        eyebrow="Servis Yonetimi"
        title="Rota Talepleri"
      >
        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            hint="Kurum tarafindan girildi"
            icon={Route}
            label="Toplam Talep"
            value={items.length}
          />

          <MetricCard
            hint="ABC Turizm incelemesi bekliyor"
            icon={Route}
            label="Onay Bekleyen"
            value={items.filter((request) => isRequested(request.status)).length}
          />

          <MetricCard
            hint="Admin tarafindan onaylandi"
            icon={Route}
            label="Onaylanan"
            value={items.filter((request) => isApproved(request.status)).length}
          />

          <MetricCard
            hint="Red sebebiyle geri donen"
            icon={X}
            label="Reddedilen"
            value={items.filter((request) => isRejected(request.status)).length}
          />
        </div>

        <TableShell
          description="Durak sirasi ve opsiyonel hedef saat bilgileri rota talebiyle birlikte izlenir."
          searchPlaceholder="Rota veya baslangic noktasi ara..."
          title="Rota Talepleri"
        >
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Rota
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Plan
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durak / Calisan
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((request, index) => (
                <tr
                  className="border-b border-slate-100 last:border-0"
                  key={getRequestKey(request, index)}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {request.routeName || "-"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.clientName || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="neutral">{request.shiftType || "-"}</Badge>
                    <p className="mt-2 text-xs text-slate-500">
                      {request.operatingDays || "-"} /{" "}
                      {request.plannedStartTime || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.plannedStops?.length ? (
                      <div className="flex max-w-[420px] flex-wrap gap-1.5">
                        {request.plannedStops.map((stop, index) => (
                          <Badge
                            key={`${request.routeId ?? "route"}-${
                              stop.stopId
                            }-${index}`}
                            variant="neutral"
                          >
                            {stop.sequence}. {stop.stopName}
                            {stop.estimatedArrivalTime
                              ? ` / ${stop.estimatedArrivalTime}`
                              : ""}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      formatRouteScope(request)
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={request.status || "Draft"} />

                    {isRejected(request.status) && getDecisionReason(request) ? (
                      <p className="mt-2 max-w-[280px] text-xs font-medium text-red-600">
                        Red sebebi: {getDecisionReason(request)}
                      </p>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-slate-50 shadow-2xl">
            <div className="flex items-start justify-between gap-6 border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Route className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                      Servis Yönetimi
                    </p>
                    <h2 className="text-2xl font-bold text-slate-950">
                      Rota Talebi Ekle
                    </h2>
                  </div>
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  Rota bilgilerini gir, durak sırasını oluştur ve bu rotada
                  taşınacak çalışanları seç. Talep oluşturulduktan sonra ABC
                  Turizm onay ekranına düşer.
                </p>
              </div>

              <button
                className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={closeRouteRequestPanel}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleSubmit}
            >
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                  <div className="space-y-6">
                    <PanelCard
                      description="Rotanın temel bilgilerini buradan belirleyin."
                      icon={<Clock className="h-5 w-5" />}
                      title="Rota Bilgileri"
                    >
                      <div className="grid gap-4">
                        <InputField
                          label="Rota adı"
                          onChange={(value) => updateField("routeName", value)}
                          placeholder="Kadıköy - Maslak Sabah Servisi"
                          required
                          value={form.routeName}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
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
                            onChange={(value) =>
                              updateField("direction", value)
                            }
                            options={[
                              { label: "Gidiş", value: "Gidis" },
                              { label: "Dönüş", value: "Donus" },
                            ]}
                            value={form.direction}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <InputField
                            label="Başlangıç saati"
                            onChange={(value) =>
                              updateField("plannedStartTime", value)
                            }
                            required
                            type="time"
                            value={form.plannedStartTime}
                          />

                          <SelectField
                            label="Çalışma günleri"
                            onChange={(value) =>
                              updateField("workingDays", value)
                            }
                            options={[
                              {
                                label: "Pazartesi - Cuma",
                                value: "1,2,3,4,5",
                              },
                              {
                                label: "Pazartesi - Cumartesi",
                                value: "1,2,3,4,5,6",
                              },
                            ]}
                            value={form.workingDays}
                          />
                        </div>
                      </div>
                    </PanelCard>

                    <PanelCard
                      description="Seçtiğin durak ve çalışan sayısı burada özetlenir."
                      icon={<Route className="h-5 w-5" />}
                      title="Talep Özeti"
                    >
                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold uppercase text-slate-500">
                            Rota
                          </p>
                          <p className="mt-1 font-bold text-slate-950">
                            {form.routeName || "Henüz rota adı girilmedi"}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                            <p className="text-xs font-semibold uppercase text-teal-700">
                              Durak
                            </p>
                            <p className="mt-1 text-2xl font-black text-teal-800">
                              {stopPlan.length}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase text-blue-700">
                              Çalışan
                            </p>
                            <p className="mt-1 text-2xl font-black text-blue-800">
                              {selectedPassengerIds.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </PanelCard>
                  </div>

                  <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <PanelCard
                        description="Rota içinde kullanılacak durakları seçin."
                        icon={<MapPin className="h-5 w-5" />}
                        right={<Badge variant="teal">{stops.length} durak</Badge>}
                        title="Mevcut Duraklar"
                      >
                        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                          {stops.length ? (
                            stops.map((stop, index) => {
                              const stopId = getStopId(stop);
                              const isSelected = stopPlan.some(
                                (item) => item.stopId === stopId,
                              );

                              return (
                                <button
                                  className={[
                                    "group flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition",
                                    isSelected
                                      ? "border-teal-200 bg-teal-50"
                                      : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/60",
                                  ].join(" ")}
                                  disabled={isSelected || stopId === null}
                                  key={
                                    stopId ??
                                    `${stop.stopName ?? "stop"}-${index}`
                                  }
                                  onClick={() => addStop(stop)}
                                  type="button"
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate font-bold text-slate-950">
                                      {stop.stopName || "İsimsiz durak"}
                                    </span>
                                    <span className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                      {stop.address || "Adres bilgisi yok"}
                                    </span>
                                  </span>

                                  <span
                                    className={[
                                      "shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                                      isSelected
                                        ? "bg-teal-600 text-white"
                                        : "bg-slate-100 text-slate-600 group-hover:bg-teal-600 group-hover:text-white",
                                    ].join(" ")}
                                  >
                                    {isSelected ? "Eklendi" : "Ekle"}
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                              Önce durak talebi oluşturun.
                            </div>
                          )}
                        </div>
                      </PanelCard>

                      <PanelCard
                        description="Durakları yukarı/aşağı taşıyarak rota sırasını belirleyin."
                        icon={<Route className="h-5 w-5" />}
                        right={
                          <Badge variant="teal">{stopPlan.length} seçildi</Badge>
                        }
                        title="Seçilen Rota Sırası"
                      >
                        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                          {stopPlan.length ? (
                            stopPlan.map((stop, index) => (
                              <div
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                key={stop.stopId}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-sm font-black text-white">
                                    {stop.sequence}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold text-slate-950">
                                      {stop.stopName}
                                    </p>

                                    <label className="mt-3 block">
                                      <span className="text-xs font-semibold text-slate-500">
                                        Tahmini varış saati
                                      </span>
                                      <input
                                        className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                                        onChange={(event) =>
                                          updateStopTime(
                                            stop.stopId,
                                            event.target.value,
                                          )
                                        }
                                        type="time"
                                        value={stop.estimatedArrivalTime ?? ""}
                                      />
                                    </label>
                                  </div>

                                  <div className="flex shrink-0 flex-col gap-1">
                                    <button
                                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                                      disabled={index === 0}
                                      onClick={() =>
                                        moveStop(stop.stopId, "up")
                                      }
                                      type="button"
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </button>

                                    <button
                                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                                      disabled={index === stopPlan.length - 1}
                                      onClick={() =>
                                        moveStop(stop.stopId, "down")
                                      }
                                      type="button"
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </button>

                                    <button
                                      className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                      onClick={() => removeStop(stop.stopId)}
                                      type="button"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                              <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                              <p className="mt-3 font-semibold text-slate-700">
                                Henüz durak seçilmedi
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Sol taraftan durak ekleyerek rota sırasını
                                oluşturun.
                              </p>
                            </div>
                          )}
                        </div>
                      </PanelCard>
                    </div>

                    <PanelCard
                      description="Bu rotada taşınacak çalışanları seçin. Kartlara tıklayarak seçim yapabilirsiniz."
                      icon={<Users className="h-5 w-5" />}
                      right={
                        <Badge variant="teal">
                          {selectedPassengerIds.length} çalışan seçildi
                        </Badge>
                      }
                      title="Çalışanlar"
                    >
                      <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
                        {employees.length ? (
                          employees.map((employee, index) => {
                            const employeeId = getEmployeeId(employee);
                            const isSelected =
                              employeeId !== null &&
                              selectedPassengerIds.includes(employeeId);

                            return (
                              <button
                                className={[
                                  "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition",
                                  isSelected
                                    ? "border-teal-300 bg-teal-50 shadow-sm"
                                    : "border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/60",
                                ].join(" ")}
                                disabled={employeeId === null}
                                key={
                                  employeeId ??
                                  `${employee.email ?? "employee"}-${index}`
                                }
                                onClick={() => togglePassenger(employee)}
                                type="button"
                              >
                                <span className="min-w-0">
                                  <span className="block truncate font-bold text-slate-950">
                                    {getEmployeeName(employee)}
                                  </span>
                                  <span className="mt-1 block truncate text-xs text-slate-500">
                                    {employee.email || employee.phone || "-"}
                                  </span>
                                </span>

                                <span
                                  className={[
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                                    isSelected
                                      ? "border-teal-600 bg-teal-600"
                                      : "border-slate-300 bg-white",
                                  ].join(" ")}
                                >
                                  {isSelected ? (
                                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                  ) : null}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 md:col-span-2 xl:col-span-3">
                            Önce çalışan ekleyin.
                          </div>
                        )}
                      </div>
                    </PanelCard>
                  </div>
                </div>
              </div>

              {error ? (
                <div className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                    {stopPlan.length} durak
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                    {selectedPassengerIds.length} çalışan
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
                    {form.shift} / {form.direction}
                  </span>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    onClick={closeRouteRequestPanel}
                    type="button"
                    variant="secondary"
                  >
                    Vazgeç
                  </Button>

                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Kaydediliyor..." : "Rota Talebini Kaydet"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}