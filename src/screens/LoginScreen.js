import { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { user } = useContext(AuthContext);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // 🔑 FLUXO CORRETO
      navigation.replace("RecipeManager");

    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Criar conta"
        onPress={() => navigation.navigate("Register")} style={{backgroundColor: "green"}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    gap: 5,
    padding: 20,
   },
  input: {
    borderWidth: 1, 
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,    
    marginBottom: 12,
    fontSize: 16
  },

});