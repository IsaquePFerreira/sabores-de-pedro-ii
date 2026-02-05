import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen";
import RecipeManagerScreen from "../screens/RecipeManager";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

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
        options={{ title: "Sabores de Pedro II" }}
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
