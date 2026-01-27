"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminArea = pathname?.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-2xl font-extrabold tracking-tight text-blue-600">
              Ad
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
              Amara
            </span>
          </Link>
          <span className="hidden text-sm text-gray-500 dark:text-slate-400 sm:inline-block">
            by Amaravati Communications Pvt. Ltd.
          </span>
        </div>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {!isAdminArea && (
            <>
              <Link
                href="/request"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Submit Request
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Contact
              </Link>
              <Link
                href="/admin/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Admin Login
              </Link>
            </>
          )}

          {isAdminArea && (
            <>
              <Link
                href="/admin/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Dashboard
              </Link>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
                onClick={() => {
                  clearAuthToken();
                  router.replace("/admin/login");
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

