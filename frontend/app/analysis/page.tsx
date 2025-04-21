"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeContext } from "@/contexts/ResumeContext";
import { useSession } from "@supabase/auth-helpers-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import EvaluationModal from "@/app/components/EvaluationModal";


/**
 * Displays a bar chart showing resume scores
 * for Big Tech readiness and resume formatting.
 */

const User_progress = () => {
  const { resumeData } = useResumeContext();

  const chartData = resumeData.map((resume, index) => ({
    name: resume.resume_name || `Resume ${index + 1}`,
    Bigtech_readiness:
      resume.openai_feedback?.feedback?.big_tech_readiness_score ?? 0,
    Resume_format: resume.openai_feedback?.feedback?.resume_format_score ?? 0,
  }));

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="bg-[#ebf2fc] h-full w-full p-4 flex flex-col items-center justify-center">
        <EvaluationModal/>
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Resume Progress
        </h2>
        <p className="text-gray-500">No resume data to display yet.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-[#ebf2fc] h-full w-full p-4 items-center justify-center flex flex-col">
      <EvaluationModal/>
      <h2 className="text-xl font-bold text-gray-700 mb-4">Resume Progress</h2>
      <div className="bg-white p-3 rounded-lg w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 10]}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="Bigtech_readiness" fill="#06367a" barSize={50} />
            <Bar dataKey="Resume_format" fill="#0fa37f" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default User_progress;
