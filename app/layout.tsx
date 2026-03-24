import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Job Posting Website",
  description: "A simple Next.js app connected to Neon with Prisma.",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-900">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
