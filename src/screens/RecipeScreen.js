import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

export default function RecipeScreen({ route, navigation }) {
  const { receita } = route.params;
  const { user } = useContext(AuthContext);

  const isAutor = user && user.uid === receita.autorId;

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
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
      </ScrollView>

      {/* Barra de botões fixa na parte inferior */}
      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>

        {isAutor && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("RecipeManager", { receita })}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
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

  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },

  backButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600",
  },

  editButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignItems: "center",
  },

  editButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
