"use client";
import { useState, useEffect } from "react";
import { ResumeRecord } from "@/types/resume";
import { HardDriveUpload } from "lucide-react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useResumeContext } from "@/contexts/ResumeContext";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

/**
 * Sidebar component for uploading and selecting resumes.
 *
 * Features:
 * - Uploads 1-page PDF or DOCX resume files (<1MB).
 * - Validates file type, extension, and MIME.
 * - Sends file to backend API for OpenAI resume analysis.
 * - Displays uploaded resumes and allows selection which tells MiddleBox wich resume data to dispaly.
 */

interface Rightbox_props {
  setSelectedResume: React.Dispatch<React.SetStateAction<ResumeRecord | null>>;
}
const MAX_FILE_SIZE_MB = 1;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const RightBar = ({ setSelectedResume }: Rightbox_props) => {
  const { resumeData, refreshResumes, FetchingResume } = useResumeContext();

  /**
   * Handles file input change. Validates file size, type, and MIME type.
   * Sends the resume to the backend API for analysis and refreshes resume list.
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File too large. Max allowed is 1MB.");
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(`.${ext}`)) {
      toast.error("Only PDF and DOCX files are allowed.");
      return;
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Upload a real PDF or DOCX.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(
        "❌ Failed to get user:",
        error?.message || "User not logged in"
      );
      return;
    }

    await toast.promise(
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload/`, {
        method: "POST",
        mode: "cors",
        body: formData,
        headers: {
          "x-user-id": user.id,
        },
      }).then(async (res) => {
        await new Promise((r) => setTimeout(r, 500));
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Upload failed.");
        }
        refreshResumes();
        return data;
      }),
      {
        pending: "Uploading your resume...",
        success: "Resume uploaded successfully!",
        error: {
          render({ data }) {
            const err = data as Error;
            return err?.message || "Upload failed.";
          },
        },
      }
    );
  };

  return (
    <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col items-center space-y-2">
      {/* Upload */}
      <label className="w-full h-1/3 bg-[#f5f9fd] flex flex-col items-center justify-center rounded-lg space-y-2 cursor-pointer hover:bg-[#e8f1fb] transition">
        <HardDriveUpload className="w-10 h-10 text-[#4382da]" />
        <span className="text-[#8ea6c4] font-bold text-lg">Upload File</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleUpload}
        />
      </label>

      {/* Uploaded Resumes */}
      <div className="flex-1 w-full  bg-[#f5f9fd] flex flex-col items-center rounded-lg space-y-2 overflow-y-auto pt-4">
        <div className="flex gap-2">
          <FolderIcon className="w-7 h-7 flex-shrink-0 text-[#4382da]" />
          <span className="text-[#8ea6c4] font-bold text-lg">Uploads</span>
        </div>

        {FetchingResume ? (
          <div className="w-full h-full">
            <Skeleton height="100%" width="100%" borderRadius={8} />
          </div>
        ) : (
          resumeData.map((resume, index) => (
            <p
              key={index}
              onClick={() => setSelectedResume(resume)}
              className="w-full text-center font-semibold text-lg bg-[#f5f9fd] transition-colors hover:bg-[#e4ecf6] py-1 rounded cursor-pointer truncate px-2"
              title={resume.resume_name}
            >
              {resume.resume_name}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default RightBar;
