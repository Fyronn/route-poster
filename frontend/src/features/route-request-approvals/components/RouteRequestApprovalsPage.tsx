"use client";

import { FormEvent, useMemo, useState } from "react";
import { Check, Eye, Route, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableShell } from "@/components/shared/TableShell";

import { decideRouteRequest } from "../services/route-request-approval.service";
import type { RouteRequestApproval } from "../types";

function normalizeStatus(status?: string | null) {
  return String(status ?? "")
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");
}

function isPending(status?: string | null) {
  return normalizeStatus(status) === "requested";
}

function isApproved(status?: string | null) {
  return normalizeStatus(status) === "approved";
}

function isRejected(status?: string | null) {
  return normalizeStatus(status) === "rejected";
}

function getDecisionReason(route: RouteRequestApproval) {
  return (
    route.rejectionReason ||
    route.rejectReason ||
    route.decisionNote ||
    route.comments ||
    route.operatorNote ||
    null
  );
}

function getStopCount(route: RouteRequestApproval) {
  return (
    route.stops?.length ??
    route.plannedStops?.length ??
    route.stopIds?.length ??
    route.stopCount ??
    null
  );
}

function getPassengerCount(route: RouteRequestApproval) {
  return (
    route.passengers?.length ??
    route.selectedPassengers?.length ??
    route.passengerIds?.length ??
    route.employeeCount ??
    null
  );
}

function formatRouteScope(route: RouteRequestApproval) {
  return `${getStopCount(route) ?? "-"} durak / ${
    getPassengerCount(route) ?? "-"
  } calisan`;
}

function getOrderedStops(route: RouteRequestApproval) {
  if (route.plannedStops?.length) {
    return route.plannedStops;
  }

  if (!route.stops?.length) return [];

  return [...route.stops]
    .sort(
      (first, second) =>
        (first.stopOrder ?? Number.MAX_SAFE_INTEGER) -
        (second.stopOrder ?? Number.MAX_SAFE_INTEGER),
    )
    .map((stop, index) => ({
      sequence: stop.stopOrder ?? index + 1,
      stopId: stop.stopId,
      stopName: stop.stopName || `Durak #${stop.stopId}`,
    }));
}

function getRoutePassengers(route: RouteRequestApproval) {
  if (route.selectedPassengers?.length) {
    return route.selectedPassengers;
  }

  if (!route.passengers?.length) return [];

  return route.passengers.map((passenger) => ({
    passengerId: passenger.passengerId,
    passengerName: passenger.fullName || `Calisan #${passenger.passengerId}`,
  }));
}

function formatStopPreview(route: RouteRequestApproval) {
  const stops = getOrderedStops(route);

  if (!stops.length) return "Durak detayi yok";

  const preview = stops
    .slice(0, 3)
    .map((stop) => `${stop.sequence}. ${stop.stopName}`)
    .join(" -> ");

  return stops.length > 3 ? `${preview} +${stops.length - 3}` : preview;
}

export function RouteRequestApprovalsPage({
  approvals,
}: {
  approvals: RouteRequestApproval[];
}) {
  const [items, setItems] = useState(approvals);
  const [selectedId, setSelectedId] = useState(approvals[0]?.id ?? null);
  const [rejectionRoute, setRejectionRoute] =
    useState<RouteRequestApproval | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((approval) => approval.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  function openRejection(route: RouteRequestApproval) {
    setError(null);
    setMessage(null);
    setRejectionError(null);
    setRejectionReason(getDecisionReason(route) || "");
    setRejectionRoute(route);
  }

  async function handleRejectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!rejectionRoute) return;

    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      setRejectionError("Red sebebi zorunludur.");
      return;
    }

    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    setRejectionError(null);

    try {
      await decideRouteRequest(rejectionRoute.id, "Rejected", trimmedReason);
      setItems((current) =>
        current.map((item) =>
          item.id === rejectionRoute.id
            ? {
                ...item,
                comments: trimmedReason,
                decisionNote: trimmedReason,
                rejectionReason: trimmedReason,
                status: "Rejected",
              }
            : item,
        ),
      );
      setRejectionRoute(null);
      setRejectionReason("");
      setMessage("Rota reddedildi ve red sebebi kayda gonderildi.");
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

  async function handleApprove(route: RouteRequestApproval) {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      await decideRouteRequest(route.id, "Approved");
      setItems((current) =>
        current.map((item) =>
          item.id === route.id
            ? {
                ...item,
                status: "Approved",
              }
            : item,
        ),
      );
      setMessage("Rota talebi onaylandi.");
    } catch (approvalError) {
      setError(
        approvalError instanceof Error
          ? approvalError.message
          : "Rota talebi onaylanamadi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageSection
        description="ABC Turizm admini gelen rota taleplerini inceler, onaylar veya zorunlu red sebebiyle reddeder."
        eyebrow="Admin"
        title="Rota Onaylari"
      >
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            hint="Gelen rota"
            icon={Route}
            label="Toplam"
            value={items.length}
          />
          <MetricCard
            hint="Admin karari bekliyor"
            icon={Route}
            label="Onay Bekleyen"
            value={items.filter((approval) => isPending(approval.status)).length}
          />
          <MetricCard
            hint="Admin tarafindan kabul edildi"
            icon={Check}
            label="Onaylanan"
            value={items.filter((approval) => isApproved(approval.status)).length}
          />
          <MetricCard
            hint="Red sebebi girildi"
            icon={X}
            label="Reddedilen"
            value={items.filter((approval) => isRejected(approval.status)).length}
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
            description="Plan onayina gelen rotalar ve karar durumu."
            searchPlaceholder="Musteri veya rota ara..."
            title="Onay Kuyrugu"
          >
            <table className="w-full min-w-[1100px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Rota
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Plan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Kapsam
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Atama
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
                        {approval.clientName || `Client #${approval.clientId ?? "-"}`}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <p>{approval.shiftType || "-"}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {approval.operatingDays || "-"} /{" "}
                        {approval.plannedStartTime || "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <p>{formatRouteScope(approval)}</p>
                      <p className="mt-1 max-w-[340px] truncate text-xs text-slate-500">
                        {formatStopPreview(approval)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <p>{approval.assignedVehicle ?? "Arac bekliyor"}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {approval.assignedDriver ?? "Sofor bekliyor"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={approval.status || "Requested"} />
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
                          onClick={() => handleApprove(approval)}
                          size="icon"
                          variant="success"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() => openRejection(approval)}
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
                    Detay
                  </p>
                  <h2 className="mt-2 font-semibold text-slate-950">
                    {selected.routeName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selected.clientName || `Client #${selected.clientId ?? "-"}`}
                  </p>
                </div>
                <StatusBadge status={selected.status || "Requested"} />
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Kapsam
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatRouteScope(selected)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Duraklar
                  </p>
                  <div className="mt-3 space-y-2">
                    {getOrderedStops(selected).length ? (
                      getOrderedStops(selected).map((stop) => (
                        <div
                          className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
                          key={stop.stopId}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                            {stop.sequence}
                          </span>
                          <span className="min-w-0 truncate font-medium">
                            {stop.stopName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Bu rota icin durak detayi gelmedi.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Calisanlar
                  </p>
                  <div className="mt-3 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
                    {getRoutePassengers(selected).length ? (
                      getRoutePassengers(selected).map((passenger) => (
                        <span
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                          key={passenger.passengerId}
                        >
                          {passenger.passengerName}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        Bu rota icin calisan detayi gelmedi.
                      </p>
                    )}
                  </div>
                </div>

                {isRejected(selected.status) && getDecisionReason(selected) ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-xs font-semibold uppercase text-red-600">
                      Red sebebi
                    </p>
                    <p className="mt-2 text-sm font-medium text-red-700">
                      {getDecisionReason(selected)}
                    </p>
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    disabled={isSubmitting}
                    onClick={() => handleApprove(selected)}
                    size="sm"
                    variant="success"
                  >
                    Onayla
                  </Button>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => openRejection(selected)}
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
        description="Reddedilen rota servis yoneticisine bu gerekceyle geri gosterilir."
        isOpen={Boolean(rejectionRoute)}
        onClose={() => {
          setRejectionRoute(null);
          setRejectionError(null);
        }}
        title="Rota Talebini Reddet"
      >
        <form onSubmit={handleRejectSubmit}>
          <div className="px-6 py-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Red sebebi <span className="text-red-500">*</span>
              </span>
              <textarea
                className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  setRejectionError(null);
                }}
                placeholder="Ornegin: Durak sirasi operasyon planina uygun degil."
                value={rejectionReason}
              />
            </label>
            {rejectionError ? (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {rejectionError}
              </p>
            ) : null}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button
              onClick={() => {
                setRejectionRoute(null);
                setRejectionError(null);
              }}
              variant="secondary"
            >
              Vazgec
            </Button>
            <Button disabled={isSubmitting} type="submit" variant="danger">
              {isSubmitting ? "Gonderiliyor..." : "Reddet"}
            </Button>
          </div>
        </form>
      </Modal>

    </>
  );
}
