import { render } from "@testing-library/react";
import WelcomeMessage from "@/app/components/WelcomeMessage";
import MiddleBox from "@/app/components/Middle_box";
import User_progress from "@/app/analysis/page";
import Setting from "@/app/user_settings/page";
import Mange_uploads from "@/app/user_settings/components/Mange_uploads";
import Profile from "@/app/user_settings/components/Profile";
import { ResumeProvider } from "@/contexts/ResumeContext";
//Smoke tests
const dummyResume = {
  id: 123,
  resume_name: "Resume 1",
  created_at: "2025-04-14",
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


describe("Componnents render wihtout crashing", () => {
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
        <User_progress />
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
        <Mange_uploads resumeData={[dummyResume]} refresh={() => {}}/>
      </ResumeProvider>
    );
  });

 



});
