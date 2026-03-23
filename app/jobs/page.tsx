import { JobType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

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

function formatPostedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="mx-auto max-w-6xl space-y-8 text-white">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/80">
          Opportunities
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Explore open roles built for your next move
            </h1>
            <p className="text-sm leading-6 text-white/65 sm:text-base">
              Browse available jobs, scan company details, and use the filters
              below as a clean starting point for your own search logic.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 shadow-lg shadow-black/10">
            <p className="text-sm text-white/60">Available jobs</p>
            <p className="mt-1 text-3xl font-semibold">{jobs.length}</p>
          </div>
        </div>
      </div>

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
              placeholder="Search job title, company, or keyword"
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
                defaultValue=""
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
              htmlFor="company"
              className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-white/50"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Filter by company"
              className="w-full rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 text-base text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none sm:text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90 lg:w-auto"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </form>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <p className="text-lg font-medium text-white">
            No jobs available yet
          </p>
          <p className="mt-2 text-sm text-white/60">
            Jobs will show up here once listings are added to the database.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-xl shadow-black/10 transition hover:border-white/20"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
                      {formatJobType(job.type)}
                    </span>
                    {job.salary ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
                        {job.salary}
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-white/72">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Posted {formatPostedDate(job.postedAt)}
                  </p>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
