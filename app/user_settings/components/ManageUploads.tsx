import { useState, useRef, useEffect } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/app/utils/supabase/client";
import { ResumeRecord } from "@/types/resume";

/**
 * ManageUploads - Component for managing uploaded resumes.
 *
 * Features:
 * - Displays resume list with edit and delete options
 * - Updates and removes resumes using Supabase
 * - Syncs with context to trigger refresh after modifications
 */

interface ManageUploadsProps {
  resumeData: ResumeRecord[];
  refresh: () => void;
}

const ManageUploads = ({ resumeData, refresh }: ManageUploadsProps) => {
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null);
  const [updatedResumeName, setUpdatedResumeName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Cancel editing when user clicks outside the input field
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (renameInputRef.current && !renameInputRef.current.contains(event.target as Node)) {
        setEditingResumeId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Deletes a resume from the database by ID and refreshes the list
   */
  const deleteResume = async (resumeId: number) => {
    await supabase.from("Resume_datas").delete().eq("id", resumeId);
    refresh();
  };

  /**
   * Updates the resume name in the database and refreshes the list
   */
  const updateResumeName = async (newName: string, resumeId: number) => {
    const { error } = await supabase
      .from("Resume_datas")
      .update({ Resume_name: newName })
      .eq("id", resumeId);
    if (error) {
      console.error("Failed to update resume name:", error);
    } else {
      setEditingResumeId(null);
      refresh();
    }
  };

  // Submit rename on Enter key press
  const handleRenameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    resumeId: number
  ) => {
    if (event.key === "Enter") {
      updateResumeName(updatedResumeName, resumeId);
    }
  };

  return (
    <div className="w-full min-h-0 h-full">
      <ul className="space-y-4 pr-2 overflow-y-auto pb-4 max-h-[300px] sm:max-h-[100px] md:max-h-[300px] lg:max-h-[400px] xl:max-h-[500px]">
        {resumeData !== null && resumeData.length > 0 ? (
          resumeData.map((resume, index) => (
            <li
              className="shadow-md rounded-lg p-4 border border-gray-200 flex justify-between items-center"
              key={index}
            >
              {editingResumeId === resume.id ? (
                <input
                  ref={renameInputRef}
                  className="outline-none text-gray-800 font-medium"
                  placeholder={resume.resume_name}
                  onChange={(e) => setUpdatedResumeName(e.target.value)}
                  onKeyDown={(e) => handleRenameKeyDown(e, resume.id)}
                  autoFocus
                />
              ) : (
                <span className="text-gray-800 font-medium">
                  {resume.resume_name}
                </span>
              )}
              <div className="flex gap-3">
                <button
                  className="text-[#0b4c97] hover:text-[#093d7a] transition cursor-pointer"
                  onClick={() => {
                    setEditingResumeId(resume.id);
                    setUpdatedResumeName(resume.resume_name);
                  }}
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  className="text-[#e11d48] hover:text-rose-700 transition cursor-pointer"
                  onClick={() => deleteResume(resume.id)}
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="text-gray-700 font-semibold text-md flex justify-center">
            No uploads to display
          </div>
        )}
      </ul>
    </div>
  );
};

export default ManageUploads;
