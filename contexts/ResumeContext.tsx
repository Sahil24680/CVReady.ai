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

/**
 * Global context for managing resume and profile data.
 *
 * Features:
 * - Fetches resume and profile data from Supabase
 * - Provides loading state and refresh functionality
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

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [FetchingResume, setFetchingResume] = useState(true);
  const [FetchingProfile, setFetchingProfile] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeRecord[]>([]);
  const [profileData, setProfileData] = useState<User_profile | null>(null);
  const [resumeRefreshTrigger, setResumeRefreshTrigger] = useState(false);
  const [profileRefreshTrigger, setProfileRefreshTrigger] = useState(false);

  const refreshResumes = () => setResumeRefreshTrigger((prev) => !prev);
  const refreshProfile = () => setProfileRefreshTrigger((prev) => !prev);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("[DEBUG][ResumeContext] Synced session:", data.session);
    });
  }, []);

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  useEffect(() => {
    setFetchingResume(true);
    const getResumes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("[DEBUG][getResumes] Current user:", user);
      if (!user) {
        console.error("User not logged in");
        setFetchingResume(false);
        return;
      }

      const { data, error } = await supabase
        .from("Resume_datas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Supabase error:", error.message);
        setFetchingResume(false);
        return;
      }

      if (data) {
        const structuredData: ResumeRecord[] = data.map((row) => ({
          id: row.id,
          resume_name: row.Resume_name,
          openai_feedback: row.openai_feedback,
          created_at: formatDate(row.created_at),
          Role:row.Role
        }));

        setResumeData(structuredData);
      }
      setFetchingResume(false);
    };

    getResumes();
  }, [resumeRefreshTrigger]);

  useEffect(() => {
    const getProfile = async () => {
      setFetchingProfile(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not logged in");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) {
        console.error("❌ Supabase profile error:", profileError.message);
      } else {
        setProfileData(profile);
      }
      setFetchingProfile(false);
    };

    getProfile();
  }, [profileRefreshTrigger]);

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
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResumeContext must be used within ResumeProvider");
  }
  return context;
};
