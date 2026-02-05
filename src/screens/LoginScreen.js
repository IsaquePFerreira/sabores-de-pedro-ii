import { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../contexts/AuthContext";
import colors from "../styles/color";

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
      navigation.replace("Home");

    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
<View style={styles.container}>
  <Text style={styles.title}>Bem-vindo</Text>
  <Text style={styles.subtitle}>Entre para cadastrar suas receitas</Text>

  <Text style={styles.label}>Email</Text>
  <TextInput
    value={email}
    onChangeText={setEmail}
    autoCapitalize="none"
    style={styles.input}
  />

  <Text style={styles.label}>Senha</Text>
  <TextInput
    value={senha}
    onChangeText={setSenha}
    secureTextEntry
    style={styles.input}
  />

  <TouchableOpacity style={styles.button} onPress={handleLogin}>
    <Text style={styles.buttonText}>Entrar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.linkButton}
    onPress={() => navigation.navigate("Register")}
  >
    <Text style={styles.linkText}>Criar conta</Text>
  </TouchableOpacity>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },

  linkText: {
    color: colors.secondary,
    fontWeight: "bold",
  },
});
