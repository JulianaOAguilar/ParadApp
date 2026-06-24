import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useState, useEffect } from "react";
import { StyleSheet, Text, Alert, View, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { supabase } from "../services/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Redefinir">

export default function Authentication({ navigation }: Props) {

    const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 24,
  },
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
  botaoSalvar: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoSalvar: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Estado de erro / link inválido
  containerCentro: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconeErro: {
    fontSize: 48,
    marginBottom: 16,
  },
  tituloErro: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 12,
  },
  textoErro: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  botaoNovo: {
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  textoBotaoNovo: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
})

  const [novaSenha, setNovaSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [sessaoValida, setSessaoValida] = useState(false)
  const [verificando, setVerificando] = useState(true)

// Verifica se o usuário chegou aqui via link de redefinição válido
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessaoValida(true)
      }
      setVerificando(false)
    })

    // Escuta o evento disparado quando o deep link é processado
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessaoValida(true)
        setVerificando(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function redefinirSenha() {
    if (!novaSenha || !confirmaSenha) {
      Alert.alert("Campos obrigatórios", "Preencha os dois campos.")
      return
    }
    if (novaSenha.length < 8) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (novaSenha !== confirmaSenha) {
      Alert.alert("Senhas diferentes", "A nova senha e a confirmação não coincidem.")
      return
    }

    setCarregando(true)

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    setCarregando(false)

    if (error) {
      Alert.alert("Erro", "Não foi possível redefinir a senha. O link pode ter expirado.")
    } else {
      Alert.alert(
        "Senha redefinida!",
        "Sua senha foi atualizada com sucesso.",
        [{ text: "Entrar", onPress: () => navigation.replace("Login") }]
      )
    }
  }

  // Carregando verificação de sessão
  if (verificando) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator color="#F59E0B" size="large" />
      </View>
    )
  }

  // Link inválido ou expirado
  if (!sessaoValida) {
    return (
      <View style={styles.containerCentro}>
        <Text style={styles.iconeErro}>⚠️</Text>
        <Text style={styles.tituloErro}>Link inválido</Text>
        <Text style={styles.textoErro}>
          Este link expirou ou já foi utilizado. Solicite um novo link de redefinição.
        </Text>
        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => navigation.replace("Esquecer")}
          activeOpacity={0.85}
        >
          <Text style={styles.textoBotaoNovo}>Solicitar novo link</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Formulário de nova senha
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.conteudo}>
        <Text style={styles.icone}>🔒</Text>
        <Text style={styles.titulo}>Nova senha</Text>
        <Text style={styles.subtitulo}>
          Escolha uma senha forte com pelo menos 8 caracteres.
        </Text>

        <Text style={styles.label}>Nova senha</Text>
        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!senhaVisivel}
            autoCapitalize="none"
            value={novaSenha}
            onChangeText={setNovaSenha}
          />
          <TouchableOpacity
            onPress={() => setSenhaVisivel(!senhaVisivel)}
            style={styles.botaoOlho}
          >
            <Text style={styles.textoOlho}>{senhaVisivel ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Confirmar senha</Text>
        <View style={styles.inputSenhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Repita a nova senha"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!confirmaSenhaVisivel}
            autoCapitalize="none"
            value={confirmaSenha}
            onChangeText={setConfirmaSenha}
          />
          <TouchableOpacity
            onPress={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
            style={styles.botaoOlho}
          >
            <Text style={styles.textoOlho}>{confirmaSenhaVisivel ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.botaoSalvar, carregando && styles.botaoDesabilitado]}
          onPress={redefinirSenha}
          disabled={carregando}
          activeOpacity={0.85}
        >
          {carregando ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text style={styles.textoBotaoSalvar}>Salvar nova senha</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}