import { JobType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import JobFilters from "@/app/jobs/JobFilters";
import { jobTypes } from "./constants";
import { formatJobType, formatPostedDate } from "./utils";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string | string[];
    jobType?: string | string[];
    location?: string | string[];
  }>;
}) {
  const { search, jobType, location } = await searchParams;
  const searchValue = typeof search === "string" ? search.trim() : "";
  const jobTypeValue = typeof jobType === "string" ? jobType : "";
  const locationValue = typeof location === "string" ? location.trim() : "";

  const filters: Prisma.JobWhereInput[] = [
    {
      postedAt: {
        lte: new Date(),
      },
    },
  ];

  if (searchValue) {
    filters.push({
      OR: [
        {
          title: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchValue,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (jobTypeValue && jobTypes.includes(jobTypeValue as JobType)) {
    filters.push({
      type: jobTypeValue as JobType,
    });
  }

  if (locationValue) {
    filters.push({
      location: {
        contains: locationValue,
        mode: "insensitive",
      },
    });
  }

  const jobs = await prisma.job.findMany({
    where: {
      AND: filters,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      postedBy: true,
    },
  });

  return (
    <section className="space-y-8 text-white">
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

      <JobFilters
        searchValue={searchValue}
        jobTypeValue={jobTypeValue}
        locationValue={locationValue}
      />

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

                  <p className="mt-1 text-sm text-white/45">
                    Posted by {job.postedBy.name ?? "Unknown employer"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:self-stretch lg:items-end lg:justify-between">
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
