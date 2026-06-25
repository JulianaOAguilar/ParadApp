import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

const PESQUISAS_FREQUENTES = [
  "Restaurantes",
  "Postos de gasolina",
  "Rio de Janeiro",
  "Banheiros",
  "Wifi",
];

const SERVICOS_FILTRO = [
  "Banheiro",
  "Chuveiro",
  "Restaurante",
  "Sinal de rede",
  "Estacionamento para caminhões",
];
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function PesquisarScreen() {
  const navigation = useNavigation<Nav>();

  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pesquisasAnteriores, setPesquisasAnteriores] = useState<any[]>([]);
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [ordenacao, setOrdenacao] = useState<"mais_proximo" | "melhor_avaliado" | null>(null);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [kmMin, setKmMin] = useState("");
  const [kmMax, setKmMax] = useState("");

  useEffect(() => {
    buscarPontos("");
  }, []);

 async function buscarPontos(texto: string, servicos: string[] = servicosSelecionados) {
    setLoading(true);
    let query = supabase
        .from("pontos_descanso")
        .select("*, avaliacoes(nota_geral)");

    if (texto.trim()) {
        query = query.ilike("nome", `%${texto}%`);
    }

    // Filtro de serviços
    if (servicos.includes("Banheiro")) query = query.eq("banheiro", true);
    if (servicos.includes("Chuveiro")) query = query.eq("chuveiro", true);
    if (servicos.includes("Restaurante")) query = query.eq("restaurante", true);
    if (servicos.includes("Sinal de rede")) query = query.eq("sinal_rede", true);
    if (servicos.includes("Estacionamento para caminhões")) query = query.eq("estacionamento_caminhoes", true);

    const { data, error } = await query;

    if (error) {
        setLoading(false);
        return;
    }

    const comMedia = (data || []).map((ponto) => {
        const notas = ponto.avaliacoes?.map((a: any) => a.nota_geral) || [];
        const media =
        notas.length > 0
            ? notas.reduce((acc: number, n: number) => acc + n, 0) / notas.length
            : 0;
        return { ...ponto, media };
    });

    setResultados(comMedia);
    setLoading(false);
 }

  function toggleServico(servico: string) {
    setServicosSelecionados((prev) =>
      prev.includes(servico)
        ? prev.filter((s) => s !== servico)
        : [...prev, servico]
    );
  }

  function renderStars(media: number) {
    const full = Math.round(media);
    return "⭐".repeat(full) + "☆".repeat(5 - full);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Pesquisar</Text>

      {/* Barra de busca */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise um lugar ou uma cidade"
            placeholderTextColor="#94A3B8"
            value={busca}
            onChangeText={(t) => {
              setBusca(t);
              buscarPontos(t);
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFiltroVisivel(true)}
        >
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Pesquisas frequentes */}
        <Text style={styles.sectionTitle}>Pesquisas frequentes</Text>
        <View style={styles.tagsRow}>
          {PESQUISAS_FREQUENTES.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.tagChip}
              onPress={() => {
                setBusca(item);
                buscarPontos(item);
              }}
            >
              <Text style={styles.tagChipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resultados / Pesquisas anteriores */}
        <Text style={styles.sectionTitle}>
          {busca.trim() ? "Resultados" : "Pesquisas anteriores"}
        </Text>

        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
        ) : resultados.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum resultado encontrado.</Text>
        ) : (
          resultados.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate("Details", { ponto: item })}
            >
              {item.foto_url ? (
                <Image source={{ uri: item.foto_url }} style={styles.cardImage} />
              ) : (
                <View style={[styles.cardImage, { backgroundColor: "#CBD5E1" }]} />
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardLocation}>{item.localizacao}</Text>
                <Text style={styles.cardStars}>
                  {renderStars(item.media)} {item.media > 0 ? item.media.toFixed(1) : ""}
                </Text>
                <View style={styles.servicosRow}>
                  {item.banheiro && <Text style={styles.servicoIcon}>🚻</Text>}
                  {item.restaurante && <Text style={styles.servicoIcon}>🍽️</Text>}
                  {item.estacionamento_caminhoes && <Text style={styles.servicoIcon}>🅿️</Text>}
                  {item.sinal_rede && <Text style={styles.servicoIcon}>📶</Text>}
                  {item.chuveiro && <Text style={styles.servicoIcon}>🚿</Text>}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Modal de Filtros */}
      <Modal visible={filtroVisivel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🔍 filtros</Text>
                <TouchableOpacity onPress={() => setFiltroVisivel(false)}>
                <Ionicons name="close" size={22} color="#111" />
                </TouchableOpacity>
            </View>

            {/* Ordenação */}
            <View style={styles.ordemRow}>
                {["mais_proximo", "melhor_avaliado"].map((op) => (
                <TouchableOpacity
                    key={op}
                    style={[styles.ordemChip, ordenacao === op && styles.ordemChipAtivo]}
                    onPress={() => setOrdenacao(op as any)}
                >
                    <Text style={styles.ordemChipText}>
                    {op === "mais_proximo" ? "mais próximo" : "melhor avaliado"}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>

            {/* Distância */}
            <Text style={styles.filtroLabel}>Filtrar por distância</Text>
            <View style={styles.distanciaRow}>
                <TextInput
                style={styles.distanciaInput}
                placeholder="km min"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={kmMin}
                onChangeText={setKmMin}
                />
                <Text style={{ color: "#64748B", marginHorizontal: 8 }}>-</Text>
                <TextInput
                style={styles.distanciaInput}
                placeholder="km max"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={kmMax}
                onChangeText={setKmMax}
                />
            </View>

            {/* Serviços */}
            <Text style={styles.filtroLabel}>Serviços:</Text>
            <View style={styles.tagsRow}>
                {SERVICOS_FILTRO.map((s) => (
                <TouchableOpacity
                    key={s}
                    style={[styles.tagChip, servicosSelecionados.includes(s) && styles.tagChipAtivo]}
                    onPress={() => toggleServico(s)}
                >
                    <Text style={[styles.tagChipText, servicosSelecionados.includes(s) && { color: "#fff" }]}>
                    {s}
                    </Text>
                </TouchableOpacity>
                ))}
            </View>

            {/* Botão aplicar */}
            <TouchableOpacity
                style={{ backgroundColor: "#4A7FD4", borderRadius: 20, paddingVertical: 12, alignItems: "center", marginTop: 8 }}
                onPress={() => {
                    setFiltroVisivel(false);
                    buscarPontos(busca, servicosSelecionados);
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Aplicar filtros</Text>
            </TouchableOpacity>

            </View>
        </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A7FD4",
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  filterBtn: {
    backgroundColor: "#3B6FBF",
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  tagChipAtivo: {
    backgroundColor: "#3B6FBF",
  },
  tagChipText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "#BFDBFE",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  cardLocation: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  cardStars: {
    fontSize: 12,
    color: "#F59E0B",
    marginTop: 2,
  },
  servicosRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  servicoIcon: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  ordemRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  ordemChip: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ordemChipAtivo: {
    backgroundColor: "#4A7FD4",
    borderColor: "#4A7FD4",
  },
  ordemChipText: {
    fontSize: 12,
    color: "#334155",
  },
  filtroLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  distanciaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  distanciaInput: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: "#111",
    width: 80,
  },
});