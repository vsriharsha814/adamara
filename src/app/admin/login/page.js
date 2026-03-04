"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAuthSafe } from "@/lib/firebaseClient";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const auth = getAuthSafe();
      if (!auth) {
        setError("Firebase is not available. Check your configuration.");
        return;
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      if (typeof window !== "undefined") window.localStorage.setItem("authToken", idToken);
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError(
        err?.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <div className="px-6 py-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-slate-100">
            Admin login
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600 dark:text-slate-300">
            Sign in with your Google account to review, update, and export ad requests.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-white ${
              isLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Continue with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}

