import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import RecipeScreen from "../screens/RecipeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack.Navigator>
     {user ? (
  <>
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
  </>
) : (

        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
