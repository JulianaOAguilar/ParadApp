import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { supabase } from "../services/supabase";

type Props = NativeStackScreenProps<RootStackParamList, "Denuncia">;

const tipos = [
  { value: "comentario_inadequado", label: "Comentário inadequado" },
  { value: "informacao_falsa", label: "Informação falsa" },
  { value: "local_inexistente", label: "Local inexistente" },
  { value: "conteudo_ofensivo", label: "Conteúdo ofensivo" },
  { value: "spam_propaganda", label: "Spam / propaganda" },
  { value: "outro", label: "Outro" },
] as const;

export default function Denuncia({ route, navigation }: Props) {
  const { ponto, avaliacao } = route.params;

  const alvoPontoId = ponto?.id;

  const [tipo, setTipo] =
    useState<(typeof tipos)[number]["value"] | null>(null);

  const [comentario, setComentario] = useState("");

  async function enviarDenuncia() {
    if (!tipo) {
      Alert.alert("Erro", "Selecione um tipo de denúncia.");
      return;
    }

    const { error } = await supabase.from("denuncias").insert({
      ponto_id: alvoPontoId ?? null,
      tipo,
      comentario: comentario || null,
    });

    if (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar a denúncia.");
      return;
    }

    Alert.alert("Sucesso", "Denúncia enviada com sucesso!");
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Denunciar conteúdo</Text>

      <Text style={styles.subtitle}>Escolha o motivo:</Text>

      {tipos.map((t) => (
        <TouchableOpacity
          key={t.value}
          style={[
            styles.option,
            tipo === t.value && styles.optionSelected,
          ]}
          onPress={() => setTipo(t.value)}
        >
          <Text
            style={[
              styles.optionText,
              tipo === t.value && styles.optionTextSelected,
            ]}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.subtitle}>Comentário (opcional)</Text>

      <TextInput
        style={styles.input}
        placeholder="Explique melhor (opcional)"
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={enviarDenuncia}>
        <Text style={styles.buttonText}>Enviar denúncia</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F1F5F9",
    flexGrow: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    color: "#0F172A",
  },

  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "700",
    color: "#334155",
  },

  option: {
    padding: 12,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    marginBottom: 8,
  },

  optionSelected: {
    backgroundColor: "#F59E0B",
  },

  optionText: {
    color: "#1E293B",
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#111827",
    fontWeight: "800",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#DC2626",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
});