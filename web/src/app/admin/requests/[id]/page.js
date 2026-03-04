"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import RequireAuth from "@/components/RequireAuth";
import CustomDropdown from "@/components/CustomDropdown";
import { getRequestById, updateRequest } from "@/lib/firestore";
import { getAuthSafe } from "@/lib/firebaseClient";

function RequestDetailInner() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const statusOptions = useMemo(
    () => [
      { value: "pending", label: "Pending" },
      { value: "in-review", label: "In Review" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "completed", label: "Completed" },
    ],
    []
  );

  useEffect(() => {
    async function fetchRequestDetails() {
      if (!id) return;
      setLoading(true);
      setError("");

      try {
        const data = await getRequestById(id);
        setRequest(data);
        setStatus(data?.status ?? "");
      } catch (err) {
        setError(err?.message || "Failed to load request details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchRequestDetails();
  }, [id]);

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError("");

    try {
      const patch = { status };
      if (note.trim()) {
        const auth = getAuthSafe();
        const uid = auth?.currentUser?.uid ?? "unknown";
        patch.adminNotes = [
          ...(request?.adminNotes || []),
          { note: note.trim(), createdBy: uid, createdAt: new Date() },
        ];
      }
      const updated = await updateRequest(id, patch);
      setRequest(updated);
      setNote("");
      // eslint-disable-next-line no-alert
      alert("Request updated successfully");
    } catch (err) {
      setError(err?.message || "Failed to update request. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (s) => {
    switch (s) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const capitalize = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) {
      return (
        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }
    if (fileType?.includes("pdf")) {
      return (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    }
    return (
      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-white/20 dark:border-t-blue-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 rounded-md bg-yellow-100 p-4 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-200">
          Request not found.
        </div>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mr-4 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-white/10"
        >
          <svg className="h-5 w-5 text-gray-600 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Request details</h1>
          <p className="text-gray-600 dark:text-slate-300">ID: {request._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Request overview</h2>
            </div>
            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Status</p>
                  <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status === "in-review" ? "In Review" : capitalize(request.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Ad Type</p>
                  <p className="font-medium capitalize text-gray-900 dark:text-slate-100">{request.adType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Requested on</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{formatDate(request.requestDate)}</p>
                </div>
              </div>

              <div className="mb-4 border-t border-gray-200 pt-4 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-slate-300">Ad purpose</p>
                <p className="mt-1 text-gray-900 dark:text-slate-100">{request.adPurpose}</p>
              </div>

              {request.targetAudience && (
                <div className="mb-4 border-t border-gray-200 pt-4 dark:border-white/10">
                  <p className="text-sm text-gray-500 dark:text-slate-300">Target audience</p>
                  <p className="mt-1 text-gray-900 dark:text-slate-100">{request.targetAudience}</p>
                </div>
              )}

              {request.desiredPlacement && (
                <div className="mb-4 border-t border-gray-200 pt-4 dark:border-white/10">
                  <p className="text-sm text-gray-500 dark:text-slate-300">Desired placement</p>
                  <p className="mt-1 text-gray-900 dark:text-slate-100">{request.desiredPlacement}</p>
                </div>
              )}

              <div className="mb-4 border-t border-gray-200 pt-4 dark:border-white/10">
                <p className="text-sm text-gray-500 dark:text-slate-300">Desired completion</p>
                <p className="mt-1 font-medium text-gray-900 dark:text-slate-100">{formatDate(request.desiredCompletionDate)}</p>
              </div>

              {request.budget && (
                <div className="border-t border-gray-200 pt-4 dark:border-white/10">
                  <p className="text-sm text-gray-500 dark:text-slate-300">Budget</p>
                  <p className="mt-1 text-gray-900 dark:text-slate-100">${request.budget}</p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Requester</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Name</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{request.requesterName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Email</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{request.requesterEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-slate-300">Department</p>
                  <p className="font-medium text-gray-900 dark:text-slate-100">{request.requesterDepartment}</p>
                </div>
                {request.requesterPhone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-300">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{request.requesterPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(request.adTitle || request.adDescription || request.specialInstructions) && (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
                <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Content</h2>
              </div>
              <div className="p-6">
                {request.adTitle && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 dark:text-slate-300">Ad title / headline</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-slate-100">{request.adTitle}</p>
                  </div>
                )}
                {request.adDescription && (
                  <div className="mb-4 border-t border-gray-200 pt-4 dark:border-white/10">
                    <p className="text-sm text-gray-500 dark:text-slate-300">Ad description / body copy</p>
                    <p className="mt-1 whitespace-pre-line text-gray-900 dark:text-slate-100">{request.adDescription}</p>
                  </div>
                )}
                {request.specialInstructions && (
                  <div className="border-t border-gray-200 pt-4 dark:border-white/10">
                    <p className="text-sm text-gray-500 dark:text-slate-300">Special instructions</p>
                    <p className="mt-1 whitespace-pre-line text-gray-900 dark:text-slate-100">{request.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {request.files && request.files.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
                <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Attachments</h2>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-white/10">
                {request.files.map((file, index) => (
                  <li key={index} className="flex items-center p-4">
                    {getFileIcon(file.fileType)}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{file.originalName}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-300">
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {formatDate(file.uploadDate)}
                      </p>
                    </div>
                    <a
                      href={file.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-blue-100 px-3 py-1 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:bg-blue-500/20"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Update status</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateRequest}>
                <div className="mb-4">
                  <CustomDropdown
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="note" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                    Add note (optional)
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                    placeholder="Add a note about this update…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`w-full rounded-md px-4 py-2 text-white ${
                    updateLoading ? "cursor-not-allowed bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {updateLoading ? "Updating…" : "Update request"}
                </button>
              </form>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-white/10">
              <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">Admin notes</h2>
            </div>
            {request.adminNotes && request.adminNotes.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-white/10">
                {request.adminNotes.map((n, index) => (
                  <li key={index} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{n.createdBy?.name || "Admin"}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-300">{formatDate(n.createdAt)}</p>
                    </div>
                    <p className="mt-1 whitespace-pre-line text-sm text-gray-600 dark:text-slate-300">{n.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-slate-300">No notes added yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestDetailPage() {
  return (
    <RequireAuth>
      <RequestDetailInner />
    </RequireAuth>
  );
}

