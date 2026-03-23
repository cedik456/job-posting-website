import Link from "next/link";
import { GithubIcon } from "lucide-react";
import SignInButton from "@/components/auth/SignInButton";
import { login } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center py-40">
      <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-white shadow-lg">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Welcome to DayJobs
          </h1>
          <p className="text-sm leading-6 text-gray-300">
            Sign in to post jobs or apply for opportunities
          </p>
        </div>

        <SignInButton icon={GithubIcon} providerName="GitHub" action={login} />

        <p className="mt-8 text-center text-sm leading-6 text-gray-300">
          By signing in, you agree to our{" "}
          <Link
            href="#"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
