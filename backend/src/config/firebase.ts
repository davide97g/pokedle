import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = `${process.env.SECRETS_PATH}/service-account.json`;
console.log("serviceAccount", serviceAccount);

export const initializeFirebaseApp = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
