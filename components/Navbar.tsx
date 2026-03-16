import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 shadow-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Job Posting Website Logo"
                width={32}
                height={32}
                className="inline-block mr-2"
              />
              <span className="text-lg font-semibold text-white"> DayJobs</span>
            </Link>
          </div>

          <div className="space-x-4">
            <Link
              href="/jobs"
              className="text-white hover:text-white/80 text-sm "
            >
              Browse Jobs
            </Link>
            <Link
              href="/jobs/post"
              className="text-white hover:text-white/80 text-sm "
            >
              Post a Job
            </Link>
            <Link
              href="/dashboard"
              className="text-white hover:text-white/80 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/signin"
              className="text-white hover:text-white/80 text-sm font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
