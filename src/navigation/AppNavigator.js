import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RecipeScreen from "../screens/RecipeScreen";
import RecipeManager from "../screens/RecipeManager";

import AppHeader from "../components/AppHeader";
import colors from "../styles/color";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <AppHeader />,
          headerBackVisible: false,
          gestureEnabled: false,   
        }}
      />

      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ title: "Detalhes da Receita" }}
      />

      <Stack.Screen
        name="RecipeManager"
        component={RecipeManager}
        options={({ route }) => ({
          title: route?.params?.receita
            ? "Editar Receita"
            : "Nova Receita",
        })}
      />

      {!user && (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Entrar" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Criar Conta" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
