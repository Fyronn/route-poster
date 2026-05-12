"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Bus, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getDefaultPathForUser } from "@/features/auth/role-access";
import { login } from "@/features/auth/services/auth.service";
import { saveAuthSession } from "@/lib/auth-client";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await login({ email, password });
      const nextPath = getDefaultPathForUser(session.user);

      if (!nextPath) {
        throw new Error(
          "Giris basarili ancak kullanicinin rol bilgisi okunamadi. Backend login response icinde rolId donmeli.",
        );
      }

      saveAuthSession(session);
      router.replace(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Giris basarisiz. E-posta ve sifreyi kontrol edin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
            <Bus className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">FleetFlow</h1>
            <p className="text-sm text-slate-500">Transport Management</p>
          </div>
        </div>

        <Card className="p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Giris yap</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Admin veya servis sorumlusu hesabinizla sisteme girin.
            </p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                E-posta
              </span>
              <div className="mt-2 flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  autoComplete="email"
                  className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="ornek@firma.com"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Sifre
              </span>
              <div className="mt-2 flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-teal-400 focus-within:ring-4 focus-within:ring-teal-50">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  autoComplete="current-password"
                  className="h-full flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Sifreniz"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            ) : null}

            <Button
              className="h-12 w-full justify-center"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Giris yapiliyor..." : "Giris yap"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
