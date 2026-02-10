import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../contexts/AuthContext";
import color from "../styles/color";

export default function AppHeader() {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
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
          width: 70,
          height: 70,
          borderRadius: 4,
        }}
      />

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: color.text,
          flexShrink: 1,
        }}
      >
        Sabores de Pedro II
      </Text>

      <View style={{ marginLeft: "auto" }}>
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
            <Ionicons name="exit-outline" size={30} color={color.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
          >
            <Ionicons name="person-circle" size={30} color={color.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
