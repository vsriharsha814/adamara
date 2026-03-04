"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { listRequests, listAllRequests, listLoginRequests, approveAdmin, setLoginRequestMakeAdmin } from "@/lib/firestore";

function DashboardInner() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingLogins, setPendingLogins] = useState([]);
  const [pendingLoginsLoading, setPendingLoginsLoading] = useState(true);
  const [approvingUid, setApprovingUid] = useState(null);
  const [makingAdminUid, setMakingAdminUid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    department: "",
    startDate: "",
    endDate: "",
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await listRequests({
        page: currentPage,
        pageSize: 10,
        status: filters.status || undefined,
        search: filters.search || undefined,
        department: filters.department || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });
      setRequests(result.items || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
      department: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const changePage = (page) => setCurrentPage(page);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const exportToCsv = async () => {
    try {
      const items = await listAllRequests({
        status: filters.status || undefined,
        search: filters.search || undefined,
        department: filters.department || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });
      const header = "ID,Requester Name,Email,Department,Ad Type,Status,Request Date,Completion Date\n";
      const rows = items.map((r) => {
        const reqDate = r.requestDate ? new Date(r.requestDate).toISOString() : "";
        const compDate = r.desiredCompletionDate ? new Date(r.desiredCompletionDate).toISOString() : "";
        return `${r._id},${r.requesterName},${r.requesterEmail},${r.requesterDepartment},${r.adType},${r.status},${reqDate},${compDate}`;
      });
      const csv = header + rows.join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ad-requests-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch {
      setError("Failed to export data. Please try again.");
    }
  };

  const fetchPendingLogins = useCallback(async () => {
    setPendingLoginsLoading(true);
    try {
      const list = await listLoginRequests();
      setPendingLogins(list);
    } catch {
      setPendingLogins([]);
    } finally {
      setPendingLoginsLoading(false);
    }
  }, []);

  const handleApprove = async (item) => {
    setApprovingUid(item.uid);
    try {
      await approveAdmin({
        uid: item.uid,
        email: item.email,
        displayName: item.displayName,
      });
      await fetchPendingLogins();
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setApprovingUid(null);
    }
  };

  const handleMakeAdmin = async (item) => {
    if (item.makeAdmin) return;
    setMakingAdminUid(item.uid);
    try {
      await setLoginRequestMakeAdmin(item.uid);
      await new Promise((r) => setTimeout(r, 1500));
      await fetchPendingLogins();
    } catch (err) {
      console.error("Make admin failed:", err);
    } finally {
      setMakingAdminUid(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    fetchPendingLogins();
  }, [fetchPendingLogins]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Ad requests</h1>
        <p className="text-gray-600 dark:text-slate-300">
          Review, update status, and export results.
        </p>
      </div>

      {pendingLogins.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-400/30 dark:bg-amber-500/10">
          <h2 className="mb-3 text-lg font-medium text-amber-900 dark:text-amber-200">
            Pending access requests
          </h2>
          <p className="mb-3 text-sm text-amber-800 dark:text-amber-100/80">
            Check <strong>Make admin</strong> to set the flag; when they sign in again they get admin access. Or use <strong>Approve</strong> to add them immediately. You can also set <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-500/20">makeAdmin: true</code> on the doc in Firestore Console.
          </p>
          {pendingLoginsLoading ? (
            <p className="text-sm text-amber-700 dark:text-amber-200/80">Loading…</p>
          ) : (
            <ul className="space-y-2">
              {pendingLogins.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/60 py-2 px-3 dark:bg-black/20"
                >
                  <span className="text-sm text-gray-900 dark:text-slate-100">
                    {item.displayName || item.email || item.uid}
                    {item.email && item.displayName !== item.email && (
                      <span className="text-gray-600 dark:text-slate-400"> ({item.email})</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={item.makeAdmin}
                        onChange={() => handleMakeAdmin(item)}
                        disabled={makingAdminUid === item.uid || item.makeAdmin}
                        className="rounded border-gray-300"
                      />
                      Make admin
                    </label>
                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      disabled={approvingUid === item.uid}
                      className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                      {approvingUid === item.uid ? "Approving…" : "Approve"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-slate-100">Filters</h2>
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                placeholder="Name or email"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="department"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Personal Ad">Personal Ad</option>
                <option value="Obituary">Obituary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                From date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
                To date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-white/15 dark:bg-white/5 dark:text-slate-100"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Reset
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={exportToCsv}
                className="rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:bg-blue-500/20"
              >
                Export CSV
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-white/20 dark:border-t-blue-400" />
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-slate-300">
            No requests found. Try adjusting your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ad Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-white/10 dark:bg-transparent">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-slate-100">
                        {request.requesterName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-slate-300">
                        {request.requesterEmail}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                      {request.requesterDepartment}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-gray-500 dark:text-slate-300">
                      {request.adType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status === "in-review"
                          ? "In Review"
                          : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-300">
                      {formatDate(request.desiredCompletionDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/admin/requests/${request._id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 dark:border-white/10">
            <p className="text-sm text-gray-700 dark:text-slate-200">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`rounded border px-3 py-1 ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-slate-500"
                    : "bg-white text-blue-600 hover:bg-blue-50 dark:bg-transparent dark:text-blue-300 dark:hover:bg-white/5"
                }`}
              >
                Previous
              </button>

              {[...Array(totalPages).keys()]
                .map((page) => page + 1)
                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                .map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => changePage(pageNum)}
                    className={`rounded border px-3 py-1 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50 dark:bg-transparent dark:text-blue-300 dark:hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

              <button
                onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`rounded border px-3 py-1 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-slate-500"
                    : "bg-white text-blue-600 hover:bg-blue-50 dark:bg-transparent dark:text-blue-300 dark:hover:bg-white/5"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}

