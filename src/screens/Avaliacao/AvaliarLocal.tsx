import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../services/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy"
import { decode } from "base64-arraybuffer"

type Props = NativeStackScreenProps<RootStackParamList, "AvaliarLocal">;

// Componente de estrelas reutilizável
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Ionicons
            name={star <= value ? "star" : "star-outline"}
            size={28}
            color="#F5A623"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AvaliarLocal({ route, navigation }: Props) {
  const { ponto } = route.params;

  const [avaliacaoGeral, setAvaliacaoGeral] = useState(0);
  const [seguranca, setSeguranca] = useState(0);
  const [limpeza, setLimpeza] = useState(0);
  const [estrutura, setEstrutura] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAdicionarFoto() {
    if (fotos.length >= 5) {
        Alert.alert("Limite atingido", "Você pode adicionar no máximo 5 fotos.");
        return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permissão negada", "Precisamos de acesso à sua galeria.");
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
    const fileName = `avaliacoes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    try {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
        });
        const arrayBuffer = decode(base64);

        const { error } = await supabase.storage
        .from("foto-ponto")
        .upload(fileName, arrayBuffer, {
            contentType: mimeType,
            upsert: false,
        });

        if (error) {
        Alert.alert("Erro ao enviar imagem", error.message);
        return;
        }

        const { data } = supabase.storage.from("foto-ponto").getPublicUrl(fileName);
        setFotos([...fotos, data.publicUrl]);

    } catch (err: any) {
        Alert.alert("Erro inesperado", err?.message ?? String(err));
    }
    }

  async function handleEnviar() {
    if (avaliacaoGeral === 0) {
        Alert.alert("Atenção", "Por favor, dê uma avaliação geral ao local.");
        return;
    }

    setLoading(true);
    try {
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError || !userData?.user) {
        Alert.alert("Erro", "Você precisa estar logado para avaliar.");
        setLoading(false);
        return;
        }

        // Busca o id do usuário na tabela 'usuarios' pelo email
        const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("email", userData.user.email)
        .single();

        if (usuarioError || !usuarioData) {
        Alert.alert("Erro", "Usuário não encontrado.");
        setLoading(false);
        return;
        }

        const { error } = await supabase.from("avaliacoes").insert({
        ponto_id: ponto.id,
        usuario_id: usuarioData.id,
        nota_geral: avaliacaoGeral,
        nota_servico: seguranca,
        nota_limpeza: limpeza,
        nota_estrutura: estrutura,
        comentario,
        midia_url: fotos.length > 0 ? fotos[0] : null,
        });

        if (error) throw error;

        Alert.alert("Sucesso!", "Avaliação enviada com sucesso.", [
        { text: "OK", onPress: () => navigation.goBack() },
        ]);
    } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível enviar a avaliação.");
    } finally {
        setLoading(false);
    }
    }

  return (
    <View style={styles.container}>
      {/* Header */}
      {/*
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Avaliar local</Text>
        <View style={{ width: 24 }} />
      </View> 
      */}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card do local */}
        <View style={styles.card}>
          {/* Info do ponto */}
          <View style={styles.pontoInfo}>
            <Image
              source={
                ponto.foto_url
                  ? { uri: ponto.foto_url }
                  : require("../../../assets/image.png")
              }
              style={styles.pontoImagem}
            />
            <View style={styles.pontoTextos}>
              <Text style={styles.pontoNome}>{ponto.nome}</Text>
              <Text style={styles.pontoEndereco}>{ponto.endereco}</Text>
            </View>
          </View>

          {/* Avaliação geral */}
          <Text style={styles.label}>Avaliação geral</Text>
          <StarRating value={avaliacaoGeral} onChange={setAvaliacaoGeral} />

          {/* Avaliação por aspectos */}
          <Text style={styles.labelSecao}>Avaliação dos aspectos do local</Text>

          <View style={styles.aspectoRow}>
            <Text style={styles.aspectoLabel}>Segurança</Text>
            <StarRating value={seguranca} onChange={setSeguranca} />
          </View>

          <View style={styles.aspectoRow}>
            <Text style={styles.aspectoLabel}>Limpeza</Text>
            <StarRating value={limpeza} onChange={setLimpeza} />
          </View>

          <View style={styles.aspectoRow}>
            <Text style={styles.aspectoLabel}>Estrutura</Text>
            <StarRating value={estrutura} onChange={setEstrutura} />
          </View>

          {/* Fotos */}
          <Text style={styles.label}>Fotos do local (opcional)</Text>
          <View style={styles.fotosRow}>
            {fotos.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.fotoPreview} />
            ))}
            {fotos.length < 5 && (
              <TouchableOpacity
                style={styles.adicionarFotoBtn}
                onPress={handleAdicionarFoto}
              >
                <Ionicons name="camera-outline" size={28} color="#4A7FD4" />
                <Text style={styles.adicionarFotoTexto}>
                  Adicionar fotos{"\n"}({fotos.length}/5)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Comentário */}
          <Text style={styles.label}>Comentário (opcional)</Text>
          <TextInput
            style={styles.comentarioInput}
            placeholder="Descreva o motivo da denúncia..."
            placeholderTextColor="#aaa"
            multiline
            maxLength={250}
            value={comentario}
            onChangeText={setComentario}
          />
          <Text style={styles.contador}>{comentario.length}/250</Text>
        </View>

        {/* Botão enviar */}
        <TouchableOpacity
          style={styles.btnEnviar}
          onPress={handleEnviar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnEnviarTexto}>Enviar avaliação</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EDF2",
  },
  header: {
    backgroundColor: "#4A7FD4",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pontoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pontoImagem: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  pontoTextos: {
    flex: 1,
  },
  pontoNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  pontoEndereco: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 6,
  },
  labelSecao: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
  },
  aspectoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  aspectoLabel: {
    fontSize: 14,
    color: "#444",
    width: 90,
  },
  fotosRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  fotoPreview: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  adicionarFotoBtn: {
    width: 100,
    height: 72,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#4A7FD4",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  adicionarFotoTexto: {
    fontSize: 11,
    color: "#4A7FD4",
    textAlign: "center",
    marginTop: 2,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    height: 100,
    textAlignVertical: "top",
  },
  contador: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "right",
    marginTop: 4,
  },
  btnEnviar: {
    backgroundColor: "#4A7FD4",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  btnEnviarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});