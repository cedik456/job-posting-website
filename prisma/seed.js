const { PrismaClient, JobType, ApplicationStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "employer@hireboard.dev" },
      update: {
        name: "Cedric Employer",
        image: "https://i.pravatar.cc/150?img=12",
      },
      create: {
        name: "Cedric Employer",
        email: "employer@hireboard.dev",
        image: "https://i.pravatar.cc/150?img=12",
      },
    }),
    prisma.user.upsert({
      where: { email: "alice@applicant.dev" },
      update: {
        name: "Alice Applicant",
        image: "https://i.pravatar.cc/150?img=32",
      },
      create: {
        name: "Alice Applicant",
        email: "alice@applicant.dev",
        image: "https://i.pravatar.cc/150?img=32",
      },
    }),
    prisma.user.upsert({
      where: { email: "marco@candidate.dev" },
      update: {
        name: "Marco Candidate",
        image: "https://i.pravatar.cc/150?img=45",
      },
      create: {
        name: "Marco Candidate",
        email: "marco@candidate.dev",
        image: "https://i.pravatar.cc/150?img=45",
      },
    }),
  ]);

  const [employer, alice, marco] = users;

  await prisma.application.deleteMany();
  await prisma.job.deleteMany();

  const frontendJob = await prisma.job.create({
    data: {
      title: "Frontend Developer",
      company: "HireBoard",
      location: "Manila, Philippines",
      type: JobType.FULL_TIME,
      salary: "$2,000 - $3,000 / month",
      description:
        "Build polished user interfaces with Next.js, improve performance, and collaborate closely with design and product.",
      postedById: employer.id,
    },
  });

  const backendJob = await prisma.job.create({
    data: {
      title: "Backend Engineer",
      company: "HireBoard",
      location: "Remote",
      type: JobType.REMOTE,
      salary: "$2,500 - $4,000 / month",
      description:
        "Design APIs, own database changes with Prisma and Postgres, and ship reliable features across the hiring platform.",
      postedById: employer.id,
    },
  });

  const internJob = await prisma.job.create({
    data: {
      title: "Product Design Intern",
      company: "Studio North",
      location: "Cebu, Philippines",
      type: JobType.INTERNSHIP,
      salary: "$500 / month",
      description:
        "Support product design work, produce wireframes, and help maintain a consistent design system across the app.",
      postedById: employer.id,
    },
  });

  await prisma.application.createMany({
    data: [
      {
        jobId: frontendJob.id,
        userId: alice.id,
        status: ApplicationStatus.PENDING,
      },
      {
        jobId: backendJob.id,
        userId: marco.id,
        status: ApplicationStatus.REVIEWED,
      },
      {
        jobId: internJob.id,
        userId: alice.id,
        status: ApplicationStatus.ACCEPTED,
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`Users: ${users.length}`);
  console.log("Jobs: 3");
  console.log("Applications: 3");
}

main()
  .catch((error) => {
    console.error("Seed failed.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
