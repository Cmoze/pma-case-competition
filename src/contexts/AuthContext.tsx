import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { db, type AuthUser } from "@/lib/localDb";

type Role = "member" | "guest";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: Role;
  is_pma_member: boolean | null;
  is_blocked: boolean;
  deleted_at: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isUser: boolean;
  isGuest: boolean;
  isBlocked: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (currentUser: AuthUser | null) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data } = await db
      .from("profiles")
      .select("id, user_id, full_name, email, role, is_pma_member, is_blocked, deleted_at")
      .eq("user_id", currentUser.id)
      .maybeSingle();

    setProfile(
      data
        ? {
            id: data.id,
            user_id: data.user_id,
            full_name: data.full_name,
            email: data.email,
            role: (data.role ?? "guest") as Role,
            is_pma_member: data.is_pma_member ?? null,
            is_blocked: data.is_blocked ?? false,
            deleted_at: data.deleted_at ?? null,
          }
        : null,
    );
  };

  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await db.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      setUser(currentUser ?? null);
      await loadProfile(currentUser ?? null);
      setLoading(false);
    };

    init();

    const { data: { subscription } } = db.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        void loadProfile(currentUser);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    const { data: { user: currentUser } } = await db.auth.getUser();
    await loadProfile(currentUser ?? null);
  };

  const isBlocked = !!(profile && (profile.is_blocked || profile.deleted_at));
  const effectiveRole: Role = isBlocked ? "guest" : (profile?.role ?? "guest");

  const value: AuthContextValue = {
    user,
    profile,
    loading,
    isUser: effectiveRole === "member",
    isGuest: effectiveRole === "guest",
    isBlocked,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

