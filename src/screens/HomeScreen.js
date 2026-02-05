import { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getRecipes } from "../services/recipeService";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

export default function HomeScreen() {
  const [receitas, setReceitas] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  async function carregarReceitas() {
    const data = await getRecipes();
    setReceitas(data);
  }

  useEffect(() => {
    carregarReceitas();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarReceitas();
    }, [])
  );

  function handleNovaReceita() {
    if (!user) {
      navigation.navigate("Login");
    } else {
      navigation.navigate("RecipeManager");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Receitas típicas e familiares
      </Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Recipe", { receita: item })
            }
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text
                style={styles.cardDescription}
                numberOfLines={2}
              >
                {item.descricao}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma receita cadastrada.
          </Text>
        }
      />

      {/* BOTÃO FLUTUANTE (+) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleNovaReceita}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },

  subtitle: {
    fontSize: 32,
    color: "#d35400",
    fontWeight: "bold",
    marginBottom: 12,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 14,
    color: colors.muted,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777",
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
