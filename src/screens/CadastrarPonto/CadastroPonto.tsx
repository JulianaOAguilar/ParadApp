import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { supabase } from "../../services/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "NovoPonto">;

const tipoMap: any = {
  "Posto de combustível": "posto",
  "Pátio de descanso (PPD)": "patio",
  Restaurante: "restaurante",
  Mecânico: "mecanico",
  Outro: "outro",
};

const switchItems = [
  { label: "Banheiro", icone: "people-outline", key: "banheiro" },
  { label: "Chuveiro", icone: "water-outline", key: "chuveiro" },
  { label: "Restaurante", icone: "restaurant-outline", key: "restaurante" },
  { label: "Sinal de rede", icone: "cellular-outline", key: "sinalRede" },
  { label: "Estacionamento para caminhões", icone: "bus-outline", key: "estacionamento" },
];

export default function CreatePointScreen({ route, navigation }: Props) {
  const { tipo } = route.params;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [banheiro, setBanheiro] = useState(false);
  const [chuveiro, setChuveiro] = useState(false);
  const [restaurante, setRestaurante] = useState(false);
  const [sinalRede, setSinalRede] = useState(false);
  const [estacionamentoCaminhoes, setEstacionamentoCaminhoes] = useState(false);
  const [fotos, setFotos] = useState<string[]>([]);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lon: number } | null>(null);

  const switchValues: any = { banheiro, chuveiro, restaurante, sinalRede, estacionamento: estacionamentoCaminhoes };
  const switchSetters: any = {
    banheiro: setBanheiro,
    chuveiro: setChuveiro,
    restaurante: setRestaurante,
    sinalRede: setSinalRede,
    estacionamento: setEstacionamentoCaminhoes,
  };

  const timeoutRef = React.useRef<any>(null);

  async function buscarEndereco(texto: string) {
    setLocalizacao(texto);
    setCoordenadas(null);
    if (texto.length < 3) { setSugestoes([]); return; }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setBuscandoEndereco(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json&limit=5&countrycodes=br`,
          { headers: { "Accept-Language": "pt-BR", "User-Agent": "ParadApp/1.0" } }
        );
        const data = await response.json();
        setSugestoes(data);
      } catch {
        setSugestoes([]);
      } finally {
        setBuscandoEndereco(false);
      }
    }, 800);
  }

  async function escolherImagem() {
    if (fotos.length >= 5) {
      Alert.alert("Limite atingido", "Máximo de 5 fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    const ext = (file.uri.split(".").pop() || "jpg").toLowerCase();
    const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;
    const fileName = `pontos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    setEnviandoFoto(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = decode(base64);

      const { error } = await supabase.storage
        .from("foto-ponto")
        .upload(fileName, arrayBuffer, { contentType: mimeType, upsert: false });

      if (error) {
        Alert.alert("Erro ao enviar imagem", error.message);
        return;
      }

      const { data } = supabase.storage.from("foto-ponto").getPublicUrl(fileName);
      setFotos([...fotos, data.publicUrl]);
    } catch (err: any) {
      Alert.alert("Erro inesperado", err?.message ?? String(err));
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function salvar() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }

    if (!nome) {
      Alert.alert("Erro", "Preencha o nome do local");
      return;
    }

    const { error } = await supabase.from("pontos_descanso").insert([{
      nome,
      descricao,
      tipo_local: tipoMap[tipo] || "outro",
      localizacao,
      foto_url: fotos.length > 0 ? fotos[0] : null,
      banheiro,
      chuveiro,
      restaurante,
      sinal_rede: sinalRede,
      estacionamento_caminhoes: estacionamentoCaminhoes,
      usuario_id: user.id,
      latitude: coordenadas?.lat ?? null,   // 👈 salva coordenadas
      longitude: coordenadas?.lon ?? null,  // 👈 salva coordenadas
    }]);

    if (error) {
      Alert.alert("Erro ao salvar", error.message);
      return;
    }

    Alert.alert("Sucesso", "Ponto criado com sucesso!");
    navigation.navigate("Home");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.header}>Adicionar nova parada</Text>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressAtivo} />
            <View style={styles.progressAtivo} />
            <Text style={styles.progressTexto}>2/2</Text>
          </View>

          {/* Card branco */}
          <View style={styles.card}>
            {/* Nome */}
            <TextInput
              placeholder="Nome do local"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />

            {/* Localização */}
            <View style={{ zIndex: 10 }}>
              <View style={styles.inputRow}>
                <Ionicons name="location-outline" size={18} color="#94A3B8" />
                <TextInput
                  placeholder="Digite o endereço..."
                  placeholderTextColor="#94A3B8"
                  style={styles.inputFlex}
                  value={localizacao}
                  onChangeText={buscarEndereco}
                />
                {buscandoEndereco && (
                  <Ionicons name="hourglass-outline" size={16} color="#94A3B8" />
                )}
              </View>
              {sugestoes.length > 0 && (
                <View style={styles.sugestoesBox}>
                  {sugestoes.map((s, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.sugestaoItem}
                      onPress={() => {
                        setLocalizacao(s.display_name);
                        setCoordenadas({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) }); // 👈 salva coords
                        setSugestoes([]);
                      }}
                    >
                      <Ionicons name="location-outline" size={14} color="#2563EB" />
                      <Text style={styles.sugestaoTexto} numberOfLines={2}>{s.display_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Estrutura disponível */}
            <Text style={styles.sectionTitle}>Estrutura disponível</Text>
            <Text style={styles.sectionSubtitle}>Selecione os itens disponíveis no local</Text>

            {switchItems.map((item) => (
              <View key={item.key} style={styles.switchRow}>
                <View style={styles.switchLeft}>
                  <Ionicons name={item.icone as any} size={20} color="#2563EB" style={{ marginRight: 10 }} />
                  <Text style={styles.switchLabel}>{item.label}</Text>
                </View>
                <Switch
                  value={switchValues[item.key]}
                  onValueChange={(v) => switchSetters[item.key](v)}
                  trackColor={{ false: "#CBD5E1", true: "#2563EB" }}
                  thumbColor="#fff"
                />
              </View>
            ))}

            {/* Fotos */}
            <Text style={styles.sectionTitle}>Fotos do local</Text>
            <View style={styles.fotosRow}>
              {fotos.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.fotoPreview} />
              ))}
              {fotos.length < 5 && (
                <TouchableOpacity style={styles.adicionarFotoBtn} onPress={escolherImagem} disabled={enviandoFoto}>
                  <Ionicons name="camera-outline" size={24} color="#2563EB" />
                  <Text style={styles.adicionarFotoTexto}>
                    {enviandoFoto ? "Enviando..." : `Adicionar fotos\n(${fotos.length}/5)`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Descrição */}
            <Text style={styles.sectionTitle}>Descrição do local</Text>
            <TextInput
              placeholder="Conte mais sobre este local..."
              placeholderTextColor="#94A3B8"
              style={styles.textArea}
              value={descricao}
              onChangeText={(t) => t.length <= 250 && setDescricao(t)}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.contador}>{descricao.length}/250</Text>
          </View>

          {/* Botão */}
          <TouchableOpacity style={styles.button} onPress={salvar}>
            <Text style={styles.buttonText}>Enviar cadastro</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  progressAtivo: {
    flex: 1,
    height: 6,
    backgroundColor: "#1D4ED8",
    borderRadius: 10,
  },
  progressTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 14,
    borderRadius: 10,
    color: "#000",
    marginBottom: 12,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  switchLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLabel: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  fotosRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  fotoPreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  adicionarFotoBtn: {
    width: 120,
    height: 72,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  adicionarFotoTexto: {
    fontSize: 11,
    color: "#2563EB",
    textAlign: "center",
    marginTop: 2,
  },
  textArea: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    height: 100,
    marginTop: 8,
  },
  contador: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "right",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4A7FD4",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontWeight: "700",
    color: "#fff",
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 4,
    gap: 8,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  sugestoesBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sugestaoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 8,
  },
  sugestaoTexto: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
  },
});