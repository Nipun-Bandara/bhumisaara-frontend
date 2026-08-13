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
    // Farmers see their own applications here; officers see every application
    // from their area (see app/(ui)/applications-history/page.tsx).
    id: "applicationsHistory",
    label: "Applications History",
    href: "/applications-history",
    roles: ["FARMER", "AGRARIAN_SERVICE_OFFICER"],
  },
  {
    id: "requestApprovals",
    label: "Request Approvals",
    href: "/request-approvals",
    roles: ["AGRARIAN_SERVICE_OFFICER"],
  },
  {
    id: "handover",
    label: "Handover",
    href: "/handover",
    roles: ["AGRARIAN_SERVICE_OFFICER"],
  },
  {
    id: "ownDistribution",
    label: "Own Distribution",
    href: "/own-distribution",
    roles: ["AGRARIAN_SERVICE_OFFICER"],
  },
  {
    // The farmer's marketplace: buy from dealers and producers with credits.
    id: "marketplace",
    label: "Marketplace",
    href: "/marketplace",
    roles: ["FARMER"],
  },
  {
    id: "myOrders",
    label: "My Orders",
    href: "/my-orders",
    roles: ["FARMER"],
  },
  {
    id: "creditBalance",
    label: "Subsidy Credits",
    href: "/credit-balance",
    roles: ["FARMER"],
  },
  {
    id: "distributionLevel",
    label: "Distribution Level",
    href: "/distribution-level",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "creditIssuance",
    label: "Issue Credits",
    href: "/credit-issuance",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "redemptionClaims",
    label: "Redemption Claims",
    href: "/redemption-claims",
    roles: ["GOVERNMENT_ADMIN", "SYSTEM_ADMIN"],
  },
  {
    id: "creditOversight",
    label: "Credit Oversight",
    href: "/credit-oversight",
    roles: ["GOVERNMENT_ADMIN", "SYSTEM_ADMIN"],
  },
  {
    id: "importHistory",
    label: "Import History",
    href: "/import-history",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "officerDistribution",
    label: "Distribute to Officers",
    href: "/officer-distribution",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "sackLabels",
    label: "Sack Labels",
    href: "/sack-labels",
    roles: ["GOVERNMENT_ADMIN"],
  },
  {
    id: "officerAssign",
    label: "Assign Officers",
    href: "/officer-assign",
    roles: ["GOVERNMENT_ADMIN", "SYSTEM_ADMIN"],
  },
  {
    // Both seller roles share these three screens — the only difference between
    // a dealer and a producer is the organic flag, which the server sets.
    id: "inventory",
    label: "My Listings",
    href: "/inventory",
    roles: ["PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
  {
    id: "incomingOrders",
    label: "Incoming Orders",
    href: "/incoming-orders",
    roles: ["PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
  {
    id: "redemption",
    label: "Redemption",
    href: "/redemption",
    roles: ["PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  },
  {
    id: "profile",
    label: "Profile",
    href: "/profile",
    roles: ["SYSTEM_ADMIN", "GOVERNMENT_ADMIN", "AGRARIAN_SERVICE_OFFICER", "FARMER", "PRIVATE_AGRO_DEALER", "ORGANIC_FERTILIZER_PRODUCER"],
  }
];

/**
 * Returns the navigation items that the user with the given role should see.
 */
export function getNavItemsForRole(userRole: Role | string | null | undefined): NavItem[] {
  if (!userRole) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(userRole as Role));
}

export default NAV_ITEMS;

import { Home, User, Settings, DollarSign, Users, Layers, LogOut, FileText, History, Package, UserCheck, ClipboardCheck, QrCode, Truck, Flame, Store, ShoppingCart, Coins, ReceiptText, ShieldCheck, PackageCheck, Banknote } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const ICONS_MAP: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  dashboard: Home,
  applicationForm: FileText,
  applicationsHistory: History,
  requestApprovals: ClipboardCheck,
  importHistory: History,
  distributionLevel: Layers,
  officerAssign: UserCheck,
  officerDistribution: Truck,
  handover: Flame,
  sackLabels: QrCode,
  ownDistribution: History,
  inventory: Package,
  // Marketplace & subsidy credits
  marketplace: Store,
  myOrders: ShoppingCart,
  creditBalance: Coins,
  creditIssuance: Coins,
  redemptionClaims: ReceiptText,
  creditOversight: ShieldCheck,
  incomingOrders: PackageCheck,
  redemption: Banknote,
  profile: User,
};
