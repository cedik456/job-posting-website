import { JobType } from "@prisma/client";

export const jobTypes = [
  JobType.FULL_TIME,
  JobType.PART_TIME,
  JobType.CONTRACT,
  JobType.INTERNSHIP,
  JobType.REMOTE,
];
