import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const serviceAccount = `${process.env.SECRETS_PATH}/service-account.json`;

export const initializeFirebaseApp = () =>
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://pokedle-online-default-rtdb.europe-west1.firebasedatabase.app",
  });
