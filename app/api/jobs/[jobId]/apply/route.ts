import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth();

  if (!session?.user || !session.user.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const { jobId } = await params;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    if (job.postedById === session.user.id) {
      return new NextResponse("You cannot apply to your own job posting", {
        status: 400,
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return new NextResponse("You already applied for this job", {
        status: 400,
      });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        status: ApplicationStatus.PENDING,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
