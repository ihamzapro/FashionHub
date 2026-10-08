"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { User, UserRole, UserAddress } from "@/lib/types";
import { mockUsers as initialMockUsers } from "@/lib/mock-data/users";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "customer" | "supplier";
  storeName?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (address: UserAddress) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  switchAccount: (targetRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = "fashionhub_auth_current_user";
const REGISTERED_USERS_KEY = "fashionhub_registered_users";
const DEFAULT_PASSWORD = "password123";

// Seed default users with passwords and addresses if not already set
const SEED_USERS: User[] = initialMockUsers.map((u) => ({
  ...u,
  password: DEFAULT_PASSWORD,
  address:
    u.role === "customer"
      ? {
          street: "742 Evergreen Terrace, Suite 4B",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "United States",
        }
      : u.role === "supplier"
      ? {
          street: "18 Rue du Faubourg Saint-Honoré",
          city: "Paris",
          state: "Île-de-France",
          postalCode: "75008",
          country: "France",
        }
      : {
          street: "One Fashion Place, Penthouse",
          city: "London",
          state: "Greater London",
          postalCode: "W1S 2TE",
          country: "United Kingdom",
        },
}));

interface AuthMemoryState {
  currentUser: User | null;
  users: User[];
  isHydrated: boolean;
}

let authMemoryState: AuthMemoryState = {
  currentUser: null,
  users: SEED_USERS,
  isHydrated: false,
};

let hasLoadedFromStorage = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadInitialAuthState(): AuthMemoryState {
  if (typeof window === "undefined") {
    return authMemoryState;
  }

  if (!hasLoadedFromStorage) {
    try {
      // 1. Load users registry
      const storedUsersRaw = window.localStorage.getItem(REGISTERED_USERS_KEY);
      let usersList: User[] = SEED_USERS;
      if (storedUsersRaw) {
        try {
          const parsed = JSON.parse(storedUsersRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            usersList = parsed;
          }
        } catch (e) {
          console.error("Failed to parse stored users", e);
        }
      } else {
        window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(SEED_USERS));
      }

      // 2. Load active current user session
      let activeUser: User | null = null;
      const storedCurrent = window.localStorage.getItem(CURRENT_USER_KEY);
      if (storedCurrent) {
        try {
          const parsed = JSON.parse(storedCurrent);
          if (parsed && parsed.email) {
            // Find latest matching record from usersList
            const match = usersList.find((u) => u.email.toLowerCase() === parsed.email.toLowerCase());
            activeUser = match || parsed;
          }
        } catch (e) {
          console.error("Failed to parse current user", e);
        }
      }

      authMemoryState = {
        currentUser: activeUser,
        users: usersList,
        isHydrated: true,
      };
      hasLoadedFromStorage = true;
    } catch (e) {
      console.error("Failed to initialize auth state", e);
      authMemoryState = {
        ...authMemoryState,
        isHydrated: true,
      };
      hasLoadedFromStorage = true;
    }
  }

  return authMemoryState;
}

function saveUsersToStorage(users: User[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users", e);
  }
}

function saveCurrentUserToStorage(user: User | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error("Failed to save current user", e);
  }
}

const SERVER_AUTH_SNAPSHOT: AuthMemoryState = {
  currentUser: null,
  users: SEED_USERS,
  isHydrated: false,
};

const authStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): AuthMemoryState {
    if (typeof window !== "undefined" && !hasLoadedFromStorage) {
      return loadInitialAuthState();
    }
    return authMemoryState;
  },
  getServerSnapshot(): AuthMemoryState {
    return SERVER_AUTH_SNAPSHOT;
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot
  );

  const currentUser = store.currentUser;
  const isHydrated = store.isHydrated;

  const value = useMemo<AuthContextType>(() => {
    return {
      user: currentUser,
      role: currentUser?.role || null,
      isAuthenticated: Boolean(currentUser),
      isLoading: !isHydrated,
      isHydrated,

      async login(email: string, password: string) {
        const cleanEmail = email.trim().toLowerCase();
        const users = authMemoryState.users;

        const foundUser = users.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );

        if (!foundUser) {
          return { success: false, error: "No account found with this email address." };
        }

        // Check password (allow default password123 or stored password)
        const validPassword = foundUser.password || DEFAULT_PASSWORD;
        if (password !== validPassword && password !== DEFAULT_PASSWORD) {
          return { success: false, error: "Incorrect password. Please try again." };
        }

        if (foundUser.status === "suspended") {
          return { success: false, error: "This account has been suspended by administration." };
        }

        // Set as active user
        authMemoryState = {
          ...authMemoryState,
          currentUser: foundUser,
        };
        saveCurrentUserToStorage(foundUser);
        notify();

        return { success: true };
      },

      logout() {
        authMemoryState = {
          ...authMemoryState,
          currentUser: null,
        };
        saveCurrentUserToStorage(null);
        notify();
      },

      async register(data: RegisterData) {
        const cleanEmail = data.email.trim().toLowerCase();

        // Admin accounts must NOT be publicly registerable
        if ((data.role as string) === "admin") {
          return { success: false, error: "Admin accounts cannot be registered publicly." };
        }

        // Validate role is strictly customer or supplier
        if (data.role !== "customer" && data.role !== "supplier") {
          return { success: false, error: "Invalid account role selected." };
        }

        const existingUser = authMemoryState.users.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );

        if (existingUser) {
          return { success: false, error: "An account with this email address already exists." };
        }

        const newUser: User = {
          id: `usr-${data.role}-${Date.now().toString(36)}`,
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password,
          role: data.role,
          phone: data.phone || "",
          storeName: data.role === "supplier" ? data.storeName || `${data.name}'s Atelier` : undefined,
          avatar: `https://images.unsplash.com/photo-${data.role === "supplier" ? "1507003211169-0a1dd7228f2d" : "1534528741775-53994a69daeb"}?q=80&w=400&auto=format&fit=crop`,
          status: "active",
          createdAt: new Date().toISOString(),
          address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
        };

        const updatedUsers = [...authMemoryState.users, newUser];
        authMemoryState = {
          ...authMemoryState,
          users: updatedUsers,
          currentUser: newUser,
        };

        saveUsersToStorage(updatedUsers);
        saveCurrentUserToStorage(newUser);
        notify();

        return { success: true };
      },

      async updateProfile(updates: Partial<User>) {
        if (!authMemoryState.currentUser) {
          return { success: false, error: "You must be signed in to update your profile." };
        }

        const currentId = authMemoryState.currentUser.id;
        const updatedUser: User = {
          ...authMemoryState.currentUser,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        const updatedUsers = authMemoryState.users.map((u) =>
          u.id === currentId ? updatedUser : u
        );

        authMemoryState = {
          ...authMemoryState,
          users: updatedUsers,
          currentUser: updatedUser,
        };

        saveUsersToStorage(updatedUsers);
        saveCurrentUserToStorage(updatedUser);
        notify();

        return { success: true };
      },

      async updateAddress(newAddress: UserAddress) {
        if (!authMemoryState.currentUser) {
          return { success: false, error: "You must be signed in to update address." };
        }

        return this.updateProfile({ address: newAddress });
      },

      async changePassword(currentPassword: string, newPassword: string) {
        if (!authMemoryState.currentUser) {
          return { success: false, error: "You must be signed in to change password." };
        }

        const expected = authMemoryState.currentUser.password || DEFAULT_PASSWORD;
        if (currentPassword !== expected && currentPassword !== DEFAULT_PASSWORD) {
          return { success: false, error: "Current password does not match our records." };
        }

        return this.updateProfile({ password: newPassword });
      },

      async resetPassword(email: string, newPassword: string) {
        const cleanEmail = email.trim().toLowerCase();
        const userIndex = authMemoryState.users.findIndex(
          (u) => u.email.toLowerCase() === cleanEmail
        );

        if (userIndex === -1) {
          return { success: false, error: "No account found with this email." };
        }

        const updatedUser = {
          ...authMemoryState.users[userIndex],
          password: newPassword,
          updatedAt: new Date().toISOString(),
        };

        const updatedUsers = [...authMemoryState.users];
        updatedUsers[userIndex] = updatedUser;

        const isCurrent = authMemoryState.currentUser?.email.toLowerCase() === cleanEmail;

        authMemoryState = {
          ...authMemoryState,
          users: updatedUsers,
          currentUser: isCurrent ? updatedUser : authMemoryState.currentUser,
        };

        saveUsersToStorage(updatedUsers);
        if (isCurrent) saveCurrentUserToStorage(updatedUser);
        notify();

        return { success: true };
      },

      switchAccount(targetRole: UserRole) {
        const match = authMemoryState.users.find((u) => u.role === targetRole);
        if (match) {
          authMemoryState = {
            ...authMemoryState,
            currentUser: match,
          };
          saveCurrentUserToStorage(match);
          notify();
        }
      },
    };
  }, [currentUser, isHydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
