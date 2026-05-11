import { cn } from "@/lib/utils";

export function PageSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 py-6 sm:px-6 lg:px-8", className)}>
      {(title || description || action) && (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {eyebrow ? (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h1 className="text-2xl font-semibold text-slate-950">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="mt-2 max-w-3xl text-sm text-slate-500">
                {description}
              </p>
            ) : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
