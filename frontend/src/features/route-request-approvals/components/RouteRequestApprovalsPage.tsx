"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Eye, RefreshCcw, Route, X } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";
import type { Driver } from "@/features/drivers/types";
import { createTrip } from "@/features/trips/services/trip.service";
import type { Vehicle } from "@/features/vehicles/types";

import { decideRouteRequest } from "../services/route-request-approval.service";
import type { RouteRequestApproval } from "../types";

type AssignmentFormState = {
  driverId: string;
  serviceDate: string;
  startTime: string;
  vehicleId: string;
};

const today = new Date().toISOString().slice(0, 10);

export function RouteRequestApprovalsPage({
  approvals,
  drivers,
  vehicles,
}: {
  approvals: RouteRequestApproval[];
  drivers: Driver[];
  vehicles: Vehicle[];
}) {
  const [items, setItems] = useState(approvals);
  const [selectedId, setSelectedId] = useState(approvals[0]?.id ?? null);
  const [assignmentRoute, setAssignmentRoute] =
    useState<RouteRequestApproval | null>(null);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentFormState>({
    driverId: drivers[0]?.userId ? String(drivers[0].userId) : "",
    serviceDate: today,
    startTime: "07:30",
    vehicleId: vehicles[0]?.vehicleId ? String(vehicles[0].vehicleId) : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((approval) => approval.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  function updateAssignmentField(
    key: keyof AssignmentFormState,
    value: string,
  ) {
    setAssignmentForm((current) => ({ ...current, [key]: value }));
  }

  function openAssignment(route: RouteRequestApproval) {
    setError(null);
    setMessage(null);
    setAssignmentRoute(route);
    setAssignmentForm((current) => ({
      ...current,
      driverId: current.driverId || (drivers[0]?.userId ? String(drivers[0].userId) : ""),
      startTime: route.plannedStartTime?.slice(0, 5) || current.startTime,
      vehicleId:
        current.vehicleId || (vehicles[0]?.vehicleId ? String(vehicles[0].vehicleId) : ""),
    }));
  }

  async function updateDecision(
    routeId: number,
    status: "Onaylandi" | "Reddedildi" | "Revizyon Istendi",
  ) {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await decideRouteRequest(routeId, status);
      setItems((current) =>
        current.map((item) =>
          item.id === routeId
            ? {
                ...item,
                status:
                  status === "Onaylandi"
                    ? "approved"
                    : status === "Reddedildi"
                      ? "rejected"
                      : "revision_requested",
              }
            : item,
        ),
      );
      setMessage("Rota karari guncellendi.");
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : "Rota karari guncellenemedi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAssignmentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assignmentRoute) return;

    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await decideRouteRequest(assignmentRoute.id, "Onaylandi");
      await createTrip({
        routeId: assignmentRoute.id,
        startTime: `${assignmentForm.serviceDate}T${assignmentForm.startTime}:00`,
        tripDate: assignmentForm.serviceDate,
      });

      const driver = drivers.find(
        (item) => item.userId === Number(assignmentForm.driverId),
      );
      const vehicle = vehicles.find(
        (item) => item.vehicleId === Number(assignmentForm.vehicleId),
      );

      setItems((current) =>
        current.map((item) =>
          item.id === assignmentRoute.id
            ? {
                ...item,
                assignedDriver: driver ? `${driver.firstName} ${driver.lastName}` : "Bekliyor",
                assignedVehicle: vehicle?.plateNumber || "Bekliyor",
                status: "approved",
              }
            : item,
        ),
      );
      setAssignmentRoute(null);
      setMessage(
        "Rota onaylandi, sefer olusturuldu. Arac/sofor atamasi backend atama endpointi acilinca kalici baglanacak.",
      );
    } catch (assignmentError) {
      setError(
        assignmentError instanceof Error
          ? assignmentError.message
          : "Onay ve servis atama akisi tamamlanamadi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSection
        description="Admin gelen rota taleplerini inceler; onayda arac, sofor ve ilk sefer planini belirler."
        eyebrow="Admin Approval"
        title="Route Request Approvals"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            hint="Rota seviyesinde gelen karar isi"
            icon={Route}
            label="Toplam Istek"
            value={items.length}
          />
          <MetricCard
            hint="Operasyon ekibi bekliyor"
            icon={Route}
            label="Talep Edildi"
            value={items.filter((approval) => approval.status?.toLowerCase() === "requested").length}
          />
          <MetricCard
            hint="Gercek rota olusturulabilir"
            icon={Check}
            label="Onayli"
            value={items.filter((approval) => approval.status?.toLowerCase() === "approved").length}
          />
          <MetricCard
            hint="Sirket yoneticisine donecek"
            icon={RefreshCcw}
            label="Revizyon"
            value={
              items.filter((approval) => approval.status?.toLowerCase() === "revision_requested")
                .length
            }
          />
        </div>

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

        <div className="grid gap-5 2xl:grid-cols-[1fr_420px]">
          <TableShell
            description="Baslangic, bitis, duraklar, calisan sayisi ve tahmini sure rota kararini destekler."
            searchPlaceholder="Client, rota veya lokasyon ara..."
            title="Rota Onay Kuyrugu"
          >
            <table className="w-full min-w-[1300px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Client / Rota
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Baslangic
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Bitis
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Kapasite
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Tahmin
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Durum
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Aksiyon
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((approval) => (
                  <tr
                    className="border-b border-slate-100 last:border-0"
                    key={approval.id}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-950">
                        {approval.routeName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {approval.clientName} / {approval.requestedBy}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {approval.startPoint}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {approval.endPoint}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {approval.stopCount} durak / {approval.employeeCount} calisan
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {approval.estimatedDistanceKm || 0} km /{" "}
                      {approval.estimatedDurationMinutes || 0} dk
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={approval.status?.toLowerCase() || "requested"} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setSelectedId(approval.id)}
                          size="icon"
                          variant="secondary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() => openAssignment(approval)}
                          size="icon"
                          variant="success"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() =>
                            updateDecision(approval.id, "Revizyon Istendi")
                          }
                          size="icon"
                          variant="secondary"
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() => updateDecision(approval.id, "Reddedildi")}
                          size="icon"
                          variant="danger"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>

          {selected ? (
            <Card className="h-fit p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-teal-700">
                    Detay Goruntule
                  </p>
                  <h2 className="mt-2 font-semibold text-slate-950">
                    {selected.routeName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.clientName}
                  </p>
                </div>
                <StatusBadge status={selected.status?.toLowerCase() || "requested"} />
              </div>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Operasyon Tahmini
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {selected.estimatedDistanceKm || 0} km,{" "}
                    {selected.estimatedDurationMinutes || 0} dk, {selected.stopCount || 0} durak
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Arac Onerisi
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {selected.vehicleSuggestion}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Atama
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="neutral">
                      Arac: {selected.assignedVehicle ?? "Bekliyor"}
                    </Badge>
                    <Badge variant="neutral">
                      Sofor: {selected.assignedDriver ?? "Bekliyor"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => openAssignment(selected)}
                    size="sm"
                    variant="success"
                  >
                    Onayla
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => updateDecision(selected.id, "Revizyon Istendi")}
                    size="sm"
                    variant="secondary"
                  >
                    Revizyon
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => updateDecision(selected.id, "Reddedildi")}
                    size="sm"
                    variant="danger"
                  >
                    Reddet
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </PageSection>

      <Modal
        description="Onay sonrasi bu rota icin arac, sofor ve ilk sefer bilgisi belirlenir."
        isOpen={Boolean(assignmentRoute)}
        onClose={() => setAssignmentRoute(null)}
        title="Servis ve Sofor Ata"
      >
        <form onSubmit={handleAssignmentSubmit}>
          <div className="grid gap-5 px-6 py-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Arac
              </span>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) =>
                  updateAssignmentField("vehicleId", event.target.value)
                }
                required
                value={assignmentForm.vehicleId}
              >
                <option value="">Arac secin</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.plateNumber} / {vehicle.capacity} koltuk
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Sofor
              </span>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) =>
                  updateAssignmentField("driverId", event.target.value)
                }
                required
                value={assignmentForm.driverId}
              >
                <option value="">Sofor secin</option>
                {drivers.map((driver) => (
                  <option key={driver.userId} value={driver.userId}>
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Sefer tarihi
              </span>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) =>
                  updateAssignmentField("serviceDate", event.target.value)
                }
                required
                type="date"
                value={assignmentForm.serviceDate}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Baslangic saati
              </span>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) =>
                  updateAssignmentField("startTime", event.target.value)
                }
                required
                type="time"
                value={assignmentForm.startTime}
              />
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button onClick={() => setAssignmentRoute(null)} variant="secondary">
              Vazgec
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Kaydediliyor..." : "Onayla ve Sefer Olustur"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
