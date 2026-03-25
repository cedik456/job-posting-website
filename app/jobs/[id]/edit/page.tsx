import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { JobType } from "@prisma/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    notFound();
  }

  if (job.postedById !== session.user.id) {
    redirect(`/jobs/${job.id}`);
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 text-white">
      <Link
        href={`/jobs/${job.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300/80 transition hover:text-cyan-200"
      >
        <span aria-hidden="true">←</span>
        <span>Back to job</span>
      </Link>

      <EditJobForm
        job={{
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary ?? "",
          description: job.description,
        }}
      />
    </section>
  );
}

function EditJobForm({
  job,
}: {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: JobType;
    salary: string;
    description: string;
  };
}) {
  return (
    <form
      action={async (formData) => {
        "use server";

        const session = await auth();

        if (!session?.user?.id) {
          redirect("/auth/signin");
        }

        const existingJob = await prisma.job.findUnique({
          where: { id: job.id },
          select: { postedById: true },
        });

        if (!existingJob) {
          notFound();
        }

        if (existingJob.postedById !== session.user.id) {
          redirect(`/jobs/${job.id}`);
        }

        await prisma.job.update({
          where: { id: job.id },
          data: {
            title: String(formData.get("title") ?? ""),
            company: String(formData.get("company") ?? ""),
            location: String(formData.get("location") ?? ""),
            type: formData.get("type") as JobType,
            salary: String(formData.get("salary") ?? "") || null,
            description: String(formData.get("description") ?? ""),
          },
        });

        redirect(`/jobs/${job.id}`);
      }}
      className="rounded-2xl border border-white/10 bg-gray-900 p-6 text-white shadow-sm"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Job</h1>
        <p className="mt-2 text-sm text-white/70">
          Update your listing details and save the changes when you are ready.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Job Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={job.title}
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
            defaultValue={job.company}
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
            defaultValue={job.location}
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
              defaultValue={job.type}
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-12 text-base text-white focus:border-white/30 focus:outline-none sm:text-sm"
            >
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
            defaultValue={job.salary}
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
            defaultValue={job.description}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
