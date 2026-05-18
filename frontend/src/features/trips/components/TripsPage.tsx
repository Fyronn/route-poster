"use client";

import { FormEvent, useState } from "react";
import { Calendar, Clock, Plus, Users, ShieldAlert, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
import { formatDate } from "@/lib/utils";

import { createTrip, createTripAssignment } from "../services/trip.service";
import type { Trip, TripAssignment } from "../types";
import type { RouteRequestApproval } from "@/features/route-request-approvals/types";
import type { Vehicle } from "@/features/vehicles/types";
import type { Driver } from "@/features/drivers/types";

type FormState = {
  routeId: string;
  vehicleId: string;
  driverId: string;
  tripDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

const emptyForm: FormState = {
  routeId: "",
  vehicleId: "",
  driverId: "",
  tripDate: new Date().toISOString().slice(0, 10),
  startTime: "08:00",
  endDate: new Date().toISOString().slice(0, 10),
  endTime: "09:00",
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
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 bg-white"
        onChange={(event) => onChange(event.target.value)}
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
  required,
  value,
  options,
  placeholder,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <select
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 bg-white"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`w-11 h-6 rounded-full transition-colors duration-250 relative ${checked ? 'bg-teal-500' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-250 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors select-none">
        {label}
      </span>
    </label>
  );
}

export function TripsPage({
  initialTripAssignments,
  trips,
  routes,
  vehicles,
  drivers,
}: {
  initialTripAssignments: TripAssignment[];
  trips: Trip[];
  routes: RouteRequestApproval[];
  vehicles: Vehicle[];
  drivers: Driver[];
}) {
  const [items, setItems] = useState<TripAssignment[]>(initialTripAssignments);
  const [localTrips, setLocalTrips] = useState<Trip[]>(trips);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter for only approved routes
  const approvedRoutes = routes.filter(
    (route) => route.status?.toLowerCase() === "approved"
  );

  function updateField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!form.routeId || !form.vehicleId || !form.driverId) {
        throw new Error("Lütfen Rota, Araç ve Şoför alanlarını eksiksiz seçiniz.");
      }

      const finalEndDate = isMultiDay ? form.endDate : form.tripDate;

      // 1. Create the Trip
      const createdTrip = await createTrip({
        routeId: Number(form.routeId),
        tripDate: form.tripDate,
        startTime: `${form.tripDate}T${form.startTime}:00.000Z`,
        endTime: `${finalEndDate}T${form.endTime}:00.000Z`,
      });

      // 2. Create the Trip Assignment
      const createdAssignment = await createTripAssignment({
        tripId: createdTrip.tripId,
        vehicleId: Number(form.vehicleId),
        driverId: Number(form.driverId),
        serviceSupervisorId: null,
        createdBy: null,
      });

      // Hydrate name info from static datasets for immediate UI rendering
      const selectedVehicle = vehicles.find((v) => v.vehicleId === Number(form.vehicleId));
      const selectedDriver = drivers.find((d) => d.userId === Number(form.driverId));

      const hydratedAssignment: TripAssignment = {
        ...createdAssignment,
        vehiclePlateNumber: selectedVehicle?.plateNumber || createdAssignment.vehiclePlateNumber,
        driverFirstName: selectedDriver?.firstName || createdAssignment.driverFirstName,
        driverLastName: selectedDriver?.lastName || createdAssignment.driverLastName,
        tripDate: form.tripDate,
      };

      setItems((current) => [hydratedAssignment, ...current]);
      setLocalTrips((current) => [createdTrip, ...current]);
      setForm(emptyForm);
      setIsMultiDay(false);
      setIsOpen(false);
    } catch (submitError) {
      console.error("Submit error:", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Sefer planı veya ataması oluşturulurken bir hata oluştu."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Metric computations
  const totalAssigned = items.length;
  const activeTripsCount = localTrips.filter((t) => t.status?.toLowerCase() === "started").length;
  const completedTripsCount = localTrips.filter((t) => t.status?.toLowerCase() === "completed").length;

  return (
    <>
      <PageSection
        action={
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Sefer Oluştur
          </Button>
        }
        description="Ataması tamamlanmış ve planlanmış tüm servis seferlerini izleyin ve yönetin."
        title="Seferler ve Atamalar"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            hint="Atama yapılan toplam sefer sayısı"
            icon={Calendar}
            label="Toplam Atanan Sefer"
            value={totalAssigned}
          />
          <MetricCard
            hint="Şu an yolda olan aktif araçlar"
            icon={Clock}
            label="Yolda / Aktif"
            value={activeTripsCount}
          />
          <MetricCard
            hint="Bugün tamamlanan seferler"
            icon={Users}
            label="Tamamlanan Sefer"
            value={completedTripsCount}
          />
        </div>

        <TableShell
          description="Seferler onaylanmış rotalar üzerinden araç ve şoför bazlı listelenir."
          searchPlaceholder="Plaka, şoför veya rota ara..."
          title="Güncel Sefer Planı"
        >
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Sefer Kodu
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Tarih / Saat
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Rota / Şirket
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Atanan Araç (Plaka)
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Atanan Şoför
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Durum
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400 text-sm">
                    Kayıtlı sefer ataması bulunamadı.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const trip = localTrips.find((t) => t.tripId === item.tripId);
                  const route = routes.find((r) => r.routeId === trip?.routeId);
                  const routeLabel = route
                    ? `${route.routeName} (${route.clientName || "Bilinmeyen Müşteri"})`
                    : `Rota #${trip?.routeId || "Bilinmiyor"}`;

                  const startD = trip?.startTime ? new Date(trip.startTime) : null;
                  const endD = trip?.endTime ? new Date(trip.endTime) : null;

                  const isDifferentDay =
                    startD && endD && startD.getUTCDate() !== endD.getUTCDate();

                  const formattedStartDate = item.tripDate || trip?.tripDate || "";
                  const formattedEndDate = endD ? endD.toISOString().slice(0, 10) : "";

                  const startTimeStr = startD
                    ? startD.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })
                    : "-";
                  const endTimeStr = endD
                    ? endD.toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })
                    : "";

                  return (
                    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors" key={item.id}>
                      <td className="px-5 py-4 font-semibold text-slate-900 text-sm">
                        TRP-{item.tripId}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {isDifferentDay ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-teal-800 flex items-center gap-1 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-lg text-xs w-fit">
                              <CalendarRange className="h-3 w-3 inline" /> Çoklu Gün
                            </span>
                            <div className="text-slate-800 font-medium">
                              {formatDate(formattedStartDate)} {startTimeStr}
                            </div>
                            <div className="text-slate-500 text-xs">
                              → {formatDate(formattedEndDate)} {endTimeStr}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-slate-800">
                              {formattedStartDate ? formatDate(formattedStartDate) : "-"}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3 inline text-slate-400" />
                              {startTimeStr} {endTimeStr ? `- ${endTimeStr}` : ""}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 font-medium">
                        {routeLabel}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        <div className="font-semibold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-lg inline-block border border-teal-100">
                          {item.vehiclePlateNumber || `Araç ID: ${item.vehicleId}`}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 font-medium">
                        {item.driverFirstName || item.driverLastName
                          ? `${item.driverFirstName || ""} ${item.driverLastName || ""}`
                          : `Şoför ID: ${item.driverId}`}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={trip?.status || "planned"} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </TableShell>
      </PageSection>

      <Modal
        description="Seçtiğiniz onaylı rota için sefer planı oluşturup araç ve şoför ataması yapın."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni Sefer ve Atama Oluştur"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2 max-h-[60vh] overflow-y-auto">
            <div className="md:col-span-2">
              <SelectField
                label="Onaylı Rota seçin *"
                onChange={(value) => updateField("routeId", value)}
                required
                value={form.routeId}
                placeholder="--- Rota Seçiniz ---"
                options={approvedRoutes.map((route) => ({
                  value: String(route.routeId),
                  label: `${route.routeName} (${route.clientName || "Müşteri Bilinmiyor"})`,
                }))}
              />
              {approvedRoutes.length === 0 && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  Sistemde onaylanmış rota bulunmamaktadır.
                </div>
              )}
            </div>

            <div className="md:col-span-2 pt-2 pb-1">
              <ToggleSwitch
                label="Çoklu Gün / Uzun Vadeli Sefer"
                checked={isMultiDay}
                onChange={(checked) => {
                  setIsMultiDay(checked);
                  if (!checked) {
                    // Reset end date to trip date when disabled
                    updateField("endDate", form.tripDate);
                  }
                }}
              />
            </div>

            <div className="md:col-span-2">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Field
                  label="Sefer Tarihi / Başlangıç *"
                  onChange={(value) => {
                    updateField("tripDate", value);
                    if (!isMultiDay) {
                      updateField("endDate", value);
                    }
                  }}
                  required
                  type="date"
                  value={form.tripDate}
                />
                <Field
                  label="Başlangıç Saati *"
                  onChange={(value) => updateField("startTime", value)}
                  required
                  type="time"
                  value={form.startTime}
                />

                {isMultiDay ? (
                  <>
                    <Field
                      label="Bitiş Tarihi *"
                      onChange={(value) => updateField("endDate", value)}
                      required
                      type="date"
                      value={form.endDate}
                    />
                    <Field
                      label="Bitiş Saati *"
                      onChange={(value) => updateField("endTime", value)}
                      required
                      type="time"
                      value={form.endTime}
                    />
                  </>
                ) : (
                  <Field
                    label="Bitiş Saati *"
                    onChange={(value) => updateField("endTime", value)}
                    required
                    type="time"
                    value={form.endTime}
                  />
                )}
              </div>
            </div>

            <SelectField
              label="Araç Ata *"
              onChange={(value) => updateField("vehicleId", value)}
              required
              value={form.vehicleId}
              placeholder="--- Araç Seçiniz ---"
              options={vehicles.map((v) => ({
                value: String(v.vehicleId),
                label: `${v.plateNumber || "Plakasız"} (${v.brandModel || "Bilinmeyen Model"} - ${v.capacity} Kişilik)`,
              }))}
            />

            <SelectField
              label="Şoför Ata *"
              onChange={(value) => updateField("driverId", value)}
              required
              value={form.driverId}
              placeholder="--- Şoför Seçiniz ---"
              options={drivers.map((d) => ({
                value: String(d.userId),
                label: `${d.firstName || ""} ${d.lastName || ""}`,
              }))}
            />
          </div>

          {error ? (
            <div className="px-6 pb-4">
              <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                {error}
              </p>
            </div>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50/50 rounded-b-lg">
            <Button onClick={() => setIsOpen(false)} type="button" variant="secondary">
              Vazgeç
            </Button>
            <Button disabled={isSubmitting || approvedRoutes.length === 0} type="submit">
              {isSubmitting ? "Kaydediliyor ve Atanıyor..." : "Kaydet ve Ata"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
