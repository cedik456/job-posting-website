import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatJobType, formatPostedDate } from "../jobs/utils";

import React from "react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [applications, postedJobs] = await Promise.all([
    // Applications made by the user
    prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: {
          include: {
            postedBy: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    }),

    // Jobs posted by the user

    prisma.job.findMany({
      where: {
        postedById: session.user.id,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        postedAt: "desc",
      },
    }),
  ]);

  return (
    <section className="space-y-8 text-white">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/80">
          Dashboard
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Track the jobs you posted and the ones you applied for
            </h1>
            <p className="text-sm leading-6 text-white/65 sm:text-base">
              A simple overview of your active listings and recent applications,
              all in one place.
            </p>
          </div>

          <Link
            href="/jobs/post"
            className="inline-flex items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/30 hover:bg-cyan-400/15"
          >
            Post New Job
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Posted Jobs
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Listings you created and the number of applications they have.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
              {postedJobs.length} total
            </span>
          </div>

          {postedJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <p className="text-lg font-medium text-white">
                No posted jobs yet
              </p>
              <p className="mt-2 text-sm text-white/60">
                Create your first listing to start receiving applications.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {postedJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-xl shadow-black/10 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
                          {formatJobType(job.type)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
                          {job._count.applications} application
                          {job._count.applications === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-white">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-white/60">
                          {job.company} • {job.location}
                        </p>
                      </div>

                      <p className="text-sm text-white/45">
                        Posted {formatPostedDate(job.postedAt)}
                      </p>
                    </div>

                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      View Job
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Your Applications
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Jobs you recently applied to across the platform.
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
              {applications.length} total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <p className="text-lg font-medium text-white">
                No applications yet
              </p>
              <p className="mt-2 text-sm text-white/60">
                When you apply for jobs, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-xl shadow-black/10 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">
                          {formatJobType(application.job.type)}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65">
                          Applied {formatPostedDate(application.appliedAt)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-white">
                          {application.job.title}
                        </h3>
                        <p className="mt-1 text-sm text-white/60">
                          {application.job.company} • {application.job.location}
                        </p>
                      </div>

                      <p className="text-sm text-white/45">
                        Posted by{" "}
                        {application.job.postedBy.name ??
                          application.job.company}{" "}
                        on {formatPostedDate(application.job.postedAt)}
                      </p>
                    </div>

                    <Link
                      href={`/jobs/${application.job.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      View Job
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
