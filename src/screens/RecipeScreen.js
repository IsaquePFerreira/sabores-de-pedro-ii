import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

export default function RecipeScreen({ route, navigation }) {
  const { receita } = route.params;
  const { user } = useContext(AuthContext);

  const isAutor = user && user.uid === receita.autorId;

  return (
    <ScrollView style={styles.container}>
      {receita.imagemUrl && (
        <Image source={{ uri: receita.imagemUrl }} style={styles.image} />
      )}

      <Text style={styles.title}>{receita.titulo}</Text>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.text}>{receita.descricao}</Text>

      <Text style={styles.sectionTitle}>Ingredientes</Text>
      {receita.ingredientes.map((item, index) => (
        <Text key={index} style={styles.text}>
          • {item}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Modo de Preparo</Text>
      <Text style={styles.text}>{receita.modoPreparo}</Text>

      {receita.tempoPreparo && (
        <>
          <Text style={styles.sectionTitle}>Tempo de Preparo</Text>
          <Text style={styles.text}>{receita.tempoPreparo}</Text>
        </>
      )}

      {receita.porcoes && (
        <>
          <Text style={styles.sectionTitle}>Rendimento</Text>
          <Text style={styles.text}>
            {receita.porcoes} porções
          </Text>
        </>
      )}

      {receita.origemCultural && (
        <>
          <Text style={styles.sectionTitle}>Origem Cultural</Text>
          <Text style={styles.text}>{receita.origemCultural}</Text>
        </>
      )}

      {isAutor && (
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("RecipeManager", { receita })
          }
        >
          <Text style={styles.buttonText}>Editar Receita</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 18,
    marginBottom: 6,
  },

  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
