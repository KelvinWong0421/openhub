// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHMuEGmIDKJb-Lpz_-KF-CJN26SaVpyJM",
  authDomain: "openhub-g2.firebaseapp.com",
  projectId: "openhub-g2",
  storageBucket: "openhub-g2.appspot.com",
  messagingSenderId: "504358266504",
  appId: "1:504358266504:web:bf304ff1284b6c8ef8e13d"
};

// Initialize Firebase app (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore and Storage instances using the app
const db = getFirestore(app);
const storage = getStorage(app);

export default app;
export { db, storage };
