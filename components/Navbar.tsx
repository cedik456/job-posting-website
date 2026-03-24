"use client";

import { logout } from "@/lib/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const navItems = [
    { href: "/jobs", label: "Browse Jobs" },
    ...(session
      ? [
          { href: "/jobs/post", label: "Post a Job" },
          { href: "/dashboard", label: "Dashboard" },
        ]
      : [{ href: "/auth/signin", label: "Sign In" }]),
  ];

  return (
    <nav className="relative bg-gray-900 shadow-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div>
            <Link href="/" className="flex items-center" onClick={closeMenu}>
              <Image
                src="/logo.png"
                alt="Job Posting Website Logo"
                width={32}
                height={32}
                className="inline-block mr-2"
              />
              <span className="text-lg font-semibold text-white"> DayJobs</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white transition-colors duration-200 hover:text-white/80"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-white transition-colors duration-200 hover:text-white/80"
                >
                  Sign Out
                </button>
              </>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 text-white transition-colors duration-200 hover:bg-gray-800 md:hidden"
          >
            <span className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-1 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-2.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "top-2.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-full z-50 md:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-4 border-t border-gray-800 bg-gray-900 px-4 py-5 shadow-lg transition-all duration-300 ease-out ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
            >
              {item.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => {
                closeMenu();
                logout();
              }}
              className="w-fit text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
            >
              Sign Out
            </button>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
