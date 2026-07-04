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
    id: "applicationForm",
    label: "Application Form",
    href: "/application-form",
    roles: ["FARMER"],
  },
  {
    id: "applicationsHistory",
    label: "Applications History",
    href: "/applications-history",
    roles: ["FARMER"],
  },
  {
    id: "userManagement",
    label: "User Management",
    href: "/user-management",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN"],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
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
  }
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

import { Home, User, Settings, DollarSign, Users, Layers, LogOut, FileText, History } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const ICONS_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: Home,
  applicationForm: FileText,
  applicationsHistory: History,
  userManagement: Users,
  profile: User,
  finance: DollarSign,
  hr: Users,
  departments: Layers,
};
