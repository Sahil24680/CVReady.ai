import { useState, useRef, useEffect } from "react";
import { useResumeContext } from "@/contexts/ResumeContext";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/app/utils/supabase/client";
import { ResumeRecord } from "@/types/resume";
import { Divide } from "lucide-react";

/**
 * Component for managing uploaded resumes.
 *
 * Features:
 * - Displays resume list with edit and delete options
 * - Updates and removes resumes using Supabase
 * - Syncs with context to trigger refresh
 */

interface UploadProps {
  resumeData: ResumeRecord[];
  refresh: () => void;
}

const Mange_uploads = ({ resumeData, refresh }: UploadProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  //This cancels editing if user clicks outside inputbox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setEditingId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const Delete_resume = async (id: number) => {
    const response = await supabase.from("Resume_datas").delete().eq("id", id);
    refresh();
  };
  const Update_name = async (name: string, id: number) => {
    const { error } = await supabase
      .from("Resume_datas")
      .update({ Resume_name: name })
      .eq("id", id);
    if (error) {
      console.log("error:", error);
    } else {
      setEditingId(null);
      refresh();
    }
  };
  //if user presses enter after editing a resume name
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) => {
    if (e.key === "Enter") {
      Update_name(newName, id);
    }
  };

  return (
    <div className="w-full min-h-0 h-full ">
      <ul className="space-y-4 pr-2 overflow-y-auto pb-4 max-h-[300px] sm:max-h-[100px] md:max-h-[300px] lg:max-h-[400px] xl:max-h-[500px]">

        {resumeData !== null && resumeData.length > 0 ? (
          resumeData.map((resume, index) => (
            <li
              className="shadow-md rounded-lg p-4 border border-gray-200 flex justify-between items-center "
              key={index}
            >
              {editingId === resume.id ? (
                <input
                  ref={inputRef}
                  className="outline-none text-gray-800 font-medium"
                  placeholder={resume.resume_name}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, resume.id)}
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
                    setEditingId(resume.id);
                    setNewName(resume.resume_name);
                  }}
                >
                  <PencilIcon className="w-6 h-6" />
                </button>
                <button
                  className="text-[#e11d48] hover:text-rose-700 transition cursor-pointer"
                  onClick={() => {
                    Delete_resume(resume.id);
                  }}
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

export default Mange_uploads;
