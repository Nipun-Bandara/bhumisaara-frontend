/**
 * localStorage key for the wallet address we have already persisted to the
 * backend for a given user.
 *
 * Scoped per user id so two accounts sharing a browser can't read each other's
 * entry — otherwise the second user would look "already synced" and their wallet
 * would never reach the backend.
 *
 * Lives here rather than in `hooks/use-wallet-address-sync.ts` because
 * `AuthContext` clears this on logout, and that hook imports `useAuth` — importing
 * it back from the hook would be a circular dependency.
 */
export const walletAddressStorageKey = (userId: string) => `walletAddress:${userId}`;
