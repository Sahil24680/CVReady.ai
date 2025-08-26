import { toast } from "react-toastify";
import { login, signup } from "@/app/utils/supabase/action";

describe("Auth Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows toast success on successful login", async () => {
    (login as jest.Mock).mockResolvedValue({ success: true });

    const formData = new FormData();
    formData.append("email", "test@example.com");
    formData.append("password", "lmao");

    const result = await login(formData);

    if (result.success) {
      toast.success("Login successful!");
    }

    expect(toast.success).toHaveBeenCalledWith("Login successful!");
  });

  it("shows toast error on failed signup", async () => {
    (signup as jest.Mock).mockResolvedValue({
      error: { message: "Email already exists" },
    });

    const formData = new FormData();
    formData.append("email", "existing@example.com");
    formData.append("password", "lol");

    const result = await signup(formData);

    if (result.error) {
      toast.error(result.error.message);
    }

    expect(toast.error).toHaveBeenCalledWith("Email already exists");
  });

  it("shows toast success on successful signup", async () => {
    (signup as jest.Mock).mockResolvedValue({ success: true });

    const formData = new FormData();
    formData.append("email", "new@example.com");
    formData.append("password", "newpass");

    const result = await signup(formData);

    if (result.success) {
      toast.success("Account created!");
    }

    expect(toast.success).toHaveBeenCalledWith("Account created!");
  });
});
