import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, senha)
      .catch(error => alert(error.message));
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />

      <Text>Senha</Text>
      <TextInput value={senha} onChangeText={setSenha} secureTextEntry />

      <Button title="Entrar" onPress={handleLogin} />
      <Button
        title="Criar conta"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
