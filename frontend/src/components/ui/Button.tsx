import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus-visible:ring-teal-600",
  secondary:
    "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300",
  danger:
    "border border-red-200 bg-white text-red-700 shadow-sm hover:bg-red-50 focus-visible:ring-red-300",
  success:
    "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm hover:bg-emerald-100 focus-visible:ring-emerald-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
  icon: "h-9 w-9 p-0",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      type={type}
      {...props}
    />
  );
}
