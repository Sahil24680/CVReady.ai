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

// Fake profile data passed into the component to simulate a logged-in user
const dummyProfile = {
  id: 1,
  first_name: "hello",
  last_name: "goodbye",
  profile_picture: "totally a profile picture",
};

describe("Profile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <ResumeProvider>
          <Profile
            profileData={dummyProfile}
            refresh={() => {}}
            isLoading={false}
          />
        </ResumeProvider>
      );
    });
  });

  // Test the edge case: uploading a file larger than 5MB triggers an error
  it("shows error when uploading file > 5MB", async () => {
    // Create a fake 6MB file
    const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });

    // Mount the component
    await act(async () => {
      render(
        <ResumeProvider>
          <Profile
            profileData={dummyProfile}
            refresh={() => {}}
            isLoading={false}
          />
        </ResumeProvider>
      );
    });
    const fileInput = screen.getByTestId("upload-pfp");

    // Simulate file change (user uploads a file)
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
    });

    // This verifies the error msg was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "File is too large. Max size is 5MB."
      );
    });
  });
});
