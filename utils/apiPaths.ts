const apiPaths = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  batches: {
    save: "/batches",
  },
  handovers: {
    record: "/handovers",
  },
  areas: {
    list: "/areas",
  },
  officers: {
    list: "/officers",
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
