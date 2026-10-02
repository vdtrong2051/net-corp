"use client";

import * as React from "react";

import { defaultMockUser, mockUsersByRole } from "@/shared/config/mock-users";
import type { AppRole } from "@/shared/types/role";
import type { MockUser } from "@/shared/types/user";

const STORAGE_KEY = "net-corp:mock-role";
const ROLE_CHANGE_EVENT = "net-corp:mock-role-change";

type MockSessionContextValue = {
  user: MockUser;
  role: AppRole;
  setRole: (role: AppRole) => void;
};

const MockSessionContext = React.createContext<MockSessionContextValue | null>(
  null
);

function isAppRole(value: string | null): value is AppRole {
  return value === "OWNER" || value === "MANAGER" || value === "STAFF";
}

function getStoredRole(): AppRole {
  if (typeof window === "undefined") {
    return defaultMockUser.role;
  }

  const storedRole = window.localStorage.getItem(STORAGE_KEY);

  return isAppRole(storedRole) ? storedRole : defaultMockUser.role;
}

function getServerRole(): AppRole {
  return defaultMockUser.role;
}

function subscribeToRoleChange(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleRoleChange = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
  };
}

export function MockSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = React.useSyncExternalStore(
    subscribeToRoleChange,
    getStoredRole,
    getServerRole
  );

  const user = mockUsersByRole[role];

  const setRole = React.useCallback((nextRole: AppRole) => {
    window.localStorage.setItem(STORAGE_KEY, nextRole);

    window.dispatchEvent(new Event(ROLE_CHANGE_EVENT));
  }, []);

  const value = React.useMemo<MockSessionContextValue>(
    () => ({
      user,
      role,
      setRole,
    }),
    [user, role, setRole]
  );

  return (
    <MockSessionContext.Provider value={value}>
      {children}
    </MockSessionContext.Provider>
  );
}

export function useMockSession() {
  const context = React.useContext(MockSessionContext);

  if (!context) {
    throw new Error("useMockSession must be used inside MockSessionProvider");
  }

  return context;
}
