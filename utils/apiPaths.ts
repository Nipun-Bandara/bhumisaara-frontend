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
    myWallet: "/users/me/wallet",
  },
  farmers: {
    myArea: "/farmers/me/area",
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
