import type { Trip } from "./types";

export const tripsMockData: Trip[] = [
  {
    tripId: 8001,
    routeId: 1,
    tripDate: "2026-05-08",
    startTime: "2026-05-08T07:10:00.000Z",
    endTime: "2026-05-08T08:10:00.000Z",
    status: "completed",
  },
  {
    tripId: 8002,
    routeId: 2,
    tripDate: "2026-05-08",
    startTime: "2026-05-08T07:00:00.000Z",
    endTime: "2026-05-08T08:00:00.000Z",
    status: "started",
  },
  {
    tripId: 8003,
    routeId: 3,
    tripDate: "2026-05-08",
    startTime: "2026-05-08T18:15:00.000Z",
    endTime: "2026-05-08T19:15:00.000Z",
    status: "planned",
  },
];
