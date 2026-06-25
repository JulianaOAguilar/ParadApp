import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AvaliacaoDetalhes">;

export default function AvaliacaoDetalhhes({ route }: Props) {
  const { avaliacao } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>

        {/* USUÁRIO */}
        <Text style={styles.nome}>
          {avaliacao.usuarios?.nome ?? "Usuário"}
        </Text>

        {/* NOTA GERAL */}
        <Text style={styles.title}>
          Nota geral:
        </Text>
        <Text style={styles.stars}>
          {"★".repeat(avaliacao.nota_geral)}
          {"☆".repeat(5 - avaliacao.nota_geral)}
        </Text>

      

        {/* DETALHES */}
        <Text style={styles.title}>-- Detalhes --</Text>

          <Text style={styles.title}>
          Seguranca:
        </Text>
        <Text style={styles.stars}>
          {"★".repeat(avaliacao.nota_servico)}
          {"☆".repeat(5 - avaliacao.nota_servico)}
        </Text>

          <Text style={styles.title}>
          Limpeza:
        </Text>
        <Text style={styles.stars}>
          {"★".repeat(avaliacao.nota_limpeza)}
          {"☆".repeat(5 - avaliacao.nota_limpeza)}
        </Text>

          <Text style={styles.title}>
          Estrutura:
        </Text>
        <Text style={styles.stars}>
          {"★".repeat(avaliacao.nota_estrutura)}
          {"☆".repeat(5 - avaliacao.nota_estrutura)}
        </Text>

<Text style={styles.title}>
    Comentário (opcional):
        </Text>
          {/* COMENTÁRIO */}
         {avaliacao.comentario && (
          <Text style={styles.comentario}>
            {avaliacao.comentario}
          </Text>
        )}

        {/* IMAGEM */}
        {/* IMAGEM */}
        <Text style={styles.title}>
    Mídia:
        </Text>
{avaliacao.midia_url && (
  <Image
    source={{ uri: avaliacao.midia_url }}
    style={styles.image}
  />
)}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },

  title: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  stars: {
    color: "#F5A623", // amarelo
    fontSize: 18,
    marginTop: 6,
  },

  comentario: {
    marginTop: 12,
    fontSize: 14,
    color: "#000",
  },

  sub: {
    marginTop: 6,
    fontSize: 13,
    color: "#000",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
});