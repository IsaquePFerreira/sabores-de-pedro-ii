import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen";
import RecipeManagerScreen from "../screens/RecipeManager";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { View, Text, Image, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator initialRouteName="Home">
      {/* Telas públicas */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Sabores de Pedro II",
          headerRight: () => (
            <Image
              source={require("../assets/Bandeira_de_Pedro_II.jpg")}
              style={{ width: 52, height: 42, marginRight: 195, borderRadius: 8 }}
            />
          )
        }}
        />

      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ title: "Receita" }}
      />

      {/* Autenticação */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Tela protegida */}
      <Stack.Screen
        name="RecipeManager"
        component={RecipeManagerScreen}
        options={{ title: "Cadastrar Receita" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
    resizeMode: "contain"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  }
});
