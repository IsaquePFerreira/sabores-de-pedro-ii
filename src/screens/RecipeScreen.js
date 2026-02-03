import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

export default function RecipeScreen({ route }) {
  const { receita } = route.params;

  return (
    <ScrollView style={styles.container}>
      {receita.imagemUrl && (
        <Image
          source={{ uri: receita.imagemUrl }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{receita.titulo}</Text>

      <Text style={styles.sectionTitle}>Descrição</Text>
      <Text style={styles.text}>{receita.descricao}</Text>

      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <Text style={styles.text}>{receita.ingredientes}</Text>

      <Text style={styles.sectionTitle}>Modo de Preparo</Text>
      <Text style={styles.text}>{receita.modoPreparo}</Text>

      {receita.tempoPreparo && (
        <>
          <Text style={styles.sectionTitle}>Tempo de Preparo</Text>
          <Text style={styles.text}>{receita.tempoPreparo}</Text>
        </>
      )}

      {receita.origemCultural && (
        <>
          <Text style={styles.sectionTitle}>Origem Cultural</Text>
          <Text style={styles.text}>{receita.origemCultural}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 4
  },
  text: {
    fontSize: 16,
    lineHeight: 22
  }
});
