import admin from "firebase-admin";

import serviceAccount from "./firebaseServiceAccount.json" ;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
