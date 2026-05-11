import { Badge } from "@/components/ui/Badge";
import type { WorkflowStatus } from "@/types/common";

const statusLabels: Record<string, string> = {
  active: "Aktif",
  inactive: "Pasif",
  draft: "Taslak",
  completed: "Tamamlandı",
  pending: "Bekliyor",
  waiting: "Onay Bekliyor",
  rejected: "Reddedildi",
  revision_requested: "Revizyon İstendi",
  approved: "Onaylandı",
  submitted: "Gönderildi",
  requested: "Talep Edildi",
  in_progress: "Devam Ediyor",
  planned: "Planlandı",
};

export function StatusBadge({ status }: { status: WorkflowStatus | string }) {
  const variant =
    status === "completed" || status === "approved" || status === "active"
      ? "success"
      : status === "rejected" || status === "inactive"
        ? "danger"
        : status === "revision_requested"
          ? "warning"
          : status === "submitted" || status === "waiting"
            ? "info"
            : "neutral";

  return <Badge variant={variant}>{statusLabels[status] ?? status}</Badge>;
}
