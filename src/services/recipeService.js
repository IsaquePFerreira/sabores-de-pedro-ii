import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Normaliza e valida os dados de uma receita
 * Centraliza regras de domínio
 */
function normalizeRecipeData(data) {
  if (!data) {
    throw new Error("Dados da receita não fornecidos");
  }

  const {
    titulo,
    descricao,
    ingredientes,
    modoPreparo,
    tempoPreparo = "",
    porcoes = "",
    origemCultural = "",
    imagemUrl = null,
    categoriaId = "geral"
  } = data;

  if (!titulo || !descricao || !ingredientes || !modoPreparo) {
    throw new Error("Campos obrigatórios da receita não preenchidos");
  }

  const ingredientesArray = Array.isArray(ingredientes)
    ? ingredientes
    : ingredientes
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

  if (ingredientesArray.length === 0) {
    throw new Error("A receita deve conter ao menos um ingrediente");
  }

  return {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    ingredientes: ingredientesArray,
    modoPreparo: modoPreparo.trim(),
    tempoPreparo: tempoPreparo.trim(),
    porcoes,
    origemCultural: origemCultural.trim(),
    imagemUrl: imagemUrl?.trim() || null,
    categoriaId
  };
}

/**
 * Busca receitas ordenadas por data de criação (mais recentes primeiro)
 */
export async function getRecipes() {
  try {
    const receitasRef = collection(db, "receitas");
    const q = query(receitasRef, orderBy("criadoEm", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    throw new Error("Não foi possível carregar as receitas");
  }
}

/**
 * Cria uma nova receita
 */
export async function createRecipe(data, autorId) {
  if (!autorId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    const recipeData = normalizeRecipeData(data);

    await addDoc(collection(db, "receitas"), {
      ...recipeData,
      autorId,
      criadoEm: serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    throw error;
  }
}

/**
 * Atualiza uma receita existente
 */
export async function updateRecipe(recipeId, data) {
  if (!recipeId) {
    throw new Error("ID da receita não informado");
  }

  try {
    const recipeData = normalizeRecipeData(data);
    const ref = doc(db, "receitas", recipeId);

    await updateDoc(ref, recipeData);
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    throw error;
  }
}

/**
 * Exclui uma receita
 * (a verificação de autoria deve ser reforçada por regras do Firestore)
 */
export async function deleteRecipe(recipeId) {
  if (!recipeId) {
    throw new Error("ID da receita não informado");
  }

  try {
    const ref = doc(db, "receitas", recipeId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    throw new Error("Não foi possível excluir a receita");
  }
}
