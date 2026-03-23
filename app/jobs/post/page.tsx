"use client";

import { JobType } from "@prisma/client";
import { FormEvent } from "react";

const jobTypes = [
  JobType.FULL_TIME,
  JobType.PART_TIME,
  JobType.CONTRACT,
  JobType.INTERNSHIP,
  JobType.REMOTE,
];

function formatJobType(type: JobType) {
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PostJobsPage() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      type: formData.get("type"),
      salary: formData.get("salary"),
      description: formData.get("description"),
    };

    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      window.location.href = "/jobs";
    } catch (error) {
      console.error("Error posting job: ", error);
    }
  };

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gray-900 p-6 text-white shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Post a Job</h1>
        <p className="mt-2 text-sm text-white/70">
          Simple boilerplate form based on your Prisma `Job` schema.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Frontend Developer"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="DayJobs"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-2 block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Manila, Philippines"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Job Type
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue=""
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-base text-white focus:border-white/30 focus:outline-none sm:text-sm"
            >
              <option value="" disabled>
                Select job type
              </option>
              {jobTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-900">
                  {formatJobType(type)}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="salary" className="mb-2 block text-sm font-medium">
            Salary
          </label>
          <input
            id="salary"
            name="salary"
            type="text"
            placeholder="$2,000 - $3,000 / month"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            placeholder="Describe the role, responsibilities, and requirements."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
        >
          Post Job
        </button>
      </form>
    </section>
  );
}
