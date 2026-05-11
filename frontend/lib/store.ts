import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  user: { email: string; full_name: string } | null;
  setToken: (token: string | null) => void;
  setUser: (user: { email: string; full_name: string } | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null });
        localStorage.removeItem("flowzint_token");
      },
    }),
    {
      name: "auth-store",
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
