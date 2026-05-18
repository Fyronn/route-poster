export type SidebarRole = "admin" | "service-manager" | "all";
export type SidebarIcon =
  | "bus"
  | "building"
  | "dashboard"
  | "map-pin"
  | "route"
  | "users"
  | "check-square";

export type AdminSidebarItem = {
  href: string;
  icon: SidebarIcon;
  label: string;
  roles: SidebarRole[];
};

export const adminSidebarItems: AdminSidebarItem[] = [
  {
    label: "Panel",
    href: "/admin",
    icon: "dashboard",
    roles: ["all"],
  },
  {
    label: "Musteriler",
    href: "/admin/clients",
    icon: "building",
    roles: ["admin"],
  },
  {
    label: "Suruculer",
    href: "/admin/drivers",
    icon: "users",
    roles: ["admin"],
  },
  {
    label: "Araclar",
    href: "/admin/vehicles",
    icon: "bus",
    roles: ["admin"],
  },
  {
    label: "Calisanlar",
    href: "/admin/corporate-shuttle/employees",
    icon: "users",
    roles: ["service-manager"],
  },
  {
    label: "Duraklar",
    href: "/admin/corporate-shuttle/stops",
    icon: "map-pin",
    roles: ["service-manager"],
  },
  {
    label: "Rota Talepleri",
    href: "/admin/corporate-shuttle/route-requests",
    icon: "route",
    roles: ["service-manager"],
  },
  {
    label: "Rota Onaylari",
    href: "/admin/route-request-approvals",
    icon: "check-square",
    roles: ["admin"],
  }
];
