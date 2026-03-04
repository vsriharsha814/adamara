"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestoreSafe, getStorageSafe } from "@/lib/firebaseClient";

const REQUESTS = "requests";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function firestore() {
  const db = getFirestoreSafe();
  if (!db) throw new Error("Firestore not available");
  return db;
}

function storage() {
  const s = getStorageSafe();
  if (!s) throw new Error("Storage not available");
  return s;
}

/** Convert Firestore doc to plain object with id and date fields */
function docToRequest(docSnap) {
  if (!docSnap?.exists?.()) return null;
  const d = docSnap.data();
  const id = docSnap.id;
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
    files: Array.isArray(d.files) ? d.files : [],
    status: d.status || "pending",
    assignedTo: d.assignedTo ?? null,
    adminNotes: Array.isArray(d.adminNotes) ? d.adminNotes : [],
    lastUpdated: toDate(d.lastUpdated),
  };
}

/** Create a new ad request (public form). Optionally upload files to Storage. */
export async function createRequest(payload, files = []) {
  const db = firestore();
  const col = collection(db, REQUESTS);
  const requestId = doc(col).id;

  let fileEntries = [];
  if (files.length > 0) {
    const st = storage();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) throw new Error(`File ${file.name} exceeds 10MB`);
      const path = `requests/${requestId}/${Date.now()}-${file.name}`;
      const storageRef = ref(st, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      fileEntries.push({
        originalName: file.name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileURL: url,
        uploadDate: new Date(),
      });
    }
  }

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
    files: fileEntries,
  };
  await setDoc(doc(db, REQUESTS, requestId), data);
  return requestId;
}

/** Get a single request by id */
export async function getRequestById(id) {
  const db = firestore();
  const snap = await getDoc(doc(db, REQUESTS, id));
  return docToRequest(snap);
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
  const db = firestore();
  const q = query(
    collection(db, REQUESTS),
    orderBy("requestDate", "desc"),
    limit(Math.min(2000, Math.max(50, pageSize * (page + 2))))
  );
  const snapshot = await getDocs(q);
  let items = snapshot.docs.map((d) => docToRequest(d));

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
