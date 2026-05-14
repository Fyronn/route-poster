import { Badge } from "@/components/ui/Badge";
import type { WorkflowStatus } from "@/types/common";

const statusLabels: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  draft: "Taslak",
  completed: "Tamamlandi",
  pending: "Bekliyor",
  waiting: "Onay Bekliyor",
  rejected: "Reddedildi",
  revision_requested: "Revizyon Istendi",
  approved: "Onaylandi",
  submitted: "Gonderildi",
  requested: "Talep Edildi",
  plan_sent: "Plan Gonderildi",
  in_progress: "Devam Ediyor",
  planned: "Planlandi",
};

export function StatusBadge({ status }: { status: WorkflowStatus | string }) {
  const normalizedStatus = normalizeStatus(status);
  const variant =
    normalizedStatus === "completed" ||
    normalizedStatus === "approved" ||
    normalizedStatus === "active"
      ? "success"
      : normalizedStatus === "rejected" || normalizedStatus === "inactive"
        ? "danger"
        : normalizedStatus === "revision_requested"
          ? "warning"
          : normalizedStatus === "submitted" ||
              normalizedStatus === "waiting" ||
              normalizedStatus === "plan_sent"
            ? "info"
            : "neutral";

  return (
    <Badge variant={variant}>
      {statusLabels[normalizedStatus] ?? String(status)}
    </Badge>
  );
}

function normalizeStatus(status: WorkflowStatus | string) {
  return String(status)
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");
}
