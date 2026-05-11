export type ServiceRoute = {
  id: number;
  routeName: string;
  clientName: string;
  vehicle: string;
  driver: string;
  stopCount: number;
  employeeCount: number;
  workingDays: string;
  status: "active" | "inactive" | "planned";
};
