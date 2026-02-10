import { useEffect, useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import {
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "../services/recipeService";

import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

export default function RecipeManager({ route, navigation }) {
  const { user } = useContext(AuthContext);

  const receita = route?.params?.receita || null;
  const editando = useMemo(() => !!receita, [receita]);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    ingredientes: "",
    modoPreparo: "",
    tempoPreparo: "",
    porcoes: "",
    origemCultural: "",
    imagemUrl: ""
  });

  /**
   * Atualiza o formulário quando a receita muda
   * (corrige bug de dependência)
   */
  useEffect(() => {
    if (!receita) return;

    setForm({
      titulo: receita.titulo ?? "",
      descricao: receita.descricao ?? "",
      ingredientes: Array.isArray(receita.ingredientes)
        ? receita.ingredientes.join(", ")
        : "",
      modoPreparo: receita.modoPreparo ?? "",
      tempoPreparo: receita.tempoPreparo ?? "",
      porcoes: receita.porcoes ?? "",
      origemCultural: receita.origemCultural ?? "",
      imagemUrl: receita.imagemUrl ?? ""
    });
  }, [receita]);

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSalvar() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    try {
      if (editando) {
        await updateRecipe(receita.id, form);
        Alert.alert("Sucesso", "Receita atualizada com sucesso");
      } else {
        await createRecipe(form, user.uid);
        Alert.alert("Sucesso", "Receita cadastrada com sucesso");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  function handleExcluir() {
    if (!receita?.id) return;

    Alert.alert(
      "Excluir receita",
      "Deseja realmente excluir esta receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(receita.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("Erro", error.message);
            }
          }
        }
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {editando ? "Editar Receita" : "Cadastrar Receita"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Título *"
          value={form.titulo}
          onChangeText={v => updateField("titulo", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição *"
          value={form.descricao}
          onChangeText={v => updateField("descricao", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Ingredientes (separados por vírgula) *"
          value={form.ingredientes}
          onChangeText={v => updateField("ingredientes", v)}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Modo de preparo *"
          value={form.modoPreparo}
          onChangeText={v => updateField("modoPreparo", v)}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Tempo de preparo"
          value={form.tempoPreparo}
          onChangeText={v => updateField("tempoPreparo", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade de porções"
          value={form.porcoes}
          onChangeText={v => updateField("porcoes", v)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Origem cultural"
          value={form.origemCultural}
          onChangeText={v => updateField("origemCultural", v)}
        />

        <TextInput
          style={styles.input}
          placeholder="URL da imagem"
          value={form.imagemUrl}
          onChangeText={v => updateField("imagemUrl", v)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>
            {editando ? "Salvar Alterações" : "Cadastrar Receita"}
          </Text>
        </TouchableOpacity>

        {editando && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleExcluir}
          >
            <Text style={styles.deleteButtonText}>Excluir Receita</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  deleteButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E74C3C",
  },

  deleteButtonText: {
    color: "#E74C3C",
    fontSize: 15,
    fontWeight: "bold",
  },
});
