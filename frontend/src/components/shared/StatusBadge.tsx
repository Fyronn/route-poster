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
  approved: "Onaylandi",
  requested: "Talep Edildi",
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
        : normalizedStatus === "requested" ||
            normalizedStatus === "waiting"
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
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLocaleLowerCase("tr-TR")
    .replace(/[\s-]+/g, "_");
}
