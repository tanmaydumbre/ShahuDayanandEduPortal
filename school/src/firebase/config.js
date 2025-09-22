import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk66xRrAgZDoqKuISegLjcgTRQAnSleT0",
  authDomain: "sdhjc-58041.firebaseapp.com",
  projectId: "sdhjc-58041",
  storageBucket: "sdhjc-58041.appspot.com",
  messagingSenderId: "469450163415",
  appId: "1:469450163415:web:24afdead483ad186231c92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 