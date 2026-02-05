import { View, Text, ScrollView, Image, StyleSheet, Button } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

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
        <View style={{ marginTop: 20 }}>
          <Button
            title="Editar Receita"
            onPress={() =>
              navigation.navigate("RecipeManager", { receita })
            }
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
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
