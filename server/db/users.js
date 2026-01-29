const bcrypt = require('bcryptjs');
const { getFirestore, admin } = require('../config/firebase');

const USERS_COLLECTION = 'users';

function normalizeUser(doc) {
  if (!doc) return null;
  const data = doc.data ? doc.data() : doc;
  const id = doc.id || data.id;

  // Match old API expectations (Mongoose: user.id / user._id)
  return {
    id,
    _id: id,
    name: data.name,
    email: data.email,
    role: data.role,
    department: data.department,
    active: data.active !== false,
    lastLogin: data.lastLogin ? data.lastLogin.toDate?.() ?? data.lastLogin : undefined,
    // internal
    passwordHash: data.passwordHash
  };
}

async function getUserById(id) {
  const db = getFirestore();
  const snap = await db.collection(USERS_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return normalizeUser(snap);
}

async function getUserByEmail(email) {
  const db = getFirestore();
  const snap = await db
    .collection(USERS_COLLECTION)
    .where('email', '==', String(email).toLowerCase().trim())
    .limit(1)
    .get();

  if (snap.empty) return null;
  return normalizeUser(snap.docs[0]);
}

async function createUser({ name, email, password, role, department }) {
  const db = getFirestore();
  const normalizedEmail = String(email).toLowerCase().trim();

  const passwordHash = await bcrypt.hash(password, 10);
  const docRef = db.collection(USERS_COLLECTION).doc();

  const userDoc = {
    name,
    email: normalizedEmail,
    passwordHash,
    role,
    department: department || null,
    active: true,
    lastLogin: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(userDoc);
  const created = await docRef.get();
  return normalizeUser(created);
}

async function updateUser(id, patch) {
  const db = getFirestore();
  const docRef = db.collection(USERS_COLLECTION).doc(id);

  await docRef.set(
    {
      ...patch,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  const updated = await docRef.get();
  if (!updated.exists) return null;
  return normalizeUser(updated);
}

async function matchPassword(user, enteredPassword) {
  if (!user?.passwordHash) return false;
  return bcrypt.compare(enteredPassword, user.passwordHash);
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  matchPassword
};
