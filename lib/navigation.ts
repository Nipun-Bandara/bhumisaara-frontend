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
    id: "ownDistribution",
    label: "Own Distribution",
    href: "/own-distribution",
    roles: ["AGRARIAN_SERVICE_OFFICER"],
  },
  {
    id: "distributionLevel",
    label: "Distribution Level",
    href: "/distribution-level",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "importHistory",
    label: "Import History",
    href: "/import-history",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN", "AGRARIAN_SERVICE_OFFICER", "FARMER", "PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
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
  importHistory: History,
  distributionLevel: Layers,
  ownDistribution: History,  
  profile: User,
};
