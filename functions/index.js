import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();
const db = getFirestore();

const LOGIN_REQUESTS = "login_requests";
const ALLOWED_ADMINS = "allowed_admins";

/**
 * When a login_requests doc is updated and makeAdmin is true,
 * create the user in allowed_admins and delete the login_request.
 */
export const onLoginRequestMakeAdmin = onDocumentUpdated(
  { document: `${LOGIN_REQUESTS}/{requestId}` },
  async (event) => {
    const after = event.data?.after?.data();
    const requestId = event.params.requestId;
    if (!after || after.makeAdmin !== true) return;

    const uid = requestId;
    await db.collection(ALLOWED_ADMINS).doc(uid).set({
      email: after.email ?? null,
      displayName: after.displayName ?? null,
      approvedAt: FieldValue.serverTimestamp(),
      approvedVia: "makeAdmin",
    });
    await event.data.after.ref.delete();
  }
);
