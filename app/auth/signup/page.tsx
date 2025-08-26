'use client'
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { signup } from "@/app/utils/supabase/action"; 
import { useRouter } from "next/navigation";
import { toast} from "react-toastify";
export default function SignupPage() {
  const router = useRouter();

  const handSignup = async (formData: FormData) => {
    
    const result = await signup(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      toast.success("Account created!");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/auth/login");
    }
  };
  return (
    <div className="h-screen flex bg-[#EAF4FC]">
      {/* Signup UI */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        <div className="mt-6 sm:w-full sm:max-w-[480px] border border-blue-300 rounded-2xl">
          <div className="bg-white px-6 py-12 sm:rounded-2xl sm:px-12 shadow-lg ">
            <h2 className="text-3xl font-sans font-semibold text-center">
              Welcome
            </h2>
            <form action={handSignup }  className="mt-4 space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="p-2 border pl-10 border-gray-300 rounded-lg h-12 w-full"
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg h-12"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] rounded-lg text-white p-2 hover:bg-[#1A3DB6] cursor-pointer transition"
              >
                Register
              </button>
              {/* Divider for alternative sign-in */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              {/* Google button (if you plan to integrate) */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer transition"
              >
                <img src="/images/google.png" alt="Google Logo" className="h-5 w-5" />
                <span className="text-gray-600 font-medium">Google</span>
              </button>
            </form>
            <p className="mt-4 text-center text-sm font-semibold text-gray-600">
              Already a member?{" "}
              <a href="/auth/login" className="text-blue-500 hover:text-blue-700">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen pb-[8.5rem] flex items-end">
        <div className="w-full h-full bg-[url('/images/signup.jpg')] bg-no-repeat bg-contain bg-bottom mix-blend-multiply" />
      </div>
    </div>
  );
}
