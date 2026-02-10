import { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import colors from "../styles/color";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleRegister() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha email e senha");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);

      // 🔑 mesmo fluxo do login
      navigation.replace("RecipeManager");

    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <View style={styles.container}>
  <Image 
    source={require("../../assets/saborp2.png")} 
    style={styles.backgroundLogo}
    resizeMode="contain"
  />
  
  <View style={styles.content}>
    <Text style={styles.title}>Criar conta</Text>
    <Text style={styles.subtitle}>
      Cadastre-se para adicionar novas receitas
    </Text>

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

  <TouchableOpacity style={styles.button} onPress={handleRegister}>
    <Text style={styles.buttonText}>Cadastrar</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.linkButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.linkText}>Já tenho conta</Text>
  </TouchableOpacity>
  </View>
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  backgroundLogo: {
    position: "absolute",
    width: 300,
    height: 300,
    top: -40, // 40
    alignSelf: "center",
    // opacity: 0.15, // deixa a logo suave no fundo (ajuste entre 0.1 e 0.3)
  },

  content: {
    flex: 1,
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
