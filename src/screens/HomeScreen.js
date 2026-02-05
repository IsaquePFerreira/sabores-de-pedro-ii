import { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getRecipes } from "../services/recipeService";
import { AuthContext } from "../contexts/AuthContext";

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
      <View style={styles.header}>
        <Text style={styles.title}>Sabores de Pedro II</Text>
        <Button title="Nova Receita" onPress={handleNovaReceita} />
      </View>

      <FlatList
        data={receitas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Recipe", { receita: item })}
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text numberOfLines={2}>{item.descricao}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: { fontSize: 22, fontWeight: "bold" },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#777"
  }
});
