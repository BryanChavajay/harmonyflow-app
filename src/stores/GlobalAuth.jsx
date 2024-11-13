import { create } from "zustand";

export const useStoreAuth = create((set) => ({
  isAuthenticated: false,
  permissions: [],
  user: "",
  resetAuth: () =>
    set(() => ({ isAuthenticated: false, permissions: [], user: "" })),
  setAuth: (newPermissions, newPser) =>
    set(() => ({
      isAuthenticated: true,
      permissions: newPermissions,
      user: newPser,
    })),
}));
