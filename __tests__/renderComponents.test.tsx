import { render } from "@testing-library/react";
import WelcomeMessage from "@/app/components/WelcomeMessage";
import MiddleBox from "@/app/components/MiddleBox";
import UserProgress from "@/app/analysis/page";
import Setting from "@/app/user_settings/page";
import ManageUploads from "@/app/user_settings/components/ManageUploads";
import Profile from "@/app/user_settings/components/Profile";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ResumeRecord } from "@/types/resume";

/**
 * Smoke tests - verify components render without crashing
 */
const dummyResume: ResumeRecord = {
  id: 123,
  resume_name: "Resume 1",
  created_at: "2025-04-14",
  Role: "Frontend Engineer",
  openai_feedback: {
    feedback: {
      big_tech_readiness_score: 7,
      resume_format_score: 8,
      strengths: ["Great formatting"],
      weaknesses: ["Lack of metrics"],
      tips: ["Add more impact verbs"],
      motivation: "You're on the right track!",
    },
  },
};


describe("Components render without crashing", () => {
  it("renders without crashing", () => {
    render(<WelcomeMessage />);
  });
  it("renders without crashing", () => {
    render(
      <ResumeProvider>
        <MiddleBox selectedResume={dummyResume} setSelectedResume={() => {}} />
      </ResumeProvider>
    );
  });

  

  it("renders without crashing", () => {
    render(
      <ResumeProvider>
        <UserProgress />
      </ResumeProvider>
    );
  });

  it("renders without crashing", () => {
    render(
      <ResumeProvider>
        <Setting />
      </ResumeProvider>
    );
  });


  it("renders without crashing", () => {
    render(
      <ResumeProvider>
        <ManageUploads resumeData={[dummyResume]} refresh={() => {}}/>
      </ResumeProvider>
    );
  });

 



});
