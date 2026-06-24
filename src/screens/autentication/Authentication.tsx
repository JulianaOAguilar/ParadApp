import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import { RootStackParamList } from "../../navigation/types";
import React from "react";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function Authentication({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert("Campos obrigatórios", "Preencha e-mail e senha para continuar.");
      return;
    }

    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });

    setCarregando(false);

    if (error) {
      Alert.alert("Erro ao entrar", "E-mail ou senha incorretos. Tente novamente.");
    } else {
      navigation.replace("Home");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo1}>ParadApp</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        <Text style={styles.titulo}>Login</Text>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000000"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Senha"
            placeholderTextColor="#000000"
            secureTextEntry={!senhaVisivel}
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            style={styles.botaoOlho}
          >
            <Text style={styles.textoOlho}></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.linkEsqueceuSenha} onPress={() => navigation.navigate("Esquecer")}>
          <Text style={styles.textoEsqueceuSenha}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Botão entrar */}
        <TouchableOpacity
          style={[styles.botaoEntrar, carregando && styles.botaoDesabilitado]}
          onPress={entrar}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.textoBotaoEntrar}>Entrar</Text>
          )}
        </TouchableOpacity>

      </View>

      {/* Rodapé */}
      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>Não tem uma conta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.linkCadastro}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  icone: {
    fontSize: 48,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#414141",
    letterSpacing: -0.5,
  },

    titulo1: {
    fontSize: 60,
      fontFamily: "ProtestStrike",
    fontWeight: "800",
    color: "#414141",
    letterSpacing: -0.5,
  },

  subtitulo: {
    fontSize: 15,
    color: "#1f1f1f",
    marginTop: 4,
  },

  // Formulário
  formulario: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#d4e6ff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    backgroundColor: "#dbeaff",
    borderRadius: 12,
    color: '#000',
    alignItems: "center",
  },
  inputSenha: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000000",
  },
  botaoOlho: {
    paddingHorizontal: 14,
  },
  textoOlho: {
    fontSize: 18,
  },
  linkEsqueceuSenha: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 4,
  },
  textoEsqueceuSenha: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },

  // Botão entrar
  botaoEntrar: {
    backgroundColor: "#83ACE1",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#9ac6ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoEntrar: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Rodapé
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 36,
  },
  textoRodape: {
    color: "#f8f8f8",
    fontSize: 14,
  },
  linkCadastro: {
    color: "#efff09",
    fontSize: 14,
    fontWeight: "700",
  },
});
