import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from "react-native"

import { useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigation/types"
import { supabase } from "../../services/supabase"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system/legacy"
import { decode } from "base64-arraybuffer"

type Props = NativeStackScreenProps<RootStackParamList, "NovoPonto">

export default function CreatePointScreen({ route, navigation }: Props) {

  const { tipo } = route.params

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [localizacao, setLocalizacao] = useState("")

  const [banheiro, setBanheiro] = useState(false)
  const [chuveiro, setChuveiro] = useState(false)
  const [restaurante, setRestaurante] = useState(false)
  const [sinalRede, setSinalRede] = useState(false)
  const [estacionamentoCaminhoes, setEstacionamentoCaminhoes] = useState(false)

  const [foto, setFoto] = useState<string | null>(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  const tipoMap: any = {
    "Posto de Combustível": "posto",
    "Pátio de descanso (PPD)": "patio",
    "Restaurante": "restaurante",
    "Mecânico": "mecanico",
    "Outro": "outro",
  }

  // 📸 UPLOAD CORRIGIDO (MOBILE SAFE)
  async function escolherImagem() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // corrige o warning de deprecation
      allowsEditing: true,
      quality: 0.7,
    })

    if (result.canceled) return

    const file = result.assets[0]
    const ext = (file.uri.split(".").pop() || "jpg").toLowerCase()
    const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`
    const fileName = `pontos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    setEnviandoFoto(true)

    try {
      // No Expo Go, fetch(file.uri) de um arquivo local (file://) pode
      // retornar bytes truncados/corrompidos. Ler via FileSystem em base64
      // e decodificar manualmente é o jeito confiável de fazer isso.
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const arrayBuffer = decode(base64)

      const { error } = await supabase.storage
        .from("foto-ponto")
        .upload(fileName, arrayBuffer, {
          contentType: mimeType,
          upsert: false,
        })

      if (error) {
        console.log("UPLOAD ERROR:", error)
        Alert.alert("Erro ao enviar imagem", error.message)
        return
      }

      const { data } = supabase.storage.from("foto-ponto").getPublicUrl(fileName)
      setFoto(data.publicUrl)

    } catch (err: any) {
      console.log("CATCH ERROR:", err)
      Alert.alert("Erro inesperado ao enviar imagem", err?.message ?? String(err))
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function salvar() {
    if (!nome) {
      Alert.alert("Erro", "Preencha o nome do local")
      return
    }

    const { error } = await supabase
      .from("pontos_descanso")
      .insert([
        {
          nome,
          descricao,
          tipo_local: tipoMap[tipo] || "outro",

          foto_url: foto,
          latitude: null,
          longitude: null,

          banheiro,
          chuveiro,
          restaurante,
          sinal_rede: sinalRede,
          estacionamento_caminhoes: estacionamentoCaminhoes,

          usuario_id: null,
        }
      ])

    if (error) {
      console.log(error)
      Alert.alert("Erro ao salvar", error.message)
      return
    }

    Alert.alert("Sucesso", "Ponto criado com sucesso!")
    navigation.navigate("Home")
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Criar ponto ({tipo})</Text>

      <TextInput
        placeholder="Nome do local"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        placeholder="Localização"
        placeholderTextColor="#94A3B8"
        style={styles.input}
        value={localizacao}
        onChangeText={setLocalizacao}
      />

      <Text style={styles.subtitle}>Itens disponíveis</Text>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Banheiro</Text>
        <Switch value={banheiro} onValueChange={setBanheiro} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Chuveiro</Text>
        <Switch value={chuveiro} onValueChange={setChuveiro} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Restaurante</Text>
        <Switch value={restaurante} onValueChange={setRestaurante} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Sinal de rede</Text>
        <Switch value={sinalRede} onValueChange={setSinalRede} />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Estacionamento caminhões</Text>
        <Switch value={estacionamentoCaminhoes} onValueChange={setEstacionamentoCaminhoes} />
      </View>

      {/* 📸 MÍDIA */}
      <Text style={styles.subtitle}>Mídias do local</Text>

      <TouchableOpacity
        style={styles.mediaBox}
        onPress={escolherImagem}
        disabled={enviandoFoto}
      >
        <Text style={styles.mediaIcon}>📷</Text>
        <Text style={styles.mediaText}>
          {enviandoFoto
            ? "Enviando imagem..."
            : foto
              ? "Imagem adicionada ✔"
              : "Adicionar fotos ou vídeos"}
        </Text>
      </TouchableOpacity>

      {/* PREVIEW */}
      {foto && (
        <Image
          source={{ uri: foto }}
          style={styles.previewImage}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>Salvar ponto</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 5,
  },

  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },

  subtitle: {
    color: "#DBEAFE",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    color: "#000",
    marginBottom: 12,
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
  },

  label: {
    color: "#000",
    fontWeight: "600",
  },

  mediaBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2b4369",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },

  mediaIcon: {
    fontSize: 28,
    marginBottom: 6,
  },

  mediaText: {
    color: "#000",
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#94b2f7",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    fontWeight: "800",
    color: "#111827",
  },
})