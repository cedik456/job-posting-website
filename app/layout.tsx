import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Posting Website",
  description: "A simple Next.js app connected to Neon with Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
