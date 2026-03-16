import Link from "next/link";
import { GithubIcon } from "lucide-react";

const providers = [
  {
    name: "Google",
    icon: GoogleIcon,
  },
  {
    name: "GitHub",
    icon: GithubIcon,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
  },
] as const;

export default function SignInCard() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 text-white shadow-lg">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Welcome to DayJobs
        </h1>
        <p className="text-sm leading-6 text-gray-300">
          Sign in to post jobs or apply for opportunities
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {providers.map((provider) => {
          const Icon = provider.icon;

          return (
            <button
              key={provider.name}
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-600 bg-gray-900 px-4 py-3.5 text-sm font-medium text-gray-100 transition hover:bg-gray-950"
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Continue with {provider.name}</span>
            </button>
          );
        })}
      </div>

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
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M21.805 12.23c0-.75-.067-1.47-.192-2.16H12v4.09h5.498a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.047-4.41 3.047-7.57Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.074-.91 6.765-2.47l-3.3-2.56c-.91.61-2.076.97-3.465.97-2.66 0-4.91-1.8-5.715-4.22H2.88v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.285 13.72A6 6 0 0 1 5.965 12c0-.6.11-1.18.32-1.72V7.64H2.88A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.36l3.235-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.06c1.5 0 2.84.52 3.9 1.53l2.93-2.93C17.07 3.03 14.76 2 12 2A10 10 0 0 0 2.88 7.64l3.405 2.64C7.09 7.86 9.34 6.06 12 6.06Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.5 9.75h2.88V18H5.5V9.75Zm4.68 0h2.76v1.13h.04c.39-.73 1.33-1.5 2.74-1.5 2.93 0 3.47 1.93 3.47 4.43V18h-2.88v-3.69c0-.88-.02-2.02-1.23-2.02-1.23 0-1.42.96-1.42 1.96V18h-2.88V9.75Z" />
    </svg>
  );
}
