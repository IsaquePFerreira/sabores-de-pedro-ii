import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

export async function getRecipes() {
  const snapshot = await getDocs(collection(db, "receitas"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function createRecipe(data, autorId) {
  if (!autorId) {
    throw new Error("Usuário não autenticado");
  }

  await addDoc(collection(db, "receitas"), {
    ...data,
    autorId,
    criadoEm: serverTimestamp()
  });
}

export async function updateRecipe(recipeId, data) {
  const ref = doc(db, "receitas", recipeId);
  await updateDoc(ref, data);
}

export async function deleteRecipe(recipeId) {
  const ref = doc(db, "receitas", recipeId);
  await deleteDoc(ref);
}
