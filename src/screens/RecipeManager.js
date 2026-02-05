import { useEffect, useState, useContext } from "react";
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
  const receita = route?.params?.receita;
  const editando = !!receita;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [tempoPreparo, setTempoPreparo] = useState("");
  const [porcoes, setPorcoes] = useState("");
  const [origemCultural, setOrigemCultural] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  useEffect(() => {
    if (receita) {
      setTitulo(receita.titulo);
      setDescricao(receita.descricao);
      setIngredientes(receita.ingredientes.join(", "));
      setModoPreparo(receita.modoPreparo);
      setTempoPreparo(receita.tempoPreparo || "");
      setPorcoes(receita.porcoes || "");
      setOrigemCultural(receita.origemCultural || "");
      setImagemUrl(receita.imagemUrl || "");
    }
  }, []);

  async function handleSalvar() {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    if (!titulo || !descricao || !ingredientes || !modoPreparo) {
      Alert.alert("Erro", "Preencha os campos obrigatórios");
      return;
    }

    const dados = {
      titulo,
      descricao,
      ingredientes: ingredientes.split(",").map(i => i.trim()),
      modoPreparo,
      tempoPreparo,
      porcoes,
      origemCultural,
      imagemUrl: imagemUrl || null,
      categoriaId: "geral"
    };

    try {
      if (editando) {
        await updateRecipe(receita.id, dados);
        Alert.alert("Sucesso", "Receita atualizada");
      } else {
        await createRecipe(dados, user.uid);
        Alert.alert("Sucesso", "Receita cadastrada");
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  function handleExcluir() {
    Alert.alert(
      "Excluir receita",
      "Deseja realmente excluir esta receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteRecipe(receita.id);
            navigation.goBack();
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
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {editando ? "Editar Receita" : "Cadastrar Receita"}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Título *"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição *"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TextInput
          style={styles.input}
          placeholder="Ingredientes (separados por vírgula) *"
          value={ingredientes}
          onChangeText={setIngredientes}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Modo de preparo *"
          value={modoPreparo}
          onChangeText={setModoPreparo}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Tempo de preparo (ex: 60 minutos)"
          value={tempoPreparo}
          onChangeText={setTempoPreparo}
        />

        <TextInput
          style={styles.input}
          placeholder="Quantidade de porções"
          value={porcoes}
          onChangeText={setPorcoes}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Origem cultural"
          value={origemCultural}
          onChangeText={setOrigemCultural}
        />

        <TextInput
          style={styles.input}
          placeholder="URL da imagem"
          value={imagemUrl}
          onChangeText={setImagemUrl}
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>
            {editando ? "Salvar Alterações" : "Cadastrar Receita"}
          </Text>
        </TouchableOpacity>

        {editando && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
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
    paddingBottom: 40, // Espaço extra no final para garantir visibilidade total
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
    marginBottom: 20, // Espaço adicional no botão de excluir
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

