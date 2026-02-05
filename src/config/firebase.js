import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvOZaY8F8OVd-5j18dSDnoKx5UvTNfeds",
  authDomain: "sabores-de-pedro-ii-53207.firebaseapp.com",
  projectId: "sabores-de-pedro-ii-53207",
  storageBucket: "sabores-de-pedro-ii-53207.firebasestorage.app",
  messagingSenderId: "492574160063",
  appId: "1:492574160063:web:921c2fc04940a5124c820a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

