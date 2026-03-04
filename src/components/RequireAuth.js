"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getAuthSafe } from "@/lib/firebaseClient";
import { isAllowedAdmin } from "@/lib/firestore";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | authed | unauthed

  useEffect(() => {
    const auth = getAuthSafe();
    if (!auth) {
      setStatus("unauthed");
      router.replace("/admin/login");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (typeof window !== "undefined") window.localStorage.removeItem("authToken");
        setStatus("unauthed");
        router.replace("/admin/login");
        return;
      }
      const allowed = await isAllowedAdmin(user.uid);
      if (!allowed) {
        await signOut(auth);
        if (typeof window !== "undefined") window.localStorage.removeItem("authToken");
        setStatus("unauthed");
        router.replace("/admin/login");
        return;
      }
      user.getIdToken().then((token) => {
        if (typeof window !== "undefined") window.localStorage.setItem("authToken", token);
      });
      setStatus("authed");
    });

    return () => unsubscribe();
  }, [router]);

  if (status !== "authed") {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-gray-600 dark:text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <span className="text-sm">Checking your session…</span>
        </div>
      </div>
    );
  }

  return children;
}
