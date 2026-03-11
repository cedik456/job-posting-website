import { PrismaClient } from "@prisma/client";

// Extend the global object type so we can cache Prisma in development.
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  // Reuse the existing client if hot reload already created one.
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  // Store the client globally during development to avoid duplicate instances.
  globalForPrisma.prisma = prisma;
}

// import Prisma so your app can talk to the database
// reuse one Prisma client instead of creating a new one every reload
// save that client globally in development to avoid duplicate connections
