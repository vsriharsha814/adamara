"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreSafe } from "@/lib/firebaseClient";

const REQUESTS = "requests";
const ALLOWED_ADMINS = "allowed_admins";
const LOGIN_REQUESTS = "login_requests";

function firestore() {
  const db = getFirestoreSafe();
  if (!db) throw new Error("Firestore not available");
  return db;
}

const REQUESTS_PLACEHOLDER_ID = "_init";

/** Convert Firestore doc to plain object with id and date fields. Returns null for placeholder doc. */
function docToRequest(docSnap) {
  if (!docSnap?.exists?.()) return null;
  const d = docSnap.data();
  const id = docSnap.id;
  if (id === REQUESTS_PLACEHOLDER_ID || d._placeholder) return null;
  const toDate = (v) => (v?.toDate ? v.toDate() : v);
  return {
    _id: id,
    id,
    requesterName: d.requesterName,
    requesterEmail: d.requesterEmail,
    requesterDepartment: d.requesterDepartment,
    requesterPhone: d.requesterPhone,
    adType: d.adType,
    adPurpose: d.adPurpose,
    targetAudience: d.targetAudience,
    desiredPlacement: d.desiredPlacement,
    budget: d.budget,
    requestDate: toDate(d.requestDate),
    desiredCompletionDate: toDate(d.desiredCompletionDate),
    adTitle: d.adTitle,
    adDescription: d.adDescription,
    specialInstructions: d.specialInstructions,
    images: Array.isArray(d.images) ? d.images : [],
    status: d.status || "pending",
    assignedTo: d.assignedTo ?? null,
    adminNotes: Array.isArray(d.adminNotes) ? d.adminNotes : [],
    lastUpdated: toDate(d.lastUpdated),
  };
}

/** Create a new ad request (public form). */
export async function createRequest(payload) {
  const db = firestore();
  const col = collection(db, REQUESTS);
  const requestId = doc(col).id;

  const data = {
    ...payload,
    desiredCompletionDate: payload.desiredCompletionDate
      ? (payload.desiredCompletionDate instanceof Date
          ? payload.desiredCompletionDate
          : new Date(payload.desiredCompletionDate))
      : null,
    requestDate: serverTimestamp(),
    lastUpdated: serverTimestamp(),
    status: "pending",
  };
  await setDoc(doc(db, REQUESTS, requestId), data);
  return requestId;
}

/** Get a single request by id */
export async function getRequestById(id) {
  if (id === REQUESTS_PLACEHOLDER_ID) return null;
  const db = firestore();
  const snap = await getDoc(doc(db, REQUESTS, id));
  return docToRequest(snap);
}

/** Ensure the requests collection exists in Firestore (so it appears in Console). Called once when admin lists. */
let _requestsCollectionEnsured = false;
async function ensureRequestsCollectionExists() {
  if (_requestsCollectionEnsured) return;
  const db = firestore();
  const snap = await getDocs(query(collection(db, REQUESTS), limit(1)));
  if (snap.empty) {
    await setDoc(doc(db, REQUESTS, REQUESTS_PLACEHOLDER_ID), {
      _placeholder: true,
      _createdAt: serverTimestamp(),
    });
  }
  _requestsCollectionEnsured = true;
}

/** List requests with filters and pagination (filters applied in memory to avoid composite indexes) */
export async function listRequests({
  status,
  department,
  startDate,
  endDate,
  search,
  page = 1,
  pageSize = 10,
  sortField = "requestDate",
  sortOrder = "desc",
}) {
  await ensureRequestsCollectionExists();
  const db = firestore();
  const q = query(
    collection(db, REQUESTS),
    orderBy("requestDate", "desc"),
    limit(Math.min(2000, Math.max(50, pageSize * (page + 2))))
  );
  const snapshot = await getDocs(q);
  let items = snapshot.docs
    .filter((d) => d.id !== REQUESTS_PLACEHOLDER_ID && !d.data()._placeholder)
    .map((d) => docToRequest(d))
    .filter(Boolean);

  if (status) items = items.filter((r) => r.status === status);
  if (department) items = items.filter((r) => r.requesterDepartment === department);
  if (startDate) {
    const t = new Date(startDate).getTime();
    items = items.filter((r) => r.requestDate && new Date(r.requestDate).getTime() >= t);
  }
  if (endDate) {
    const t = new Date(endDate).getTime();
    items = items.filter((r) => r.requestDate && new Date(r.requestDate).getTime() <= t);
  }
  if (search?.trim()) {
    const s = search.trim().toLowerCase();
    items = items.filter(
      (r) =>
        String(r.requesterName || "").toLowerCase().includes(s) ||
        String(r.requesterEmail || "").toLowerCase().includes(s)
    );
  }

  if (sortField !== "requestDate" || sortOrder === "asc") {
    items.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }

  const totalCount = items.length;
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);
  return {
    items: paginated,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
    currentPage: page,
  };
}

/** List all requests (for export CSV); filters in memory, up to 2000 */
export async function listAllRequests({ status, startDate, endDate, search, department } = {}) {
  const { items } = await listRequests({
    status,
    startDate,
    endDate,
    search,
    department,
    page: 1,
    pageSize: 2000,
  });
  return items;
}

/** Update request (status, adminNotes, assignedTo) */
export async function updateRequest(id, patch) {
  const db = firestore();
  const docRef = doc(db, REQUESTS, id);
  const update = {
    ...patch,
    lastUpdated: serverTimestamp(),
  };
  if (patch.adminNotes && Array.isArray(patch.adminNotes)) {
    update.adminNotes = patch.adminNotes.map((n) => ({
      ...n,
      createdAt: n.createdAt instanceof Date ? n.createdAt : new Date(),
    }));
  }
  await updateDoc(docRef, update);
  const snap = await getDoc(docRef);
  return docToRequest(snap);
}

// --- Admin allowlist (login approval) ---

/** Check if the current user's UID is in allowed_admins. Call with uid from Firebase Auth. */
export async function isAllowedAdmin(uid) {
  if (!uid) return false;
  const db = firestore();
  const snap = await getDoc(doc(db, ALLOWED_ADMINS, uid));
  return snap.exists();
}

/** Submit or update a login request (for unapproved users). Doc id = uid. Uses only create/update (no read) so it works without read permission. */
export async function submitLoginRequest({ uid, email, displayName }) {
  const db = firestore();
  const ref = doc(db, LOGIN_REQUESTS, uid);
  await setDoc(
    ref,
    {
      uid,
      email: email || null,
      displayName: displayName || null,
      requestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** List pending login requests (only allowed admins can call). */
export async function listLoginRequests() {
  const db = firestore();
  const q = query(
    collection(db, LOGIN_REQUESTS),
    orderBy("updatedAt", "desc"),
    limit(100)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      makeAdmin: data.makeAdmin === true,
      requestedAt: data.requestedAt?.toDate?.()?.toISOString?.() ?? data.requestedAt,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? data.updatedAt,
    };
  });
}

/** Approve a user: add to allowed_admins and remove from login_requests. */
export async function approveAdmin({ uid, email, displayName }) {
  const db = firestore();
  await setDoc(doc(db, ALLOWED_ADMINS, uid), {
    email: email || null,
    displayName: displayName || null,
    approvedAt: serverTimestamp(),
  });
  const loginRef = doc(db, LOGIN_REQUESTS, uid);
  const snap = await getDoc(loginRef);
  if (snap.exists()) await deleteDoc(loginRef);
}

/** Set makeAdmin: true on a login request. When the user signs in again, they will be created as admin. */
export async function setLoginRequestMakeAdmin(uid) {
  const db = firestore();
  await updateDoc(doc(db, LOGIN_REQUESTS, uid), {
    makeAdmin: true,
    updatedAt: serverTimestamp(),
  });
}

/** If login_requests doc has makeAdmin true, create allowed_admins and delete login_request. Call after sign-in when not yet allowed. Returns true if admin was created. */
export async function createAdminIfMakeAdmin({ uid, email, displayName }) {
  const db = firestore();
  const loginSnap = await getDoc(doc(db, LOGIN_REQUESTS, uid));
  if (!loginSnap.exists() || loginSnap.data().makeAdmin !== true) return false;
  await setDoc(doc(db, ALLOWED_ADMINS, uid), {
    email: email ?? null,
    displayName: displayName ?? null,
    approvedAt: serverTimestamp(),
    approvedVia: "makeAdmin",
  });
  await deleteDoc(doc(db, LOGIN_REQUESTS, uid));
  return true;
}
