import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useState } from "react";
import { StyleSheet, Text, Alert, View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, ActivityIndicator } from "react-native";
import { supabase } from "../services/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Esquecer">

export default function Authentication({ navigation }: Props) {

    const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 24,
  },

  // Botão voltar topo
  botaoVoltarTopo: {
    marginTop: 56,
    alignSelf: "flex-start",
  },
  textoBotaoVoltarTopo: {
    color: "#9CA3AF",
    fontSize: 15,
  },

  // Conteúdo principal
  conteudo: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  icone: {
    fontSize: 44,
    marginBottom: 16,
    textAlign: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
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
  botaoEnviar: {
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
  textoBotaoEnviar: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Tela de confirmação
  containerConfirmacao: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconeConfirmacao: {
    fontSize: 56,
    marginBottom: 20,
  },
  tituloConfirmacao: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  textoConfirmacao: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 36,
  },
  emailDestaque: {
    color: "#F9FAFB",
    fontWeight: "600",
  },
  botaoVoltar: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  textoBotaoVoltar: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  linkReenviar: {
    marginTop: 20,
  },
  textoReenviar: {
    color: "#6B7280",
    fontSize: 14,
  },
})

  const [email, setEmail] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function enviarLink() {
    if (!email) {
      Alert.alert("Campo obrigatório", "Digite seu e-mail para continuar.")
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: "paradas://redefinir", // ajuste para o deep link do seu app
      }
    )

    setCarregando(false)

    if (error) {
      Alert.alert("Erro", "Não foi possível enviar o e-mail. Verifique o endereço e tente novamente.")
    } else {
      setEnviado(true)
    }
  }

  // Tela de confirmação após envio
  if (enviado) {
    return (
      <View style={styles.containerConfirmacao}>
        <Text style={styles.iconeConfirmacao}>📬</Text>
        <Text style={styles.tituloConfirmacao}>E-mail enviado!</Text>
        <Text style={styles.textoConfirmacao}>
          Enviamos um link para{"\n"}
          <Text style={styles.emailDestaque}>{email}</Text>
          {"\n\n"}Abra o link no e-mail para redefinir sua senha.
        </Text>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.replace("Login")}
          activeOpacity={0.85}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar para o login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkReenviar}
          onPress={() => setEnviado(false)}
        >
          <Text style={styles.textoReenviar}>Não recebeu? Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Tela principal
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Botão voltar */}
      <TouchableOpacity
        style={styles.botaoVoltarTopo}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoBotaoVoltarTopo}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.conteudo}>
        <Text style={styles.icone}>🔑</Text>
        <Text style={styles.titulo}>Esqueceu a senha?</Text>
        <Text style={styles.subtitulo}>
          Digite seu e-mail e enviaremos um link para você criar uma nova senha.
        </Text>

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

        <TouchableOpacity
          style={[styles.botaoEnviar, carregando && styles.botaoDesabilitado]}
          onPress={enviarLink}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.textoBotaoEnviar}>Enviar link</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
