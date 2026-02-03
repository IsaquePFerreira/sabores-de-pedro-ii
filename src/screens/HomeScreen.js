import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getRecipes } from "../services/recipesService";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [receitas, setReceitas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getRecipes().then(setReceitas);
  }, []);

  return (
    <FlatList
      data={receitas}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Recipe", { receita: item })}
        >
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.titulo}
            </Text>
            <Text>{item.descricao}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
