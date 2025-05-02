import { addToast } from "@heroui/toast";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    addToast({
      title: "Error signing in with Google",
      description: "Please try again later",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      variant: "flat",
      color: "danger",
    });
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    addToast({
      title: "Error logging in",
      description: "Please check your email and password",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      variant: "flat",
      color: "danger",
    });
    throw error;
  }
}

export async function singinWithEmail(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    addToast({
      title: "Error signing in",
      description: "Please check your email and password",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      variant: "flat",
      color: "danger",
    });
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    addToast({
      title: "Error signing out",
      description: "Please try again later",
      timeout: 3000,
      shouldShowTimeoutProgress: true,
      variant: "flat",
      color: "danger",
    });
    throw error;
  }
}
