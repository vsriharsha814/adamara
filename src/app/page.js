import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-stretch gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
            Simple, guided ad requests
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100 sm:text-5xl">
            A clearer way to request ads that actually ship.
          </h1>
          <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-slate-300">
            AdAmara helps teams submit complete ad requests with the right
            details, timelines, and files — so the creative process stays fast
            and organized.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/request"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Start an Ad Request
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
            >
              Contact the Team
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Guided steps</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                Clear sections so users don’t miss details.
              </p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Structured inputs</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                Capture timelines, audiences, and requirements in one place.
              </p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Admin review</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                Track status and notes from a dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-full">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-blue-200/50 via-indigo-200/40 to-cyan-200/40 blur-2xl dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-cyan-500/15" />
          <div className="flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
              What you’ll submit
            </p>
            <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-slate-200">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                  1
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">Requester info</p>
                  <p className="text-gray-600 dark:text-slate-300">
                    Name, email, department, phone.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                  2
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">Ad details</p>
                  <p className="text-gray-600 dark:text-slate-300">
                    Type, purpose, audience, placement, budget.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                  3
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100">Timeline + assets</p>
                  <p className="text-gray-600 dark:text-slate-300">
                    Due date, copy, instructions, and attachments.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/30 dark:bg-amber-500/10">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Tip for fast approvals
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-100/80">
                Include key brand guidelines and a clear call-to-action in your request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
