"use client";
import { useState, useCallback } from "react";
import { ResumeRecord } from "@/types/resume";
import { HardDriveUpload } from "lucide-react";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useResumeContext } from "@/contexts/ResumeContext";
import { supabase } from "@/app/utils/supabase/client";
import { toast } from "react-toastify";
import Modal from "./Modal";
import RolePickerModal from "./Uploadmodal";
import Skeleton from "react-loading-skeleton";

/**
 * Sidebar component for uploading and selecting resumes.
 *
 * Features:
 * - Uploads 1-page PDF or DOCX resume files (<1MB).
 * - Validates file type, extension, and MIME.
 * - Sends the resume to the backend API for analysis and refreshes resume list.
 * - Displays uploaded resumes and allows selection which tells MiddleBox wich resume data to dispaly.
 */

interface Rightbox_props {
  setSelectedResume: React.Dispatch<React.SetStateAction<ResumeRecord | null>>;
}
type Role = "Frontend Engineer" | "Backend Engineer" | "Full-Stack Engineer";
const MAX_FILE_SIZE_MB = 1;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const RightBar = ({ setSelectedResume }: Rightbox_props) => {
  const [open, setOpen] = useState(false);
  const { resumeData, refreshResumes, isLoadingResume } = useResumeContext();

  /**
   * Handles file input change. Validates file size, type, and MIME type.
   * Sends the resume to the backend API for analysis and refreshes resume list.
   */
  const handleUpload = useCallback(async ({
    role,
    file,
  }: { role: Role; file?: File | null }) => {
   
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
    formData.append("role", role);

    // keep the auth check exactly as you had it
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
      fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: { "x-user-id": user.id },
      }).then(async (res) => {
        await new Promise((r) => setTimeout(r, 200));
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
  }, [refreshResumes]);

  return (
    <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col space-y-2">
      {/* Upload */}
      <label
        onClick={() => setOpen(true)}
        className="w-full h-1/3 bg-[#f5f9fd] flex flex-col items-center justify-center rounded-lg space-y-2 cursor-pointer hover:bg-[#e8f1fb] transition"
      >
        <HardDriveUpload className="w-10 h-10 text-[#4382da]" />
        <span className="text-[#8ea6c4] font-bold text-lg">Upload File</span>
        <RolePickerModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUpload}
      />
        
      </label>

      {/* Uploaded Resumes */}
      <div className="flex-1 min-h-0 w-full bg-[#f5f9fd] rounded-lg flex flex-col">
        <div className="flex-shrink-0 flex gap-2 items-center justify-center py-4">
          <FolderIcon className="w-7 h-7 flex-shrink-0 text-[#4382da]" />
          <span className="text-[#8ea6c4] font-bold text-lg">Uploads</span>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2">
          {isLoadingResume ? (
            <div className="w-full h-full">
              <Skeleton height="100%" width="100%" borderRadius={8} />
            </div>
          ) : (
            <div>
              {resumeData.map((resume, index) => (
                <p
                  key={index}
                  onClick={() => setSelectedResume(resume)}
                  className="w-full text-center font-semibold text-lg  transition-colors hover:bg-[#e4ecf6] py-2 rounded cursor-pointer truncate px-2"
                  title={resume.resume_name}
                >
                  {resume.resume_name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
