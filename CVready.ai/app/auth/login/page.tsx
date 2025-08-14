"use client";
import { toast} from "react-toastify";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { login } from "@/app/utils/supabase/action"; 
import { useRouter } from "next/navigation";
import {checkProfileExists} from '@/app/utils/checkProfileExists'
export default function LoginPage() {

  const router = useRouter();
  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error.message);
    } else {
      await checkProfileExists();
      toast.success("Login successful!");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      router.push("/");
    }
  };
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-[#EAF4FC]">
      {/* Login UI */}
      <div className="w-full lg:w-1/2 flex justify-center items-center order-1 lg:order-none">
        <div className="mt-6 sm:w-full sm:max-w-[480px] border border-blue-300 rounded-2xl">
          <div className="bg-white px-6 py-12 sm:rounded-2xl sm:px-12 shadow-lg">
            <h2 className="text-3xl font-semibold text-center">Login</h2>

            <form action={handleLogin} className="mt-4 space-y-4">
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
                  className="p-2 pl-10 border border-gray-300 rounded-lg h-12 w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] rounded-lg text-white p-2 hover:bg-[#1A3DB6] cursor-pointer transition"
              >
                Login
              </button>
              {/* Divider for alternative auth methods */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 font-medium">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              {/* Google button (if you decide to implement) */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer transition"
              >
                <img
                  src="/images/google.png"
                  alt="Google Logo"
                  className="h-5 w-5"
                />
                <span className="text-gray-600 font-medium">Google</span>
              </button>
            </form>
            <p className="mt-4 text-center text-sm font-semibold text-gray-600">
              Not a member?{" "}
              <a
                href="/auth/signup"
                className="text-blue-500 hover:text-blue-700"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-screen bg-[url('/images/login.jpg')] bg-contain bg-bottom bg-no-repeat mix-blend-multiply order-2"></div>
    </div>
  );
}
