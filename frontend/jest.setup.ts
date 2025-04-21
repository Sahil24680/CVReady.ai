import "@testing-library/jest-dom";

// Mock Supabase functions
jest.mock("@/app/utils/supabase/action", () => ({
    login: jest.fn(),
    signup: jest.fn(),
  }));

  
// Mocking react-toastify to track whether toast.error, toast.success, etc. were called
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    promise: jest.fn(),
  },
}));

// Mocking Supabase client module so no real API calls happen during the test
jest.mock("@/app/utils/supabase/client", () => ({
  supabase: {
    // auth.getUser fakes a user being logged in
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: "mock-user-id", email: "test@example.com" } },
        error: null,
      }),
      // auth.getSession also fakes logged-in user (used by context)
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: { user: { id: "mock-user-id", email: "test@example.com" } },
        },
        error: null,
      }),
    },
    // from() is used to fetch stuff from Supabase – it fakes all the .select(), .eq(), etc. so they don’t break
      from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }), // fakes success
    }),
  },
}));
