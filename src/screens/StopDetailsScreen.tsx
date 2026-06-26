import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

export default function StopDetailsScreen({ route, navigation }: Props) {
  const { ponto } = route.params;
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      buscarAvaliacoes();
    });
    return unsubscribe;
  }, [navigation]);

  async function buscarAvaliacoes() {
    const { data } = await supabase
      .from("avaliacoes")
      .select("*, usuarios(nome)")
      .eq("ponto_id", ponto.id)
      .order("criado_em", { ascending: false });
    if (data) setAvaliacoes(data);
  }

  const totalAvaliacoes = avaliacoes.length;
  const mediaGeral =
    totalAvaliacoes > 0
      ? (avaliacoes.reduce((acc, av) => acc + av.nota_geral, 0) / totalAvaliacoes).toFixed(1)
      : "0.0";

  const servicos = [
    { label: "Banheiro", icone: "people-outline", ativo: ponto.banheiro },
    { label: "Chuveiro", icone: "water-outline", ativo: ponto.chuveiro },
    { label: "Alimentação", icone: "restaurant-outline", ativo: ponto.restaurante },
    { label: "Sinal", icone: "cellular-outline", ativo: ponto.sinal_rede },
    { label: "Estacionamento", icone: "bus-outline", ativo: ponto.estacionamento_caminhoes },
  ].filter((s) => s.ativo);

  return (
    <View style={styles.container}>
      {/* Header azul */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{ponto.nome}</Text>
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => navigation.navigate("Denuncia", { ponto })}
        >
          <Text style={styles.reportText}>⚠️ Denunciar</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Foto */}
        {ponto.foto_url && (
          <Image source={{ uri: ponto.foto_url }} style={styles.image} />
        )}

        {/* Card branco */}
        <View style={styles.card}>
          {/* Descrição */}
          {ponto.descricao ? (
            <Text style={styles.description}>{ponto.descricao}</Text>
          ) : null}

          {/* Localização */}
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <Text style={styles.infoText}>{ponto.localizacao}</Text>
          </View>

          {/* Tipo */}
          <View style={styles.tag}>
            <Text style={styles.tagText}>Tipo: {ponto.tipo_local}</Text>
          </View>

          {/* Serviços */}
          <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
          <View style={styles.servicesContainer}>
            {servicos.map((s) => (
              <View key={s.label} style={styles.serviceTag}>
                <Ionicons name={s.icone as any} size={14} color="#334155" />
                <Text style={styles.serviceText}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Avaliações */}
          <View style={styles.ratingHeader}>
            <View>
              <Text style={styles.sectionTitle}>Avaliações</Text>
              <Text style={styles.rating}>
                ⭐ {mediaGeral} ({totalAvaliacoes} avaliações)
              </Text>
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate("AvaliarLocal", { ponto })}
            >
              <Text style={styles.reviewButtonText}>+ Avaliar</Text>
            </TouchableOpacity>
          </View>

          {/* Cards de avaliação */}
          {avaliacoes.length === 0 ? (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewPlaceholder}>Nenhuma avaliação ainda.</Text>
            </View>
          ) : (
            avaliacoes.map((av) => (
              <View key={av.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person-outline" size={16} color="#4A7FD4" />
                  </View>
                  <Text style={styles.reviewNome}>{av.usuarios?.nome ?? "Usuário"}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Denuncia", { ponto })}
                    style={{ marginLeft: "auto" }}
                  >
                    <Ionicons name="warning-outline" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.reviewStars}>
                  {"★".repeat(av.nota_geral)}{"☆".repeat(5 - av.nota_geral)}
                </Text>

                {av.comentario ? (
                  <Text style={styles.reviewPlaceholder}>{av.comentario}</Text>
                ) : null}

                {av.midia_url ? (
                  <Image
                    source={{ uri: av.midia_url }}
                    style={styles.reviewImage}
                  />
                ) : null}

                <TouchableOpacity
                  style={styles.verDetalhesBtn}
                  onPress={() => navigation.navigate("AvaliacaoDetalhes", { avaliacao: av })}
                >
                  <Text style={styles.verDetalhesText}>Ver detalhes</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  reportBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reportText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 11,
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 240,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 20,
    minHeight: 400,
  },
  description: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  infoText: {
    color: "#64748B",
    fontSize: 14,
  },
  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 20,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  serviceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  serviceText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 12,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rating: {
    color: "#F59E0B",
    fontSize: 15,
    fontWeight: "700",
  },
  reviewButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 13,
  },
  reviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewNome: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 14,
  },
  reviewStars: {
    color: "#F59E0B",
    fontSize: 18,
    marginBottom: 4,
  },
  reviewPlaceholder: {
    color: "#64748B",
    fontSize: 13,
  },
  reviewImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginTop: 8,
  },
  verDetalhesBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#93C5FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verDetalhesText: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 12,
  },
});