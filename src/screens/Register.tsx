import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useState } from "react";
import { StyleSheet, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../services/supabase";


type Props = NativeStackScreenProps<RootStackParamList, "Cadastro">

export default function Register({ navigation }: Props) {

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#111827",
    },
    scroll: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
    },

    // Header
    header: {
        alignItems: "center",
        marginBottom: 36,
    },
    icone: {
        fontSize: 44,
        marginBottom: 8,
    },
    titulo: {
        fontSize: 28,
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
    linha: {
        flexDirection: "row",
        marginBottom: 16,
    },
    campoLinha: {
        flex: 1,
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

    // Botão
    botaoCadastrar: {
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
    textoBotao: {
        color: "#111827",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.3,
    },

    // Termos
    termos: {
        fontSize: 12,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 16,
        lineHeight: 18,
    },
    termoLink: {
        color: "#F59E0B",
    },

    // Rodapé
    rodape: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 32,
    },
    textoRodape: {
        color: "#6B7280",
        fontSize: 14,
    },
    linkLogin: {
        color: "#F59E0B",
        fontSize: 14,
        fontWeight: "700",
    },

    })

  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false)
  const [carregando, setCarregando] = useState(false)

  function validar() {
   
    if (senha.length < 8) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 8 caracteres.")
      return false
    }
    if (senha !== confirmaSenha) {
      Alert.alert("Senhas diferentes", "A senha e a confirmação não coincidem.")
      return false
    }
    return true
  }

  async function cadastrar() {
    if (!validar()) return

    setCarregando(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: senha,
      options: {
        data: {
          nome
        },
      },
    })

    setCarregando(false)

    if (error) {
      Alert.alert("Erro ao cadastrar", error.message)
      return
    }

    if (data.user && !data.session) {
      Alert.alert(
        "Confirme seu e-mail",
        "Enviamos um link de confirmação para " + email + ". Verifique sua caixa de entrada.",
        [{ text: "Ok", onPress: () => navigation.replace("Login") }]
      )
    } else {
      navigation.replace("Home")
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icone}>🚛</Text>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Leva menos de 2 minutos</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formulario}>

          {/* Nome e Sobrenome */}
          <View style={styles.linha}>
            <View style={[styles.campoLinha, { marginRight: 8 }]}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="João"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={nome}
                onChangeText={setNome}
              />
            </View>
          </View>

          {/* E-mail */}
          <Text style={[styles.label, { marginTop: 16 }]}>E-mail</Text>
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

          {/* Senha */}
          <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
          <View style={styles.inputSenhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Mínimo 8 caracteres"
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

          {/* Confirmar senha */}
          <Text style={[styles.label, { marginTop: 16 }]}>Confirmar senha</Text>
          <View style={styles.inputSenhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Repita a senha"
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

          {/* Botão cadastrar */}
          <TouchableOpacity
            style={[styles.botaoCadastrar, carregando && styles.botaoDesabilitado]}
            onPress={() => {
            console.log("botão pressionado") // ← adicione isso
            cadastrar()
            }}
            //onPress={cadastrar}
            disabled={carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.textoBotao}>Criar conta</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.termos}>
            Ao criar sua conta você concorda com os{" "}
            <Text style={styles.termoLink}>Termos de uso</Text> e a{" "}
            <Text style={styles.termoLink}>Política de privacidade</Text>.
          </Text>
        </View>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.linkLogin}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  icone: {
    fontSize: 44,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
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
  linha: {
    flexDirection: "row",
    marginBottom: 16,
  },
  campoLinha: {
    flex: 1,
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

  // Botão
  botaoCadastrar: {
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
  textoBotao: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Termos
  termos: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  termoLink: {
    color: "#F59E0B",
  },

  // Rodapé
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  textoRodape: {
    color: "#6B7280",
    fontSize: 14,
  },
  linkLogin: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "700",
  },

})


