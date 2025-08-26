import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Profile from "@/app/user_settings/components/Profile";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { toast } from "react-toastify";
import RightBar from "@/app/components/Right_bar";

describe("RightBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders without crashing", () => {
    render(
      <ResumeProvider>
        <RightBar setSelectedResume={() => {}} />
      </ResumeProvider>
    );
  });

  it("shows error if no file is selected", async () => {
    await act(async () => {
      render(
        <ResumeProvider>
          <RightBar setSelectedResume={() => {}} />
        </ResumeProvider>
      );
    });
    const fileInput = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInput, { target: { files: [] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please select a file to upload."
      );
    });
  });

  it("shows error for file too large (>1MB)", async () => {
    const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "resume.pdf", {
      type: "application/pdf",
    });

    render(
      <ResumeProvider>
        <RightBar setSelectedResume={() => {}} />
      </ResumeProvider>
    );

    const fileInput = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "File too large. Max allowed is 1MB."
      );
    });
  });

  it("shows error for invalid extension", async () => {
    const badExtFile = new File(["content"], "resume.txt", {
      type: "application/pdf",
    });

    render(
      <ResumeProvider>
        <RightBar setSelectedResume={() => {}} />
      </ResumeProvider>
    );

    const fileInput = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInput, { target: { files: [badExtFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Only PDF and DOCX files are allowed."
      );
    });
  });

  it("shows error for invalid MIME type", async () => {
    const badMimeFile = new File(["data"], "resume.pdf", {
      type: "text/plain", // wrong MIME
    });

    render(
      <ResumeProvider>
        <RightBar setSelectedResume={() => {}} />
      </ResumeProvider>
    );

    const fileInput = screen.getByLabelText(/upload file/i);
    fireEvent.change(fileInput, { target: { files: [badMimeFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid file type. Upload a real PDF or DOCX."
      );
    });
  });
});
