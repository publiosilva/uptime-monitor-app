import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { setUnauthorizedHandler } from "@/lib/api";
import { loadToken } from "@/lib/token";
import { authService } from "@/services/auth";

type SessionContextValue = {
  session: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    loadToken()
      .then((token) => {
        if (!cancelled) setSession(token);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const token = await authService.login({ email, password });
    setSession(token);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await authService.register({ email, password });
    const token = await authService.login({ email, password });
    setSession(token);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [session, isLoading, signIn, signUp, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
