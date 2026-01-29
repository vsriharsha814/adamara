const { getFirestore, admin } = require('../config/firebase');

const REQUESTS_COLLECTION = 'requests';

function asDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeRequest(doc) {
  const data = doc.data ? doc.data() : doc;
  const id = doc.id || data.id;

  return {
    _id: id,
    id,

    requesterName: data.requesterName,
    requesterEmail: data.requesterEmail,
    requesterDepartment: data.requesterDepartment,
    requesterPhone: data.requesterPhone,

    adType: data.adType,
    adPurpose: data.adPurpose,
    targetAudience: data.targetAudience,
    desiredPlacement: data.desiredPlacement,
    budget: data.budget,

    requestDate: asDate(data.requestDate),
    desiredCompletionDate: asDate(data.desiredCompletionDate),

    adTitle: data.adTitle,
    adDescription: data.adDescription,
    specialInstructions: data.specialInstructions,

    files: Array.isArray(data.files) ? data.files.map(f => ({
      ...f,
      uploadDate: asDate(f.uploadDate)
    })) : [],

    status: data.status,
    assignedTo: data.assignedTo || null, // store as userId string
    adminNotes: Array.isArray(data.adminNotes) ? data.adminNotes.map(n => ({
      ...n,
      createdAt: asDate(n.createdAt)
    })) : [],
    lastUpdated: asDate(data.lastUpdated)
  };
}

async function createRequest(payload) {
  const db = getFirestore();
  const docRef = db.collection(REQUESTS_COLLECTION).doc();
  const now = admin.firestore.FieldValue.serverTimestamp();

  await docRef.set({
    ...payload,
    requestDate: now,
    lastUpdated: now,
    createdAt: now,
    updatedAt: now
  });

  const created = await docRef.get();
  return normalizeRequest(created);
}

async function getRequestById(id) {
  const db = getFirestore();
  const snap = await db.collection(REQUESTS_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return normalizeRequest(snap);
}

async function updateRequest(id, patch) {
  const db = getFirestore();
  const docRef = db.collection(REQUESTS_COLLECTION).doc(id);
  const now = admin.firestore.FieldValue.serverTimestamp();

  await docRef.set(
    {
      ...patch,
      lastUpdated: now,
      updatedAt: now
    },
    { merge: true }
  );

  const updated = await docRef.get();
  if (!updated.exists) return null;
  return normalizeRequest(updated);
}

async function listRequests({
  status,
  department,
  startDate,
  endDate,
  search,
  page = 1,
  limit = 10,
  sortField = 'requestDate',
  sortOrder = 'desc'
}) {
  const db = getFirestore();

  let query = db.collection(REQUESTS_COLLECTION);

  if (status) query = query.where('status', '==', status);
  if (department) query = query.where('requesterDepartment', '==', department);

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Firestore requires range filters to be paired with orderBy on same field.
  // When date filtering is used, force ordering by requestDate.
  const isDateRange = start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime());
  const effectiveSortField = isDateRange ? 'requestDate' : sortField;

  if (isDateRange) {
    query = query.where('requestDate', '>=', start).where('requestDate', '<=', end);
  }

  query = query.orderBy(effectiveSortField, sortOrder === 'asc' ? 'asc' : 'desc');

  // Pagination using offset (OK for small datasets; can be optimized with cursors later)
  const offset = (Math.max(1, page) - 1) * Math.max(1, limit);
  query = query.offset(offset).limit(Math.max(1, limit));

  const snap = await query.get();
  let items = snap.docs.map(normalizeRequest);

  // Firestore can't do regex OR queries like Mongo here; do a best-effort filter in memory.
  if (search) {
    const q = String(search).toLowerCase().trim();
    items = items.filter(r =>
      String(r.requesterName || '').toLowerCase().includes(q) ||
      String(r.requesterEmail || '').toLowerCase().includes(q)
    );
  }

  // Total count (approx) - use a separate query without offset/limit
  let countQuery = db.collection(REQUESTS_COLLECTION);
  if (status) countQuery = countQuery.where('status', '==', status);
  if (department) countQuery = countQuery.where('requesterDepartment', '==', department);
  if (isDateRange) countQuery = countQuery.where('requestDate', '>=', start).where('requestDate', '<=', end);

  // Firestore count aggregation is available, but keep compatibility across environments:
  const totalSnap = await countQuery.get();
  let totalCount = totalSnap.size;

  if (search) {
    const q = String(search).toLowerCase().trim();
    totalCount = totalSnap.docs
      .map(normalizeRequest)
      .filter(r =>
        String(r.requesterName || '').toLowerCase().includes(q) ||
        String(r.requesterEmail || '').toLowerCase().includes(q)
      ).length;
  }

  return {
    items,
    totalCount,
    effectiveSortField
  };
}

module.exports = {
  createRequest,
  getRequestById,
  updateRequest,
  listRequests
};
