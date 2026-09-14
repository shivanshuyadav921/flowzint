import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  id?: number;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role?: string;
}

interface AuthStore {
  token: string | null;
  user: UserProfile | null;
  isHydrated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setAuth: (token: string, user: UserProfile) => void;
  setHydrated: (hydrated: boolean) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isHydrated: false,
      setToken: (token) => {
        if (token) {
          localStorage.setItem("flowzint_token", token);
        } else {
          localStorage.removeItem("flowzint_token");
        }
        set({ token });
      },
      setUser: (user) => set({ user }),
      setAuth: (token, user) => {
        localStorage.setItem("flowzint_token", token);
        set({ token, user });
      },
      setHydrated: (isHydrated) => set({ isHydrated }),
      logout: () => {
        localStorage.removeItem("flowzint_token");
        set({ token: null, user: null });
      },
    }),
    {
      name: "flowzint-auth-storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

