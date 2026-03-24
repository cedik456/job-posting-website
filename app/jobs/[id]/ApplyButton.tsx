"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ApplyButton({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "error" | "success"
  >("idle");

  const handleApply = async () => {
    if (isSubmitting) {
      return;
    }

    if (!session) {
      router.push("/signin");
      return;
    }

    setErrorMessage("");
    setApplicationStatus("idle");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to submit your application. Please try again.");
      }

      setApplicationStatus("success");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setApplicationStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
        <button
          type="button"
          disabled
          className="w-full rounded-lg bg-white/80 px-5 py-3 text-sm font-medium text-gray-900/80"
        >
          Loading...
        </button>
      </section>
    );
  }

  if (applicationStatus === "success") {
    return (
      <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-xl shadow-black/10">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/80">
              Application Sent
            </p>
            <p className="mt-2 text-base text-white">
              Application submitted successfully.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
          >
            View your applications
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-xl shadow-black/10">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
            Ready to Apply?
          </p>
          <p className="mt-2 text-sm text-white/70">
            Submit your application for this role in one step.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApply}
          disabled={isSubmitting}
          className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/70 sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Apply for this position"}
        </button>

        {errorMessage ? (
          <p className="text-sm text-rose-200">{errorMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
