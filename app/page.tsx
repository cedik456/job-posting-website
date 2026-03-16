import { prisma } from "@/lib/prisma";

export default function Home() {
  const jobsPromise = prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <HomeContent jobsPromise={jobsPromise} />;
}

async function HomeContent({
  jobsPromise,
}: {
  jobsPromise: ReturnType<typeof prisma.job.findMany>;
}) {
  const jobs = await jobsPromise;

  return (
    <main className="flex min-h-screen flex-col  gap-8 max-w-7xl mx-auto px-4 py-16">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
          Next.js + Neon + Prisma
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your project is ready for a simple database setup.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-black/70 dark:text-white/70">
          This starter keeps things basic: one Prisma client, one Neon database,
          and a clean place to begin building your job posting app.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-lg font-semibold">What&apos;s included</h2>
          <ul className="mt-4 space-y-2 text-sm text-black/70 dark:text-white/70">
            <li>• Basic Prisma schema</li>
            <li>• Reusable Prisma client</li>
            <li>• Env file template for Neon</li>
            <li>• Simpler app layout without font build issues</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-900/60 dark:bg-blue-950/30">
          <h2 className="text-lg font-semibold">Next step</h2>
          <p className="mt-4 text-sm leading-6 text-black/70 dark:text-white/70">
            Add your Neon connection string to <strong>.env</strong>, then run
            your first Prisma migration.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Jobs in database</h2>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              This list is loaded directly from your Neon database.
            </p>
          </div>
          <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white dark:bg-white dark:text-black">
            {jobs.length}
          </span>
        </div>

        {jobs.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/70 dark:border-white/15 dark:text-white/70">
            No jobs yet. Your database connection is working, and you can start
            adding records next.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="rounded-xl border border-black/10 p-4 dark:border-white/10"
              >
                <p className="font-medium">{job.title}</p>
                <p className="mt-1 text-sm text-black/70 dark:text-white/70">
                  {job.company} · {job.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
