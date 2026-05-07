import {
  BarChart3,
  Bell,
  Building2,
  Bus,
  Calendar,
  FileText,
  LayoutDashboard,
  MapPin,
  Route,
  Settings,
  Users,
} from "lucide-react";

export const adminSidebarItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  /* {
    label: "Live Operations",
    href: "/admin/live-operations",
    icon: MapPin,
  } */,
  {
    label: "Trips",
    href: "/admin/trips",
    icon: Calendar,
  },
  {
    label: "Clients",
    href: "/admin/clients",
    icon: Building2,
  },
  {
    label: "Vehicles",
    href: "/admin/vehicles",
    icon: Bus,
  },
  {
    label: "Drivers",
    href: "/admin/drivers",
    icon: Users,
  },
  {
    label: "Routes",
    href: "/admin/service-routes",
    icon: Route,
  },
  {
    label: "Riders",
    href: "/admin/riders",
    icon: Users,
  },
  {
    label: "Change Requests",
    href: "/admin/change-requests",
    icon: FileText,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];