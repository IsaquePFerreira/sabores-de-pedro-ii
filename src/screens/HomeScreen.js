import { useEffect, useState, useCallback, useContext, useRef } from "react";
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
  Dimensions
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getRecipes, deleteRecipe } from "../services/recipeService";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [receitas, setReceitas] = useState([]);
  const [menuVisivel, setMenuVisivel] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRefs = useRef({});
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
      navigation.navigate("Login", { voltarPara: "RecipeManager" });
    } else {
      navigation.navigate("RecipeManager");
    }
  }

  // ✅ ABRE O MENU COM POSICIONAMENTO
  function handleAbrirMenu(itemId) {
    const buttonRef = buttonRefs.current[itemId];
    if (buttonRef) {
      buttonRef.measure((x, y, width, height, pageX, pageY) => {
        // Posiciona o menu acima e à esquerda do botão
        const menuWidth = 180;
        const menuHeight = 105; // altura aproximada do menu
        
        let menuX = pageX - menuWidth + width; // Alinha à direita do botão
        let menuY = pageY - menuHeight - 8; // 8px acima do botão

        // Ajusta se sair da tela
        if (menuX < 10) menuX = 10;
        if (menuX + menuWidth > screenWidth - 10) menuX = screenWidth - menuWidth - 10;
        if (menuY < 10) menuY = pageY + height + 8; // Se não couber acima, mostra abaixo

        setMenuPosition({ x: menuX, y: menuY });
        setMenuVisivel(itemId);
      });
    }
  }

  // ✅ FUNÇÃO PARA EXCLUIR RECEITA
  function handleExcluirReceita(item) {
    setMenuVisivel(null);

    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a receita "${item.titulo}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(item.id);
              Alert.alert("Sucesso", "Receita excluída com sucesso!");
              carregarReceitas();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir a receita");
              console.error(error);
            }
          }
        }
      ]
    );
  }

  // ✅ FUNÇÃO PARA EDITAR RECEITA
  function handleEditarReceita(item) {
    setMenuVisivel(null);
    navigation.navigate("RecipeManager", { receita: item });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Receitas típicas e familiares
      </Text>

      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const imagem =
            item.imagemUrl && item.imagemUrl.trim() !== ""
              ? { uri: item.imagemUrl }
              : require("../assets/recipe-placeholder.png");

          const isAutor = user && user.uid === item.autorId;

          return (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Recipe", { receita: item })
                }
              >
                <View style={styles.card}>
                  <Image source={imagem} style={styles.cardImage} />

                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{item.titulo}</Text>
                      
                      {isAutor && (
                        <TouchableOpacity
                          ref={(ref) => (buttonRefs.current[item.id] = ref)}
                          onPress={() => handleAbrirMenu(item.id)}
                          style={styles.menuButton}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text
                      style={styles.cardDescription}
                      numberOfLines={2}
                    >
                      {item.descricao}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* ✅ MENU DROPDOWN POSICIONADO */}
              {menuVisivel === item.id && (
                <Modal
                  transparent
                  visible={menuVisivel === item.id}
                  onRequestClose={() => setMenuVisivel(null)}
                  animationType="fade"
                >
                  <Pressable 
                    style={styles.modalOverlay}
                    onPress={() => setMenuVisivel(null)}
                  >
                    <View 
                      style={[
                        styles.menuDropdown,
                        {
                          position: 'absolute',
                          top: menuPosition.y,
                          left: menuPosition.x,
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleEditarReceita(item)}
                      >
                        <Ionicons name="pencil-outline" size={20} color={colors.primary} />
                        <Text style={styles.menuItemText}>Editar</Text>
                      </TouchableOpacity>

                      <View style={styles.menuDivider} />

                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleExcluirReceita(item)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#d9534f" />
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
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma receita cadastrada.
          </Text>
        }
      />

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

  // ✅ ESTILOS DO MENU DROPDOWN
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  menuDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 180,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  menuItemText: {
    fontSize: 16,
    color: colors.text,
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
