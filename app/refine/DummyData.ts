import { Suggestion } from "@/types/resume";

export const dummySuggestions: Suggestion[] = [
    {
      id: "1",
      title: "Improve Technical Skills Section",
      summary: "Add more specific technologies and frameworks",
      explanation:
        "Your technical skills section could benefit from more detailed descriptions of your experience with specific frameworks like React, Node.js, and cloud platforms. This will help recruiters quickly identify your technical capabilities.",
      impact: "High",
      status: "pending",
    },
    {
      id: "2",
      title: "Quantify Your Achievements",
      summary: "Add measurable results to work experience",
      explanation:
        'Consider adding specific metrics and numbers to demonstrate the impact of your work. For example, "Increased system performance by 40%" or "Managed a team of 8 developers".',
      impact: "High",
      status: "accepted",
    },
    {
      id: "3",
      title: "Optimize for ATS Systems",
      summary: "Improve keyword density for better parsing",
      explanation:
        "Your resume would benefit from better keyword optimization to improve ATS (Applicant Tracking System) compatibility. Consider including more industry-specific terms.",
      impact: "Medium",
      status: "pending",
    },
    {
      id: "4",
      title: "Update Contact Information",
      summary: "Consider adding LinkedIn profile",
      explanation:
        "Adding your LinkedIn profile URL can provide recruiters with additional context about your professional network and endorsements.",
      impact: "Low",
      status: "rejected",
    },
  ];