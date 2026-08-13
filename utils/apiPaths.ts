/**
 * Every backend endpoint the app calls, in one place.
 *
 * Paths are relative to `NEXT_PUBLIC_API_URL`, which points at the backend's
 * context path (`http://localhost:8080/api/v1`). The version therefore lives in
 * the base URL — on the backend in `server.servlet.context-path`, here in the
 * env var — and never in the entries below.
 */
const apiPaths = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  batches: {
    list: "/batches",
    create: "/batches",
  },
  distributions: {
    // The officer → farmer handover.
    record: "/distributions",
    // Every handover nationally — the ministry's burn ledger.
    all: "/distributions",
    pending: "/distributions/pending",
    validateSack: "/distributions/validate-sack",
    officer: "/distributions/officer",
    farmer: "/distributions/farmer",
    dispute: (distributionId: number) => `/distributions/${distributionId}/dispute`,
  },
  sacks: {
    // The calling officer's own stock — their real local inventory.
    mine: "/sacks/mine",
    byBatch: (batchId: number) => `/sacks/batch/${batchId}`,
    backfill: (batchId: number) => `/sacks/backfill/${batchId}`,
  },
  transfers: {
    // Outstanding demand per area + fertilizer type, officer already resolved.
    demand: "/transfers/demand",
    record: "/transfers",
    history: "/transfers",
  },
  areas: {
    list: "/areas",
  },
  officers: {
    list: "/officers",
    me: "/officers/me",
    assign: "/officers/assign",
  },
  users: {
    myProfile: "/users/me/profile",
    myWallet: "/users/me/wallet",
  },
  farmers: {
    myArea: "/farmers/me/area",
  },
  credits: {
    // Subsidy credits — a claim on the treasury, never on a warehouse.
    seasons: "/credits/seasons",
    eligibleFarmers: (season: string) =>
      `/credits/eligible-farmers?season=${encodeURIComponent(season)}`,
    issue: "/credits/issue",
    issuances: "/credits/issuances",
    // The farmer's own ledger position + the token ids to read balanceOf against.
    balance: "/credits/balance",
    reconciliation: (season?: string) =>
      season ? `/credits/reconciliation?season=${encodeURIComponent(season)}` : "/credits/reconciliation",
  },
  listings: {
    // Every ACTIVE listing — the marketplace, open to any signed-in user.
    browse: "/listings",
    mine: "/listings/mine",
    create: "/listings",
    byId: (listingId: number) => `/listings/${listingId}`,
    update: (listingId: number) => `/listings/${listingId}`,
    remove: (listingId: number) => `/listings/${listingId}`,
  },
  orders: {
    place: "/orders",
    // Server-side costing, so the live breakdown matches what will be stored.
    quote: (listingId: number, quantityKg: number, creditsUsed: number) =>
      `/orders/quote?listingId=${listingId}&quantityKg=${quantityKg}&creditsUsed=${creditsUsed}`,
    mine: "/orders/me",
    seller: "/orders/seller",
    all: "/orders",
    ready: (orderId: number) => `/orders/${orderId}/ready`,
    // The only call that moves credits, and only a farmer may make it.
    confirm: (orderId: number) => `/orders/${orderId}/confirm`,
    cancel: (orderId: number) => `/orders/${orderId}/cancel`,
    dispute: (orderId: number) => `/orders/${orderId}/dispute`,
  },
  redemptionClaims: {
    submit: "/redemption-claims",
    mine: "/redemption-claims/me",
    pending: "/redemption-claims/pending",
    all: "/redemption-claims",
    review: (claimId: number) => `/redemption-claims/${claimId}/review`,
    settle: (claimId: number) => `/redemption-claims/${claimId}/settle`,
  },
  /**
   * The SYSTEM_ADMIN operator surface. User and platform administration only —
   * there is deliberately no token, batch, credit, listing or order path here,
   * because an operator governs who may act and never acts themselves.
   */
  admin: {
    users: (query?: string) => (query ? `/admin/users?${query}` : "/admin/users"),
    user: (userId: number) => `/admin/users/${userId}`,
    ban: (userId: number) => `/admin/users/${userId}/ban`,
    unban: (userId: number) => `/admin/users/${userId}/unban`,
    resetPassword: (userId: number) => `/admin/users/${userId}/reset-password`,
    role: (userId: number) => `/admin/users/${userId}/role`,
    area: (userId: number) => `/admin/users/${userId}/area`,
    // Clear only. No endpoint sets a wallet address — see AdminUserService.
    wallet: (userId: number) => `/admin/users/${userId}/wallet`,
    areas: "/admin/areas",
    areaCoverage: "/admin/areas/coverage",
    updateArea: (areaId: number) => `/admin/areas/${areaId}`,
    deactivateArea: (areaId: number) => `/admin/areas/${areaId}/deactivate`,
    activateArea: (areaId: number) => `/admin/areas/${areaId}/activate`,
    wallets: (unlinkedOnly?: boolean) =>
      unlinkedOnly ? "/admin/wallets?unlinkedOnly=true" : "/admin/wallets",
    health: "/admin/health",
    auditLogs: (query?: string) =>
      query ? `/admin/audit-logs?${query}` : "/admin/audit-logs",
  },
  fertilizerRequests: {
    create: "/fertilizer-requests",
    mine: "/fertilizer-requests/me",
    pending: "/fertilizer-requests/pending",
    area: "/fertilizer-requests/area",
    review: (requestId: number) => `/fertilizer-requests/${requestId}/review`,
  },
};

export default apiPaths;
export { apiPaths };
