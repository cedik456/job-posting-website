"use client";

import { useRouter } from "next/navigation";
import { jobTypes } from "./constants";
import { formatJobType } from "./utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type JobFiltersProps = {
  searchValue: string;
  jobTypeValue: string;
  locationValue: string;
};

export default function JobFilters({
  searchValue,
  jobTypeValue,
  locationValue,
}: JobFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchValue);

  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();

    router.replace(query ? `/jobs?${query}` : "/jobs");
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== searchValue) {
        updateFilter("search", searchInput.trim());
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchInput, searchValue]);

  return (
    <form className="rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50"
          >
            Search
          </label>
          <input
            id="search"
            name="search"
            type="text"
            value={searchInput}
            placeholder="Search job title, company, or keyword"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="jobType"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50"
          >
            Job Type
          </label>
          <div className="relative">
            <select
              id="jobType"
              name="jobType"
              defaultValue={jobTypeValue}
              onChange={(e) => updateFilter("jobType", e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 pr-12 text-base text-white focus:border-white/30 focus:outline-none sm:text-sm"
            >
              <option value="">All job types</option>
              {jobTypes.map((type) => (
                <option key={type} value={type} className="bg-gray-900">
                  {formatJobType(type)}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/50">
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
          <label
            htmlFor="location"
            className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Filter by location"
            defaultValue={locationValue}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none sm:text-sm"
          />
        </div>

        {/* <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90 lg:w-auto"
          >
            Search Jobs
          </button>
        </div> */}
      </div>
    </form>
  );
}
