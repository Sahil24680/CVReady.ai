"use client";
import { useState } from "react";
import Profile from "./components/Profile";
import Mange_uploads from "./components/Mange_uploads";
import Skeleton from "react-loading-skeleton";
import { useEffect } from "react";
import { useResumeContext } from "@/contexts/ResumeContext";
import EvaluationModal from "@/app/components/EvaluationModal";


/**
 * Settings page component for user profile and resume management.
 * 
 * Features:
 * - Tabbed interface for switching between Profile and Resume Uploads
 * - Displays skeleton loader while data is being fetched
 * - Integrates with ResumeContext for profile/resume data and refresh logic
 * - Passes props to modular subcomponents: Profile and Mange_uploads
 */


const Setting = () => {
  const [activeTab, setActiveTab] = useState<"Profile" | "Uploads">("Profile");
  const { resumeData, profileData, refreshResumes,refreshProfile,FetchingResume,FetchingProfile } = useResumeContext();
  

  return (
    <div className="w-full h-full p-6 bg-[#ebf2fc]">
      <EvaluationModal/>
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="text-gray-500 mb-4">Manage your profile and account</p>
      <hr className="border-t border-gray-400" />
      {/* Profile and Manage uplaods buttons */}
      <div className="flex justify-center p-6">
        {FetchingProfile ? (
          <Skeleton height={40} width={200} borderRadius={8} />
        ) : (
          <div className="flex rounded-lg overflow-hidden border w-fit">
            {/* Profile button */}
            <button
              onClick={() => setActiveTab("Profile")}
              className={`px-6 py-2 font-medium transition cursor-pointer  ${
                activeTab === "Profile"
                  ? "bg-[#06367a] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Profile
            </button>

            {/* Manage uploads button */}
            <button
              onClick={() => setActiveTab("Uploads")}
              className={`px-6 py-2 font-medium transition cursor-pointer  ${
                activeTab === "Uploads"
                  ? "bg-[#06367a] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Uploads
            </button>
          </div>
        )}
      </div>

      {/* Profile/ manageuplaods content */}
      <div className="p-6 bg-white rounded-xl w-full shadow-md ">
        {activeTab === "Profile" && (
          <div className="animate-fadeIn">
            <Profile
              profileData={profileData}
              refresh={refreshProfile}
              isLoading={FetchingProfile}
            />
          </div>
        )}
        {activeTab === "Uploads" && (
          <div className="animate-fadeIn ">
            <Mange_uploads resumeData={resumeData} refresh={refreshResumes} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
