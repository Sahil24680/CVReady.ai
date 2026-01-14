"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ResumeRecord, User_profile } from "@/types/resume";
import { supabase } from "@/app/utils/supabase/client";

/* 🔽 NEW: react-query imports */
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/**
 * Global context for managing resume and profile data.
 *
 * Features (now powered by React Query):
 * - Fetches resume and profile data from Supabase
 * - Provides loading state and refresh functionality (via cache invalidation)
 * - Shares data across the app using React Context
 */
type ResumeContextType = {
  resumeData: ResumeRecord[];
  profileData: User_profile | null;
  refreshResumes: () => void;
  refreshProfile: () => void;
  FetchingResume: boolean;
  FetchingProfile: boolean;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

/** Formats ISO date string to MM/DD/YYYY for display */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Hook to get the current authenticated user's ID.
 * Returns: undefined (checking), string (logged in), or null (logged out)
 */
function useAuthUserId() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  return userId;
}

/** Fetches all resumes for a user, sorted by creation date (newest first) */
function useResumesQuery(userId: string | null) {
  return useQuery({
    queryKey: ["resumes", userId],
    enabled: !!userId, // don't run until we know the user
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Resume_datas")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error.message);
        throw error;
      }

      const structured: ResumeRecord[] =
        data?.map((row: any) => ({
          id: row.id,
          resume_name: row.Resume_name,
          openai_feedback: row.openai_feedback,
          created_at: formatDate(row.created_at),
          Role: row.Role,
        })) ?? [];

      return structured;
    },
  });
}

/** Fetches the user's profile data from Supabase */
function useProfileQuery(userId: string | null) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();

      if (profileError) {
        console.error("❌ Supabase profile error:", profileError.message);
        throw profileError;
      }
      return (profile as User_profile) ?? null;
    },
  });
}

/**
 * Root provider that sets up React Query and resume/profile context.
 * Wrap your app with this to enable data fetching and caching.
 */
export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ResumeProviderInner>{children}</ResumeProviderInner>
    </QueryClientProvider>
  );
};

/**
 * Inner provider that handles data fetching with React Query.
 * Separated from ResumeProvider to access QueryClient via hooks.
 */
function ResumeProviderInner({ children }: { children: ReactNode }) {
  const userId = useAuthUserId();
  const queryClient = useQueryClient();

  const resumesQuery = useResumesQuery(userId ?? null);
  const profileQuery = useProfileQuery(userId ?? null);

  // Show loading state while checking auth or fetching initial data
  const isAuthenticating = userId === undefined;
  const isInitialResumesLoad = !!userId && resumesQuery.isPending && !resumesQuery.data;
  const isInitialProfileLoad = !!userId && profileQuery.isPending && !profileQuery.data;

  const FetchingResume = isAuthenticating || isInitialResumesLoad;
  const FetchingProfile = isAuthenticating || isInitialProfileLoad;

  const resumeData = resumesQuery.data ?? [];
  const profileData = profileQuery.data ?? null;

  // Invalidate cache to trigger refetch
  const refreshResumes = () => {
    if (userId) queryClient.invalidateQueries({ queryKey: ["resumes", userId] });
  };
  const refreshProfile = () => {
    if (userId) queryClient.invalidateQueries({ queryKey: ["profile", userId] });
  };


  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        profileData,
        refreshResumes,
        refreshProfile,
        FetchingResume,
        FetchingProfile,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

// Hook to access resume/profile context — must be used inside <ResumeProvider>
export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResumeContext must be used within ResumeProvider");
  }
  return context;
};
