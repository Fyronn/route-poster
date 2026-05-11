import {
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

export const adminSidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: Building2,
  },
  {
    label: "Employees",
    href: "/admin/corporate-shuttle/employees",
    icon: Users,
  },
  {
    label: "Stops",
    href: "/admin/corporate-shuttle/stops",
    icon: MapPin,
  },
  {
    label: "Route Requests",
    href: "/admin/corporate-shuttle/route-requests",
    icon: Route,
  },
  {
    label: "Shuttle Plan",
    href: "/admin/corporate-shuttle/shuttle-plan",
    icon: ClipboardList,
  },
  {
    label: "Plan Requests",
    href: "/admin/shuttle-plan-requests",
    icon: Send,
  },
  {
    label: "Route Approvals",
    href: "/admin/route-request-approvals",
    icon: CheckSquare,
  },
  {
    label: "Service Routes",
    href: "/admin/service-routes",
    icon: Route,
  },
  {
    label: "Trips",
    href: "/admin/trips",
    icon: Calendar,
  },
];
