import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <svg className="mx-auto mb-6 h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
      <p className="mb-8 text-xl text-gray-600">Oops! The page you’re looking for doesn’t exist.</p>

      <div className="space-y-4">
        <Link
          href="/"
          className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Go to Home
        </Link>
        <div className="text-gray-500">or</div>
        <Link
          href="/admin/dashboard"
          className="inline-block rounded-md bg-gray-200 px-6 py-3 text-gray-700 hover:bg-gray-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

