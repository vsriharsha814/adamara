"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, authHeaders, clearAuthToken, getAuthToken } from "@/lib/api";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | authed | unauthed

  useEffect(() => {
    let mounted = true;

    async function check() {
      const token = getAuthToken();
      if (!token) {
        if (!mounted) return;
        setStatus("unauthed");
        router.replace("/admin/login");
        return;
      }

      try {
        await api.get("/auth/current", { headers: authHeaders() });
        if (!mounted) return;
        setStatus("authed");
      } catch {
        clearAuthToken();
        if (!mounted) return;
        setStatus("unauthed");
        router.replace("/admin/login");
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (status !== "authed") {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-gray-600">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          <span className="text-sm">Checking your session…</span>
        </div>
      </div>
    );
  }

  return children;
}

