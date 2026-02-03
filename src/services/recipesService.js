import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getRecipes() {
  const snapshot = await getDocs(collection(db, "receitas"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
