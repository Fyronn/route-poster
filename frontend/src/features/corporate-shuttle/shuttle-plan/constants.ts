import { corporateRouteRequestsMockData } from "../route-requests/constants";
import type { ShuttlePlanSummary } from "./types";

export const shuttlePlanMockData: ShuttlePlanSummary = {
  clientName: "TechCorp Inc.",
  managerName: "Jane Wilson",
  employeeCount: 184,
  stopCount: 36,
  routeRequestCount: 7,
  submittedAt: "2026-05-08T10:30:00",
  status: "submitted",
  routes: corporateRouteRequestsMockData.slice(0, 3),
};
