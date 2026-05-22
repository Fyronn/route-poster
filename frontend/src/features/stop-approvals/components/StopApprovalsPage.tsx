"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Check,
  X,
  Search,
  Building2,
  MapPin,
  RotateCcw,
  MessageSquare,
  Filter,
  AlertTriangle,
  ChevronRight,
  Info,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MetricCard } from "@/components/shared/MetricCard";
import { Modal } from "@/components/shared/Modal";
import { PageSection } from "@/components/shared/PageSection";
import { StatusBadge } from "@/components/shared/StatusBadge";

import type { Client } from "@/features/clients/types";
import { CorporateStops } from "../types";
import { getRequestedStops, updateCorporateStop } from "../services/stop-requests";

type StopStatusFilter = "all" | "requested" | "approved" | "rejected";

function getUniqueStopsByStopId(stops: CorporateStops[]) {
  const stopMap = new Map<number, CorporateStops>();

  stops.forEach((stop) => {
    const existingStop = stopMap.get(stop.stopId);

    if (!existingStop) {
      stopMap.set(stop.stopId, stop);
      return;
    }

    stopMap.set(stop.stopId, {
      ...existingStop,

      routeName:
        existingStop.routeName && stop.routeName
          ? existingStop.routeName.includes(stop.routeName)
            ? existingStop.routeName
            : `${existingStop.routeName}, ${stop.routeName}`
          : existingStop.routeName || stop.routeName,

      routeId: existingStop.routeId || stop.routeId,
    });
  });

  return Array.from(stopMap.values());
}

export function StopApprovalsPage({
  initialClients,
}: {
  initialClients: Client[];
}) {
  const [clients] = useState<Client[]>(initialClients);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    initialClients[0]?.clientId ?? null,
  );

  const [stops, setStops] = useState<CorporateStops[]>([]);
  const [stopsLoading, setStopsLoading] = useState(false);

  const [clientSearch, setClientSearch] = useState("");
  const [stopSearch, setStopSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StopStatusFilter>("all");

  const [rejectionStop, setRejectionStop] =
    useState<CorporateStops | null>(null);

  const [operatorNoteInput, setOperatorNoteInput] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const selectedClient = useMemo(() => {
    return clients.find((client) => client.clientId === selectedClientId) ?? null;
  }, [clients, selectedClientId]);

  useEffect(() => {
    async function fetchStops() {
      if (!selectedClientId) return;

      setStopsLoading(true);
      setNotification(null);

      try {
        const fetchedStops = await getRequestedStops(selectedClientId);
        const uniqueStops = getUniqueStopsByStopId(fetchedStops || []);

        setStops(uniqueStops);
      } catch (err) {
        console.error("Duraklar yüklenirken hata oluştu", err);

        setNotification({
          type: "error",
          message: "Şirkete ait durak talepleri yüklenirken bir sorun oluştu.",
        });
      } finally {
        setStopsLoading(false);
      }
    }

    fetchStops();
  }, [selectedClientId]);

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLocaleLowerCase("tr-TR");

    return clients.filter((client) => {
      const nameMatch = client.clientName
        .toLocaleLowerCase("tr-TR")
        .includes(term);

      const cityMatch =
        client.city?.toLocaleLowerCase("tr-TR").includes(term) ?? false;

      const districtMatch =
        client.district?.toLocaleLowerCase("tr-TR").includes(term) ?? false;

      return nameMatch || cityMatch || districtMatch;
    });
  }, [clients, clientSearch]);

  const filteredStops = useMemo(() => {
    const term = stopSearch.trim().toLocaleLowerCase("tr-TR");

    return stops.filter((stop) => {
      const matchesSearch = term
        ? stop.stopName?.toLocaleLowerCase("tr-TR").includes(term) ||
          stop.address?.toLocaleLowerCase("tr-TR").includes(term) ||
          stop.routeName?.toLocaleLowerCase("tr-TR").includes(term)
        : true;

      const stopStatusNormalized = stop.status?.trim().toLowerCase();

      let matchesStatus = true;

      if (statusFilter === "requested") {
        matchesStatus = stopStatusNormalized === "requested";
      } else if (statusFilter === "approved") {
        matchesStatus = stopStatusNormalized === "approved";
      } else if (statusFilter === "rejected") {
        matchesStatus = stopStatusNormalized === "rejected";
      }

      return matchesSearch && matchesStatus;
    });
  }, [stops, stopSearch, statusFilter]);

  const metrics = useMemo(() => {
    const total = stops.length;

    const requested = stops.filter(
      (stop) => stop.status?.toLowerCase() === "requested",
    ).length;

    const approved = stops.filter(
      (stop) => stop.status?.toLowerCase() === "approved",
    ).length;

    const rejected = stops.filter(
      (stop) => stop.status?.toLowerCase() === "rejected",
    ).length;

    return {
      total,
      requested,
      approved,
      rejected,
    };
  }, [stops]);

  function clearFilters() {
    setStopSearch("");
    setStatusFilter("all");
  }

  async function handleApprove(stop: CorporateStops) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotification(null);

    try {
      const reqAprr = await updateCorporateStop(stop.clientId, stop.stopId, {
        status: "Approved",
        isActive: true,
      });

      console.log(reqAprr)

      setStops((prev) =>
        prev.map((currentStop) =>
          currentStop.stopId === stop.stopId
            ? {
                ...currentStop,
                status: "Approved",
                isActive: true,
              }
            : currentStop,
        ),
      );

      setNotification({
        type: "success",
        message: `"${stop.stopName}" durağı başarıyla onaylandı ve kullanıma sunuldu.`,
      });
    } catch (err) {
      console.error("Durak onaylanırken hata oluştu", err);

      setNotification({
        type: "error",
        message: "Durak onaylanırken sunucuda bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRejectClick(stop: CorporateStops) {
    setRejectionStop(stop);
    setOperatorNoteInput(stop.operatorNote || "");
    setRejectionError(null);
  }

  async function handleRejectSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!rejectionStop || isSubmitting) return;

    const trimmedNote = operatorNoteInput.trim();

    if (!trimmedNote) {
      setRejectionError("Lütfen reddetme sebebini yazınız. Bu alan zorunludur.");
      return;
    }

    setIsSubmitting(true);
    setRejectionError(null);
    setNotification(null);

    try {
      await updateCorporateStop(rejectionStop.clientId, rejectionStop.stopId, {
        status: "Rejected",
        operatorNote: trimmedNote,
        isActive: false,
      });

      setStops((prev) =>
        prev.map((currentStop) =>
          currentStop.stopId === rejectionStop.stopId
            ? {
                ...currentStop,
                status: "Rejected",
                operatorNote: trimmedNote,
                isActive: false,
              }
            : currentStop,
        ),
      );

      setNotification({
        type: "success",
        message: `"${rejectionStop.stopName}" durağı için red işlemi başarıyla kaydedildi.`,
      });

      setRejectionStop(null);
      setOperatorNoteInput("");
    } catch (err) {
      console.error("Durak reddedilirken hata oluştu", err);

      setRejectionError("Red işlemi sırasında sunucuda bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageSection
      description="Şirket yöneticileri tarafından talep edilen yeni servis duraklarını inceleyin, onaylayın veya red açıklaması belirterek reddedin."
      eyebrow="Yönetici İşlemleri"
      title="Durak Onayları"
    >
      {notification ? (
        <div
          className={`mb-6 flex items-start gap-3 rounded-2xl border p-4 text-sm font-semibold transition-all duration-300 ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />

          <div className="flex-1">
            <p>{notification.message}</p>
          </div>

          <button
            className="text-slate-400 transition hover:text-slate-600"
            onClick={() => setNotification(null)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Card className="flex flex-col gap-3 border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                <Building2 className="h-4 w-4 text-teal-600" />
                Müşteri Listesi
              </h3>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {filteredClients.length} Kurum
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50/50"
                onChange={(event) => setClientSearch(event.target.value)}
                placeholder="Kurum adı veya şehir ara..."
                type="text"
                value={clientSearch}
              />
            </div>

            <div className="custom-scrollbar max-h-[550px] space-y-2.5 overflow-y-auto pr-1">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const isSelected = client.clientId === selectedClientId;

                  const clientAvatarColor = `bg-gradient-to-tr ${
                    isSelected
                      ? "from-teal-500 to-emerald-400 text-white"
                      : "from-slate-100 to-slate-200 text-slate-700 border border-slate-300"
                  }`;

                  return (
                    <button
                      className={`group relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                        isSelected
                          ? "border-teal-200 bg-teal-50/60 shadow-md shadow-teal-100/50"
                          : "border-slate-100 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      key={client.clientId}
                      onClick={() => setSelectedClientId(client.clientId)}
                      type="button"
                    >
                      {isSelected ? (
                        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-400" />
                      ) : null}

                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${clientAvatarColor}`}
                      >
                        {client.clientName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold transition-colors duration-200 ${
                            isSelected
                              ? "text-teal-950"
                              : "text-slate-900 group-hover:text-teal-600"
                          }`}
                        >
                          {client.clientName}
                        </p>

                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500">
                          <MapPin className="h-3 w-3 flex-shrink-0 text-slate-400" />
                          {client.city
                            ? `${client.city}, ${client.district || ""}`
                            : "Bölge Belirtilmemiş"}
                        </p>

                        <div className="mt-2.5 flex items-center gap-3">
                          <span className="rounded-md border border-slate-200/60 bg-white/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                            Durak: {client.stopCount || 0}
                          </span>

                          <span className="rounded-md border border-slate-200/60 bg-white/50 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                            Kurum ID: #{client.clientId}
                          </span>
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 flex-shrink-0 self-center text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 ${
                          isSelected ? "text-teal-600" : ""
                        }`}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Arama kriterlerinize uyan kurum bulunamadı.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-8">
          {selectedClient ? (
            <>
              <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100 md:flex-row md:items-center">
                <div className="min-w-0">
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-teal-600">
                    Seçili Kurum
                  </span>

                  <h2 className="mt-2.5 text-xl font-bold leading-tight tracking-tight text-slate-900">
                    {selectedClient.clientName}
                  </h2>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>
                      <strong>Yetkili:</strong>{" "}
                      {selectedClient.authorizedPerson || "-"}
                    </span>

                    <span>•</span>

                    <span>
                      <strong>E-posta:</strong> {selectedClient.email || "-"}
                    </span>

                    <span>•</span>

                    <span>
                      <strong>Telefon:</strong> {selectedClient.phone || "-"}
                    </span>
                  </p>
                </div>

                <div className="min-w-[120px] flex-shrink-0 rounded-2xl border border-slate-200/60 bg-slate-50 px-4 py-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kurum Türü
                  </p>

                  <p className="mt-0.5 text-sm font-extrabold text-slate-700">
                    {selectedClient.clientType || "Corporate"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <MetricCard
                  hint="Toplam durak talebi sayısı"
                  icon={MapPin}
                  label="Toplam"
                  value={metrics.total}
                />

                <MetricCard
                  hint="Karar bekleyen talepler"
                  icon={Info}
                  label="Onay Bekleyen"
                  value={metrics.requested}
                />

                <MetricCard
                  hint="Onaylanan durak talepleri"
                  icon={Check}
                  label="Onaylanan"
                  value={metrics.approved}
                />

                <MetricCard
                  hint="Reddedilen durak talepleri"
                  icon={X}
                  label="Reddedilen"
                  value={metrics.rejected}
                />
              </div>

              <Card className="flex flex-col gap-4 border-slate-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Durak Talepleri Kuyruğu
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Bu kurum tarafından oluşturulan durak istekleri.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative w-full sm:w-48">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                      <input
                        className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none transition focus:border-teal-400 focus:bg-white"
                        onChange={(event) => setStopSearch(event.target.value)}
                        placeholder="Durak veya rota ara..."
                        type="text"
                        value={stopSearch}
                      />
                    </div>

                    {(stopSearch || statusFilter !== "all") ? (
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        onClick={clearFilters}
                        title="Filtreleri temizle"
                        type="button"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 self-start rounded-xl bg-slate-50 p-1">
                  {[
                    {
                      label: "Tümü",
                      value: "all",
                      count: metrics.total,
                    },
                    {
                      label: "Bekleyen",
                      value: "requested",
                      count: metrics.requested,
                    },
                    {
                      label: "Onaylanan",
                      value: "approved",
                      count: metrics.approved,
                    },
                    {
                      label: "Reddedilen",
                      value: "rejected",
                      count: metrics.rejected,
                    },
                  ].map((button) => (
                    <button
                      className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all duration-200 ${
                        statusFilter === button.value
                          ? "border border-teal-100 bg-white font-bold text-teal-800 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
                      }`}
                      key={button.value}
                      onClick={() =>
                        setStatusFilter(button.value as StopStatusFilter)
                      }
                      type="button"
                    >
                      {button.label}

                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                          statusFilter === button.value
                            ? "bg-teal-50 text-teal-800"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {button.count}
                      </span>
                    </button>
                  ))}
                </div>

                {stopsLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                    <span>Durak talepleri yükleniyor...</span>
                  </div>
                ) : filteredStops.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStops.map((stop) => {
                      const isPending =
                        stop.status?.toLowerCase() === "requested";

                      const isRejected =
                        stop.status?.toLowerCase() === "rejected";

                      const isApproved =
                        stop.status?.toLowerCase() === "approved";

                      return (
                        <div
                          className={`relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-300 md:flex-row ${
                            isPending
                              ? "border-blue-100 bg-gradient-to-r from-blue-50/10 to-transparent hover:border-blue-300"
                              : isApproved
                                ? "border-emerald-100 bg-emerald-50/5 hover:border-emerald-300"
                                : "border-slate-100 bg-slate-50/10 hover:border-slate-300"
                          }`}
                          key={stop.stopId}
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <h4 className="text-base font-bold text-slate-900">
                                {stop.stopName}
                              </h4>

                              <StatusBadge status={stop.status || "Requested"} />

                              {stop.routeName ? (
                                <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                                  Rota: {stop.routeName}
                                </span>
                              ) : null}
                            </div>

                            <p className="flex items-start gap-1.5 text-sm leading-relaxed text-slate-600">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                              <span>
                                {stop.address || "Adres bilgisi verilmemiş"}
                              </span>
                            </p>

                            <div className="flex w-fit flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-xs font-semibold text-slate-500">
                              <span className="flex items-center gap-1">
                                <GlobeIcon className="h-3.5 w-3.5 text-slate-400" />
                                Enlem (Lat): {stop.latitude || "N/A"}
                              </span>

                              <span className="text-slate-300">|</span>

                              <span className="flex items-center gap-1">
                                <GlobeIcon className="h-3.5 w-3.5 text-slate-400" />
                                Boylam (Lng): {stop.longitude || "N/A"}
                              </span>

                              {stop.latitude && stop.longitude ? (
                                <>
                                  <span className="text-slate-300">|</span>

                                  <a
                                    className="flex flex-shrink-0 items-center gap-1 font-bold text-teal-600 hover:text-teal-800 hover:underline"
                                    href={`https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`}
                                    rel="noreferrer"
                                    target="_blank"
                                  >
                                    Haritada Gör
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </>
                              ) : null}
                            </div>

                            {isRejected && stop.operatorNote ? (
                              <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs text-rose-800">
                                <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />

                                <div>
                                  <p className="font-bold">
                                    Red Nedeni (Operatör Notu):
                                  </p>

                                  <p className="mt-0.5 italic">
                                    {stop.operatorNote}
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </div>

                          <div className="flex items-end justify-end gap-2 border-t border-slate-100 pt-3 md:flex-col md:border-t-0 md:pt-0">
                            {isPending ? (
                              <div className="flex w-full gap-2 md:w-auto">
                                <Button
                                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl px-4 shadow-sm transition hover:scale-[1.02] md:flex-none"
                                  disabled={isSubmitting}
                                  onClick={() => handleApprove(stop)}
                                  variant="success"
                                >
                                  {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                  Kabul Et
                                </Button>

                                <Button
                                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl px-4 shadow-sm transition hover:scale-[1.02] md:flex-none"
                                  disabled={isSubmitting}
                                  onClick={() => handleRejectClick(stop)}
                                  variant="danger"
                                >
                                  <X className="h-4 w-4" />
                                  Reddet
                                </Button>
                              </div>
                            ) : (
                              <div className="self-center rounded-xl border border-slate-100 bg-slate-50 p-2 text-right text-xs font-semibold text-slate-400 md:self-end">
                                {isApproved
                                  ? "Onaylanmış İşlem"
                                  : "Reddedilmiş İşlem"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <h4 className="mt-4 font-bold text-slate-900">
                      Kayıt Bulunamadı
                    </h4>

                    <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
                      Seçtiğiniz kriterlere uyan durak talebi bulunamadı.
                      Filtreleri değiştirmeyi deneyebilirsiniz.
                    </p>

                    {(stopSearch || statusFilter !== "all") ? (
                      <button
                        className="mt-4 text-xs font-bold text-teal-600 transition hover:text-teal-800"
                        onClick={clearFilters}
                        type="button"
                      >
                        Tüm filtreleri temizle
                      </button>
                    ) : null}
                  </div>
                )}
              </Card>
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 p-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-600 shadow-sm shadow-teal-100">
                <MapPin className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-extrabold leading-tight text-slate-900">
                Müşteri Durak Talepleri
              </h3>

              <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">
                Durak taleplerini görüntülemek, onaylamak veya reddetmek için
                sol taraftaki müşteri listesinden bir kurum seçiniz.
              </p>
            </div>
          )}
        </div>
      </div>

      {rejectionStop ? (
        <Modal
          isOpen={true}
          onClose={() => {
            if (!isSubmitting) setRejectionStop(null);
          }}
          title="Durak Talebini Reddet"
        >
          <form className="space-y-4" onSubmit={handleRejectSubmit}>
            <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs leading-relaxed text-rose-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />

              <div>
                <p className="font-bold">Dikkat!</p>

                <p className="mt-1">
                  <strong>"{rejectionStop.stopName}"</strong> durağı talebini
                  reddetmek üzeresiniz. İşlemin tamamlanması için şirket
                  yöneticisine iletilmek üzere geçerli bir gerekçe girmeniz
                  zorunludur.
                </p>
              </div>
            </div>

            {rejectionError ? (
              <p className="rounded-xl border border-rose-100 bg-rose-50 p-2 text-xs font-bold text-rose-600">
                {rejectionError}
              </p>
            ) : null}

            <div>
              <label className="mb-1 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Red Gerekçesi (Operatör Notu) *
              </label>

              <textarea
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-50"
                maxLength={400}
                onChange={(event) => setOperatorNoteInput(event.target.value)}
                placeholder="Örn: Bu durak ana cadde üzerinde tehlikeli bir noktada yer alıyor. Lütfen durağı 100m gerideki güvenli alana taşıyıp tekrar talep gönderin."
                rows={4}
                value={operatorNoteInput}
              />

              <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>
                  * Bu gerekçe kurum sorumlusu panelinde gösterilecektir.
                </span>

                <span>{operatorNoteInput.length}/400 karakter</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <Button
                className="h-10 rounded-xl px-4 text-xs font-bold"
                disabled={isSubmitting}
                onClick={() => setRejectionStop(null)}
                type="button"
                variant="secondary"
              >
                Vazgeç
              </Button>

              <Button
                className="flex h-10 items-center justify-center gap-1 rounded-xl px-4 text-xs font-bold"
                disabled={isSubmitting}
                type="submit"
                variant="danger"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Talebi Reddet
              </Button>
            </div>
          </form>
        </Modal>
      ) : null}
    </PageSection>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}