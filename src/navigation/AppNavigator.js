import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";

import { AuthContext } from "../contexts/AuthContext";

import HomeScreen from "../screens/HomeScreen";
import RecipeScreen from "../screens/RecipeScreen";
import RecipeManagerScreen from "../screens/RecipeManager";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitleAlign: "center",

          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Image
                source={require("../../assets/saborp2.png")}
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: 4,
                }}
              />
              <Text style={{ fontSize: 18, fontWeight: "bold", paddingRight: 48 }}>
                Sabores de Pedro II
              </Text>
            </View>
          ),

          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              {user ? (
                <TouchableOpacity
                  onPress={async () => {
                    await logout();
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Home" }],
                    });
                  }}
                >
                  <Ionicons
                    name="exit-outline"
                    size={32}
                    color="#d9534f"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                >
                  <Ionicons
                    name="person-circle"
                    size={32}
                    color="#333"
                  />
                </TouchableOpacity>
              )}
            </View>
          ),
        })}
      />

      <Stack.Screen
        name="Recipe"
        component={RecipeScreen}
        options={{ title: "Receita" }}
      />

      <Stack.Screen
        name="RecipeManager"
        component={RecipeManagerScreen}
        options={{ title: "Cadastrar Receita" }}
      />

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
    </Stack.Navigator>
  );
}
