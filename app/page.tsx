"use client";
import { supabase } from "@/app/utils/supabase/client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MiddleBox from "@/app/components/MiddleBox";
import RightBar from "@/app/components/RightBar";
import { ResumeRecord } from "@/types/resume";
import EvaluationModal from "@/app/components/EvaluationModal";

/**
 * Main home page layout after login.
 *
 * Features:
 * - Checks user authentication using Supabase
 * - Renders main content area (MiddleBox) and resume selector (RightBar)
 * - Manages selected resume state shared between components
 */

export default function Home_page() {
  const router = useRouter();
  const [selectedResume, setSelectedResume] = useState<ResumeRecord | null>(
    null
  );

  return (
    <div className="h-screen bg-[#ebf2fc]">
      <div className="flex h-full min-h-0">
        <EvaluationModal />
        {/* Center box */}
        <div className=" w-full  md:w-4/5 p-6 bg-[#ebf2fc] ">
          <MiddleBox
            selectedResume={selectedResume}
            setSelectedResume={setSelectedResume}
          />
        </div>

        {/* Right side bar */}
        <div className="w-full md:w-1/5 p-2 py-10 bg-[#ebf2fc] pb-4 h-full min-h-0">
          <RightBar setSelectedResume={setSelectedResume} />
        </div>
      </div>
    </div>
  );
}
