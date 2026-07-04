export type Role =
  | "SYSTEM_ADMIN"
  | "GOVERNMENT_ADMIN"
  | "AGRARIAN_SERVICE_OFFICER"
  | "FARMER"
  | "PRIVATE_AGRO_DEALER"
  | "ORGANIC_FERTILIZER_PRODUCER";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN", "AGRARIAN_SERVICE_OFFICER", "FARMER", "PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
  {
    id: "user-management",
    label: "User Management",
    href: "/user-management",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN", "AGRARIAN_SERVICE_OFFICER", "FARMER", "PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
  {
    id: "finance",
    label: "Finance",
    href: "/finance",
    roles: ["GOVERNMENT_ADMIN", "SYSTEM_ADMIN"],
  },
  {
    id: "hr",
    label: "HR",
    href: "/hr",
    roles: ["GOVERNMENT_ADMIN", "SYSTEM_ADMIN"],
  },
  {
    id: "departments",
    label: "Departments",
    href: "/departments",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN"],
  },
  {
    id: "logout",
    label: "Logout",
    href: "/auth",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN", "AGRARIAN_SERVICE_OFFICER", "FARMER", "PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
];

/**
 * Returns the navigation items that the user with the given roles should see.
 * Accepts an array of roles (strings) and returns unique NavItem entries.
 */
export function getNavItemsForRoles(userRoles: Role[] | string[]): NavItem[] {
  const roleSet = new Set((userRoles || []).map((r) => String(r)));
  return NAV_ITEMS.filter((item) => item.roles.some((r) => roleSet.has(r)));
}

export default NAV_ITEMS;

import { Home, User, Settings, DollarSign, Users, Layers, LogOut } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const ICONS_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: Home,
  "user-management": Users,
  profile: User,
  settings: Settings,
  finance: DollarSign,
  hr: Users,
  departments: Layers,
  logout: LogOut,
};
