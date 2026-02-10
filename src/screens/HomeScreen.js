import { useState, useCallback, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getRecipes, deleteRecipe } from "../services/recipeService";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

const { width: screenWidth } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [menuState, setMenuState] = useState({
    visible: false,
    recipeId: null,
    position: { x: 0, y: 0 }
  });

  const buttonRefs = useRef({});

  const carregarReceitas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getRecipes();
      setReceitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarReceitas();
    }, [carregarReceitas])
  );

  function handleNovaReceita() {
    if (!user) {
      navigation.navigate("Login", { voltarPara: "RecipeManager" });
    } else {
      navigation.navigate("RecipeManager");
    }
  }

  function abrirMenu(itemId) {
    const buttonRef = buttonRefs.current[itemId];
    if (!buttonRef) return;

    buttonRef.measure((x, y, width, height, pageX, pageY) => {
      const menuWidth = 180;
      const menuHeight = 105;

      let menuX = pageX - menuWidth + width;
      let menuY = pageY - menuHeight - 8;

      if (menuX < 10) menuX = 10;
      if (menuX + menuWidth > screenWidth - 10) {
        menuX = screenWidth - menuWidth - 10;
      }
      if (menuY < 10) {
        menuY = pageY + height + 8;
      }

      setMenuState({
        visible: true,
        recipeId: itemId,
        position: { x: menuX, y: menuY }
      });
    });
  }

  function fecharMenu() {
    setMenuState({
      visible: false,
      recipeId: null,
      position: { x: 0, y: 0 }
    });
  }

  function handleEditar(item) {
    fecharMenu();
    navigation.navigate("RecipeManager", { receita: item });
  }

  function handleExcluir(item) {
    fecharMenu();

    Alert.alert(
      "Confirmar exclusão",
      `Deseja excluir a receita "${item.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(item.id);
              carregarReceitas();
            } catch (err) {
              Alert.alert("Erro", err.message);
            }
          }
        }
      ]
    );
  }

  function renderItem({ item }) {
    const imagem =
      item.imagemUrl?.trim()
        ? { uri: item.imagemUrl }
        : require("../assets/recipe-placeholder.png");

    const isAutor = user && user.uid === item.autorId;

    return (
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Recipe", { receita: item })}
        >
          <View style={styles.card}>
            <Image source={imagem} style={styles.cardImage} />

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>

                {isAutor && (
                  <TouchableOpacity
                    ref={ref => (buttonRefs.current[item.id] = ref)}
                    onPress={() => abrirMenu(item.id)}
                    style={styles.menuButton}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={colors.muted}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.cardDescription} numberOfLines={2}>
                {item.descricao}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Receitas típicas e familiares</Text>

      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && (
        <FlatList
          data={receitas}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma receita cadastrada.
            </Text>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={handleNovaReceita}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {menuState.visible && (
        <Modal transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={fecharMenu}>
            <View
              style={[
                styles.menuDropdown,
                {
                  top: menuState.position.y,
                  left: menuState.position.x,
                  position: "absolute"
                }
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleEditar(
                    receitas.find(r => r.id === menuState.recipeId)
                  )
                }
              >
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.menuItemText}>Editar</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  handleExcluir(
                    receitas.find(r => r.id === menuState.recipeId)
                  )
                }
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#d9534f"
                />
                <Text style={[styles.menuItemText, { color: "#d9534f" }]}>
                  Excluir
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
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

  errorText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#d9534f",
    fontSize: 16,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },

  cardImage: {
    width: "100%",
    height: 160,
  },

  cardContent: {
    padding: 14,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },

  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    paddingRight: 8,
  },

  cardDescription: {
    fontSize: 14,
    color: colors.muted,
  },

  menuButton: {
    padding: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  menuDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 180,
    overflow: "hidden",
    elevation: 8,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: colors.muted,
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
