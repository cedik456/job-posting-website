import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatJobType, formatPostedDate } from "../utils";
import ApplyButton from "./ApplyButton";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;
  const session = await auth();

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    include: { postedBy: true },
  });

  if (!job) {
    notFound();
  }

  const isOwner = session?.user?.id === job.postedById;

  return (
    <section className="space-y-6 text-white">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300/80 transition hover:text-cyan-200"
      >
        <span aria-hidden="true">←</span>
        <span>Back to jobs</span>
      </Link>

      <article className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-xl shadow-black/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
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

            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {job.title}
              </h1>
              <p className="text-base text-white/70">{job.company}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
              <span>{job.location}</span>
              <span className="text-white/25">•</span>
              <span>{formatJobType(job.type)}</span>
              {job.salary ? (
                <>
                  <span className="text-white/25">•</span>
                  <span>{job.salary}</span>
                </>
              ) : null}
            </div>

            <p className="text-sm text-white/45">
              Posted by {job.postedBy.name ?? "Unknown employer"} on{" "}
              {formatPostedDate(job.postedAt)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/65 shadow-lg shadow-black/10 lg:min-w-64">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
              Quick Snapshot
            </p>
            <dl className="mt-4 space-y-3">
              <div className="space-y-1">
                <dt className="text-white/40">Employer</dt>
                <dd className="text-white">
                  {job.postedBy.name ?? job.company}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-white/40">Posted</dt>
                <dd className="text-white">{formatPostedDate(job.postedAt)}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-white/40">Location</dt>
                <dd className="text-white">{job.location}</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Job Description
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/72 sm:text-base">
          {job.description}
        </p>
      </section>

      {isOwner ? (
        <section className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-6 shadow-xl shadow-black/10">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/80">
                Your Listing
              </p>
              <p className="mt-2 text-sm text-white/80">
                You posted this job, so applicants will apply here while you
                manage the listing details.
              </p>
            </div>

            <Link
              href={`/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
            >
              Edit Job
            </Link>
          </div>
        </section>
      ) : (
        <ApplyButton jobId={job.id} />
      )}
    </section>
  );
}
