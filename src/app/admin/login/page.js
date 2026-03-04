"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getAuthSafe } from "@/lib/firebaseClient";
import { isAllowedAdmin, submitLoginRequest } from "@/lib/firestore";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError("");
    setPendingMessage("");
    setIsLoading(true);
    let signedInUid = null;
    let signedInEmail = null;
    let signedInDisplayName = null;

    try {
      const auth = getAuthSafe();
      if (!auth) {
        setError("Firebase is not available. Check your configuration.");
        return;
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName } = result.user;
      signedInUid = uid;
      signedInEmail = email || null;
      signedInDisplayName = displayName || null;

      const allowed = await isAllowedAdmin(uid);
      if (allowed) {
        const idToken = await result.user.getIdToken();
        if (typeof window !== "undefined") window.localStorage.setItem("authToken", idToken);
        router.replace("/admin/dashboard");
        return;
      }

      // Not allowed: record login request (so admin can approve) then show pending message
      await submitLoginRequest({ uid, email: signedInEmail, displayName: signedInDisplayName });
      await signOut(auth);
      if (typeof window !== "undefined") window.localStorage.removeItem("authToken");
      setPendingMessage(
        "Your request to access the admin area has been submitted. An existing admin must approve you before you can sign in. Please contact your admin or use the contact details on the main site."
      );
    } catch (err) {
      console.error("Google login error:", err);
      const isPermissionError =
        err?.code === "permission-denied" ||
        err?.message?.toLowerCase?.().includes("permission");
      if (isPermissionError && signedInUid) {
        // Still add them to login_requests so you can approve (user is still signed in until we signOut)
        try {
          await submitLoginRequest({
            uid: signedInUid,
            email: signedInEmail,
            displayName: signedInDisplayName,
          });
        } catch (e) {
          console.error("Could not record login request:", e);
        }
        try {
          const auth = getAuthSafe();
          if (auth) await signOut(auth);
          if (typeof window !== "undefined") window.localStorage.removeItem("authToken");
        } catch (_) {}
        setPendingMessage(
          "Your request to access the admin area has been submitted. An existing admin must approve you before you can sign in. Please contact your admin or use the contact details on the main site."
        );
      } else if (!isPermissionError) {
        setError(
          err?.message ||
            "Google sign-in failed. Please try again."
        );
      } else {
        setError("Access requires admin approval. Please contact your admin.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const panel = (
    <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <div className="px-6 py-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 dark:text-slate-100">
            {pendingMessage ? "Access pending" : "Admin login"}
          </h1>
          {pendingMessage ? (
            <>
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                {pendingMessage}
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-slate-400">
                You can try signing in again after an admin has approved your access.
              </p>
              <button
                type="button"
                onClick={() => setPendingMessage("")}
                className="mt-6 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <p className="mb-6 text-center text-sm text-gray-600 dark:text-slate-300">
                Sign in with your Google account to review, update, and export ad requests. Access must be approved by an existing admin.
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
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center">
      {panel}
    </div>
  );
}

