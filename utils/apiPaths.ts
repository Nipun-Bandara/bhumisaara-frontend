const apiPaths = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  batches: {
    save: "/batches",
  },
  distributions: {
    // The officer → farmer handover. Was "/handovers", which the backend has
    // never served — the controller is mapped to /api/v1/distributions.
    record: "/v1/distributions",
    // Every handover nationally — the ministry's burn ledger.
    all: "/v1/distributions",
    pending: "/v1/distributions/pending",
    validateSack: "/v1/distributions/validate-sack",
    officer: "/v1/distributions/officer",
    farmer: "/v1/distributions/farmer",
    dispute: (distributionId: number) => `/v1/distributions/${distributionId}/dispute`,
  },
  sacks: {
    // The calling officer's own stock — their real local inventory.
    mine: "/v1/sacks/mine",
    byBatch: (batchId: number) => `/v1/sacks/batch/${batchId}`,
    backfill: (batchId: number) => `/v1/sacks/backfill/${batchId}`,
  },
  transfers: {
    // Outstanding demand per area + fertilizer type, officer already resolved.
    demand: "/v1/transfers/demand",
    record: "/v1/transfers",
    history: "/v1/transfers",
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
