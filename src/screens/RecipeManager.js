import { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert
} from "react-native";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "../services/recipeService";
import { AuthContext } from "../contexts/AuthContext";

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
    <ScrollView style={styles.container}>
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

      <Button
        title={editando ? "Salvar Alterações" : "Cadastrar Receita"}
        onPress={handleSalvar}
      />

      {editando && (
        <View style={{ marginTop: 12 }}>
          <Button
            title="Excluir Receita"
            color="red"
            onPress={handleExcluir}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16
  },
  textArea: {
    height: 100,
    textAlignVertical: "top"
  }
});
