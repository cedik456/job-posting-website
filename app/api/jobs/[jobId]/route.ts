import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    const { jobId } = await params;
    const data = await request.json();

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { postedById: true },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    if (job.postedById !== session.user.id) {
      return new NextResponse("You are not allowed to edit this job", {
        status: 403,
      });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        salary: data.salary,
        description: data.description,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
