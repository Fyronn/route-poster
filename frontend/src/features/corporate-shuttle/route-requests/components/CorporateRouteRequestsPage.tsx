"use client";

import { FormEvent, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Route, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
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

function normalizeStopPlan(plan: RouteRequestStopPlan[]) {
  return plan.map((stop, index) => ({ ...stop, sequence: index + 1 }));
}

export function CorporateRouteRequestsPage({
  clientId,
  requests,
  stops,
}: {
  clientId: number;
  requests: CorporateRouteRequest[];
  stops: CorporateStopRequest[];
}) {
  const [items, setItems] = useState(requests);
  const [form, setForm] = useState(emptyForm);
  const [stopPlan, setStopPlan] = useState<RouteRequestStopPlan[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof RouteRequestFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addStop(stop: CorporateStopRequest) {
    setStopPlan((current) => {
      if (current.some((item) => item.stopId === stop.stopId)) return current;

      return [
        ...current,
        {
          sequence: current.length + 1,
          stopId: stop.stopId,
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
    setIsSubmitting(true);

    try {
      if (stopPlan.length === 0) {
        throw new Error("Rota talebi icin en az bir durak secmelisiniz.");
      }

      const createdRequest = await createCorporateRouteRequest(clientId, {
        direction: form.direction,
        plannedStartTime: `${form.plannedStartTime}:00`,
        plannedStops: stopPlan,
        routeName: form.routeName,
        shiftType: form.shift,
        operatingDays: form.workingDays,
      });

      setItems((current) => [createdRequest, ...current]);
      setForm(emptyForm);
      setStopPlan([]);
      setIsOpen(false);
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
          <Button
            onClick={() => {
              setError(null);
              setIsOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Rota Talebi Ekle
          </Button>
        }
        description="Servis yoneticisi kendi kurumuna ait duraklari siraya alarak rota talebi olusturur."
        eyebrow="Corporate Shuttle"
        title="Route Requests"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Kurum tarafindan girildi"
            icon={Route}
            label="Toplam Talep"
            value={items.length}
          />
          <MetricCard
            hint="ABC Turizm incelemesi bekliyor"
            icon={Route}
            label="Gonderilen"
            value={items.filter((request) => request.status?.toLowerCase() === "submitted").length}
          />
          <MetricCard
            hint="Operasyona aktarilabilir"
            icon={Route}
            label="Onayli Rota"
            value={items.filter((request) => request.status?.toLowerCase() === "approved").length}
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
                  Baslangic / Bitis
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Vardiya
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durak Sirasi
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
                  key={request.routeId}
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-950">
                      {request.routeName || "-"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.clientName || "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    <p>{request.startPoint || "-"}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {request.endPoint || "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="neutral">{request.shiftType || "-"}</Badge>
                    <p className="mt-2 text-xs text-slate-500">
                      {request.operatingDays || "-"} / {request.plannedStartTime || "-"}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.plannedStops?.length ? (
                      <div className="flex max-w-[320px] flex-wrap gap-1.5">
                        {request.plannedStops.map((stop) => (
                          <Badge key={stop.stopId} variant="neutral">
                            {stop.sequence}. {stop.stopName}
                            {stop.estimatedArrivalTime
                              ? ` / ${stop.estimatedArrivalTime}`
                              : ""}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      `${request.stopCount || 0} durak / ${request.employeeCount || 0} calisan`
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {request.estimatedDistanceKm || 0} km /{" "}
                    {request.estimatedDurationMinutes || 0} dk
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={request.status?.toLowerCase() || "requested"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Durak sirasi ve hedef saatler rota talebi ile birlikte gonderilir."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Rota Talebi Ekle"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <InputField
              label="Rota adi"
              onChange={(value) => updateField("routeName", value)}
              placeholder="Kadikoy - Maslak Sabah Servisi"
              required
              value={form.routeName}
            />
            <SelectField
              label="Vardiya"
              onChange={(value) => updateField("shift", value)}
              options={[
                { label: "Sabah", value: "Sabah" },
                { label: "Aksam", value: "Aksam" },
                { label: "Vardiya", value: "Vardiya" },
              ]}
              value={form.shift}
            />
            <SelectField
              label="Yon"
              onChange={(value) => updateField("direction", value)}
              options={[
                { label: "Gidis", value: "Gidis" },
                { label: "Donus", value: "Donus" },
              ]}
              value={form.direction}
            />
            <InputField
              label="Baslangic saati"
              onChange={(value) => updateField("plannedStartTime", value)}
              required
              type="time"
              value={form.plannedStartTime}
            />
            <SelectField
              label="Calisma gunleri"
              onChange={(value) => updateField("workingDays", value)}
              options={[
                { label: "Pazartesi - Cuma", value: "1,2,3,4,5" },
                { label: "Pazartesi - Cumartesi", value: "1,2,3,4,5,6" },
              ]}
              value={form.workingDays}
            />

            <div className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      Durak sirasi
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Eklenen duraklar bu sirayla rota talebine baglanir.
                      Hedef saat opsiyoneldir.
                    </p>
                  </div>
                  <Badge variant="teal">{stopPlan.length} durak</Badge>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Mevcut duraklar
                    </p>
                    <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                      {stops.length ? (
                        stops.map((stop) => {
                          const isSelected = stopPlan.some(
                            (item) => item.stopId === stop.stopId,
                          );

                          return (
                            <button
                              className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-left text-sm hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isSelected}
                              key={stop.stopId}
                              onClick={() => addStop(stop)}
                              type="button"
                            >
                              <span>
                                <span className="font-semibold text-slate-900">
                                  {stop.stopName}
                                </span>
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {stop.address}
                                </span>
                              </span>
                              <span className="text-xs font-semibold text-teal-700">
                                {isSelected ? "Eklendi" : "Ekle"}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                          Once durak talebi olusturun.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Secilen rota sirasi
                    </p>
                    <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                      {stopPlan.length ? (
                        stopPlan.map((stop, index) => (
                          <div
                            className="rounded-xl border border-slate-200 p-3"
                            key={stop.stopId}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                                {stop.sequence}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-950">
                                  {stop.stopName}
                                </p>
                                <input
                                  className="mt-2 h-9 w-full rounded-lg border border-slate-200 px-2 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-50"
                                  onChange={(event) =>
                                    updateStopTime(
                                      stop.stopId,
                                      event.target.value,
                                    )
                                  }
                                  type="time"
                                  value={stop.estimatedArrivalTime ?? ""}
                                />
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  disabled={index === 0}
                                  onClick={() => moveStop(stop.stopId, "up")}
                                  size="icon"
                                  variant="secondary"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  disabled={index === stopPlan.length - 1}
                                  onClick={() => moveStop(stop.stopId, "down")}
                                  size="icon"
                                  variant="secondary"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => removeStop(stop.stopId)}
                                  size="icon"
                                  variant="danger"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                          Sol taraftan durak ekleyin.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
