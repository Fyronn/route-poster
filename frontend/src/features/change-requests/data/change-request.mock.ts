import type { ChangeRequest } from "../types/change-request.types";

export const changeRequestsMockData: ChangeRequest[] = [
  {
    id: "RCR-001",
    clientName: "TechCorp Inc.",
    routeName: "Downtown - Tech Park",
    requestType: "Add Stop",
    description: "Add new pickup point at 5th Avenue",
    requestedBy: "Jane Wilson",
    date: "2026-05-04",
    priority: "medium priority",
    status: "pending",
  },
  {
    id: "RCR-003",
    clientName: "RetailGroup LLC",
    routeName: "Industrial Zone - Mall",
    requestType: "Route Modification",
    description: "Change route to avoid construction on Main St",
    requestedBy: "Michael Torres",
    date: "2026-05-05",
    priority: "high priority",
    status: "pending",
  },
  {
    id: "RCR-002",
    clientName: "State University",
    routeName: "University Loop",
    requestType: "Schedule Change",
    description: "Move morning pickup time 15 minutes earlier",
    requestedBy: "Dr. Robert Brown",
    date: "2026-05-03",
    priority: "medium priority",
    status: "approved",
  },
];