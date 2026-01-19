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
  isLoadingResume: boolean;
  isLoadingProfile: boolean;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

/* util preserved */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}


function useAuthUserId() {
   // undefined = still checking, string = logged in, null = logged out
   const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  return userId;
}

// Database row type for Resume_datas table
interface ResumeDataRow {
  id: number;
  Resume_name: string;
  openai_feedback: any;
  created_at: string;
  Role: string;
  user_id: string;
}

// resumes query
function useResumesQuery(userId: string | null) {
  return useQuery({
    queryKey: ["resumes", userId],
    enabled: !!userId, // don't run until we know the user
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent unnecessary refetches
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
        data?.map((row: ResumeDataRow) => ({
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

// profile query
function useProfileQuery(userId: string | null) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent unnecessary refetches
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

// Provides React Query and resume/profile context to all child components
export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ResumeProviderInner>{children}</ResumeProviderInner>
    </QueryClientProvider>
  );
};

// Helper used by ResumeProvider: fetches data with React Query and exposes it through context
function ResumeProviderInner({ children }: { children: ReactNode }) {
  const userId = useAuthUserId();
  const qc = useQueryClient();

  // Queries replace useEffect + local arrays
  const resumesQ = useResumesQuery(userId ?? null);
  const profileQ = useProfileQuery(userId ?? null);
  const waitingForAuth = userId === undefined;

  const initialResumesLoad = !!userId && resumesQ.isPending && !resumesQ.data;
  const initialProfileLoad = !!userId && profileQ.isPending && !profileQ.data;

  const isLoadingResume  = waitingForAuth || initialResumesLoad;
  const isLoadingProfile = waitingForAuth || initialProfileLoad;
  

  const resumeData  = resumesQ.data ?? [];
  const profileData = profileQ.data ?? null;

  const refreshResumes = () => { if (userId) qc.invalidateQueries({ queryKey: ["resumes", userId] }) };
  const refreshProfile = () => { if (userId) qc.invalidateQueries({ queryKey: ["profile", userId] }) };


  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        profileData,
        refreshResumes,
        refreshProfile,
        isLoadingResume,
        isLoadingProfile,
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
