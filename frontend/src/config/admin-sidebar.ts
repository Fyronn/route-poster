import {
  Bus,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Route,
  Send,
  Users,
} from "lucide-react";

export type SidebarRole = "admin" | "service-manager" | "all";

export const adminSidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["all"],
  },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: Building2,
    roles: ["admin"],
  },
  {
    label: "Drivers",
    href: "/admin/drivers",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Vehicles",
    href: "/admin/vehicles",
    icon: Bus,
    roles: ["admin"],
  },
  {
    label: "Employees",
    href: "/admin/corporate-shuttle/employees",
    icon: Users,
    roles: ["service-manager"],
  },
  {
    label: "Stops",
    href: "/admin/corporate-shuttle/stops",
    icon: MapPin,
    roles: ["service-manager"],
  },
  {
    label: "Route Requests",
    href: "/admin/corporate-shuttle/route-requests",
    icon: Route,
    roles: ["service-manager"],
  },
  /* {
    label: "Shuttle Plan",
    href: "/admin/corporate-shuttle/shuttle-plan",
    icon: ClipboardList,
    roles: ["service-manager"],
  } */,
  /* {
    label: "Plan Requests",
    href: "/admin/shuttle-plan-requests",
    icon: Send,
    roles: ["admin"],
  } */,
  {
    label: "Route Approvals",
    href: "/admin/route-request-approvals",
    icon: CheckSquare,
    roles: ["admin"],
  },
  /* {
    label: "Service Routes",
    href: "/admin/service-routes",
    icon: Route,
    roles: ["admin"],
  }, */
  /*  */
];
