// finance-dashboard/src/firebase/auth.jsx

import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  signOut,
} from "firebase/auth";

// Create new user with email and password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in with email and password
export const doSignInWithEmailAndPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Sign in with Google
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

// Sign out current user
export const doSignOut = async () => {
  return await signOut(auth);
};

// Reset password
export const doPasswordReset = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

// Change password for current user
export const doPasswordChange = async (password) => {
  return await updatePassword(auth.currentUser, password);
};

// Send email verification
export const doSendEmailVerification = async () => {
  return await sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`, // ✅ corrected interpolation
  });
};