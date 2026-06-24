import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View, Text, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import { RootStackParamList } from "../../navigation/types";

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
        <Text style={styles.icone}>🚛</Text>
        <Text style={styles.titulo}>Paradas</Text>
        <Text style={styles.subtitulo}>Sua rota, seu descanso</Text>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seu@email.com"
          placeholderTextColor="#9CA3AF"
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
            placeholder="Sua senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!senhaVisivel}
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            style={styles.botaoOlho}
          >
            <Text style={styles.textoOlho}>{senhaVisivel ? "🙈" : "👁️"}</Text>
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
    backgroundColor: "#111827",
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
    color: "#F9FAFB",
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 4,
  },

  // Formulário
  formulario: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#F9FAFB",
  },
  inputSenhaContainer: {
    flexDirection: "row",
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    alignItems: "center",
  },
  inputSenha: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#F9FAFB",
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
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "500",
  },

  // Botão entrar
  botaoEntrar: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#F59E0B",
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
    color: "#6B7280",
    fontSize: 14,
  },
  linkCadastro: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "700",
  },
});