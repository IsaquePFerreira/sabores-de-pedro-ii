import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleRegister() {
    createUserWithEmailAndPassword(auth, email, senha)
      .catch(error => alert(error.message));
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} />

      <Text>Senha</Text>
      <TextInput value={senha} onChangeText={setSenha} secureTextEntry />

      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}
