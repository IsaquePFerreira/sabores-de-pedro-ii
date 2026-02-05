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
  const { user, logout } = useContext(AuthContext);

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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Receitas típicas e familiares</Text>

        <View style={styles.headerButtons}>
          {user && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={async () => {
                await logout();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                });
              }}
            >
              <Ionicons name="exit-outline" style={styles.logoutButtonText} />
            </TouchableOpacity>
          )}

          
        </View>
      </View>

      {/* LISTA */}
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
              <Text style={styles.cardDescription} numberOfLines={2}>
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
      <TouchableOpacity
            style={styles.newButton}
            onPress={handleNovaReceita}
          >
            <Ionicons name="add" style={styles.newButtonText} />
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

  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },

  newButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    margin: "auto"
  },

  newButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28
  },

  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 5,
  },

  logoutButtonText: {
    color: "#d9534f",
    fontWeight: "bold",
    fontSize: 28,
  },

  card: {
    borderBottomWidth: 1,
    borderColor: "#eee",
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
});
