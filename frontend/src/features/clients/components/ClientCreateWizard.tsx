"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Save,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { PageSection } from "@/components/shared/PageSection";
import { cn } from "@/lib/utils";

import {
  defaultClientFormValues,
  setupModelOptions,
  transportTypeOptions,
} from "../constants";
import { createClient } from "../services/client.service";
import type { CreateClientFormValues } from "../types";

const steps = [
  "Client Bilgileri",
  "Taşıma Tipi",
  "Kurulum Tercihi",
  "Özet ve Oluştur",
];

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-50"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div className="flex items-center gap-3" key={step}>
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                isCompleted || isActive
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-200 bg-white text-slate-500",
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-sm font-semibold",
                  isActive ? "text-teal-700" : "text-slate-700",
                )}
              >
                {step}
              </p>
              <div
                className={cn(
                  "mt-2 hidden h-0.5 w-full rounded-full md:block",
                  isCompleted ? "bg-teal-600" : "bg-slate-200",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ClientCreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CreateClientFormValues>(
    defaultClientFormValues,
  );

  const selectedTransportType = transportTypeOptions.find(
    (option) => option.value === formValues.transportType,
  );
  const selectedSetupModel = setupModelOptions.find(
    (option) => option.value === formValues.setupModel,
  );

  const isCurrentStepValid = useMemo(() => {
    if (step === 0) {
      return Boolean(
        formValues.companyName &&
          formValues.contactFirstName &&
          formValues.contactLastName &&
          formValues.phone &&
          formValues.email &&
          formValues.password.length >= 6 &&
          formValues.address,
      );
    }

    if (step === 1) return formValues.transportType === "corporate-shuttle";
    if (step === 2) return Boolean(formValues.setupModel);

    return true;
  }, [formValues, step]);

  function updateField<TKey extends keyof CreateClientFormValues>(
    key: TKey,
    value: CreateClientFormValues[TKey],
  ) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit() {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const client = await createClient(formValues);
      router.push(`/admin/clients/${client.numericId}/setup`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Client oluşturulamadı. Backend validasyonunu ve zorunlu alanları kontrol edin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageSection
      description="Client organizasyonunu oluşturun, taşıma modülünü seçin ve kurulum akışını başlatın."
      title="Create New Client"
    >
      <Stepper currentStep={step} />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-6">
            {step === 0 ? (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Client Bilgileri
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Genel client kaydı yalnızca şirket ve yetkili bilgilerini
                  içerir.
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Field
                    label="Şirket adı"
                    onChange={(value) => updateField("companyName", value)}
                    placeholder="TechCorp Inc."
                    required
                    value={formValues.companyName}
                  />
                  <Field
                    label="Yetkili kişi"
                    onChange={(value) => updateField("contactFirstName", value)}
                    placeholder="Jane"
                    required
                    value={formValues.contactFirstName}
                  />
                  <Field
                    label="Yetkili soyadi"
                    onChange={(value) => updateField("contactLastName", value)}
                    placeholder="Wilson"
                    required
                    value={formValues.contactLastName}
                  />
                  <Field
                    label="Telefon"
                    onChange={(value) => updateField("phone", value)}
                    placeholder="+90 212 555 10 20"
                    required
                    value={formValues.phone}
                  />
                  <Field
                    label="E-posta"
                    onChange={(value) => updateField("email", value)}
                    placeholder="jane@techcorp.com"
                    required
                    type="email"
                    value={formValues.email}
                  />
                  <Field
                    label="Yetkili sifre"
                    onChange={(value) => updateField("password", value)}
                    placeholder="En az 6 karakter"
                    required
                    type="password"
                    value={formValues.password}
                  />
                  <Field
                    label="Şehir"
                    onChange={(value) => updateField("city", value)}
                    placeholder="İstanbul"
                    value={formValues.city}
                  />
                  <Field
                    label="İlçe"
                    onChange={(value) => updateField("district", value)}
                    placeholder="Sarıyer"
                    value={formValues.district}
                  />
                  <div className="md:col-span-2">
                    <Field
                      label="Adres"
                      onChange={(value) => updateField("address", value)}
                      placeholder="Maslak Mah. Büyükdere Cad. No: 45"
                      required
                      value={formValues.address}
                    />
                  </div>
                  <Field
                    label="Vergi numarası"
                    onChange={(value) => updateField("taxNumber", value)}
                    placeholder="Opsiyonel"
                    value={formValues.taxNumber}
                  />
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Taşıma Tipi Seçimi
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Bu seçim, client altında açılacak modül ve kurulum akışını
                  belirler.
                </p>
                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  {transportTypeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = option.value === formValues.transportType;

                    return (
                      <button
                        className={cn(
                          "rounded-2xl border bg-white p-5 text-left transition",
                          isSelected
                            ? "border-teal-500 ring-4 ring-teal-50"
                            : "border-slate-200 hover:border-slate-300",
                          option.disabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer",
                        )}
                        disabled={option.disabled}
                        key={option.value}
                        onClick={() => updateField("transportType", option.value)}
                        type="button"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-950">
                                {option.label}
                              </h3>
                              <p className="mt-2 text-sm text-slate-500">
                                {option.description}
                              </p>
                            </div>
                          </div>
                          {option.badge ? (
                            <Badge variant="neutral">{option.badge}</Badge>
                          ) : isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-teal-700" />
                          ) : null}
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {option.modules.map((module) => (
                            <Badge key={module} variant="teal">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Kurulum Tercihi
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Şu anki ana senaryoda şirket yöneticisi veri girişini yapar,
                  ABC Turizm planı onaylar.
                </p>
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {setupModelOptions.map((option) => {
                    const isSelected = option.value === formValues.setupModel;

                    return (
                      <button
                        className={cn(
                          "min-h-40 rounded-2xl border p-5 text-left transition",
                          isSelected
                            ? "border-teal-500 bg-teal-50/60 ring-4 ring-teal-50"
                            : "border-slate-200 bg-white hover:border-slate-300",
                        )}
                        key={option.value}
                        onClick={() => updateField("setupModel", option.value)}
                        type="button"
                      >
                        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm">
                          {isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <ClipboardCheck className="h-4 w-4" />
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-950">
                          {option.label}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Özet ve Oluştur
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Oluşturma sonrası setup checklist sayfasına yönlendirileceksiniz.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Şirket", formValues.companyName],
                    [
                      "Yetkili",
                      `${formValues.contactFirstName} ${formValues.contactLastName}`.trim(),
                    ],
                    ["Telefon", formValues.phone],
                    ["E-posta", formValues.email],
                    ["Adres", formValues.address],
                    ["Vergi No", formValues.taxNumber || "-"],
                    ["Taşıma Tipi", selectedTransportType?.label ?? "-"],
                    ["Kurulum Modeli", selectedSetupModel?.label ?? "-"],
                  ].map(([label, value]) => (
                    <div
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      key={label}
                    >
                      <p className="text-xs font-semibold uppercase text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                {submitError ? (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {submitError}
                  </div>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="h-fit p-5">
          <h2 className="text-base font-semibold text-slate-950">
            Configuration Snapshot
          </h2>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Seçili Modül
            </p>
            <p className="mt-2 font-semibold text-slate-950">
              {selectedTransportType?.label}
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Client bilgileri",
              "Taşıma tipi",
              "Kurulum modeli",
              "Admin inceleme",
            ].map((item, index) => (
              <div className="flex items-center gap-3" key={item}>
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                    index <= step
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-400",
                  )}
                >
                  {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {item}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            Client oluşturulduktan sonra çalışan, durak, rota talebi ve servis
            planı adımları setup ekranından takip edilir.
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Button
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            variant="secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <Button variant="secondary">
            <Save className="h-4 w-4" />
            Taslak Kaydet
          </Button>
        </div>

        {step < steps.length - 1 ? (
          <Button
            disabled={!isCurrentStepValid}
            onClick={() => setStep((current) => current + 1)}
          >
            Devam
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Oluşturuluyor..." : "Client Oluştur"}
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </PageSection>
  );
}
