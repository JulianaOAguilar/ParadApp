import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { supabase } from "../services/supabase";
import { Platform } from "react-native";

const MapView = Platform.OS === "web" ? () => (
  <View style={[styles.map, { backgroundColor: "#E2E8F0", alignItems: "center", justifyContent: "center" }]}>
    <Ionicons name="map-outline" size={40} color="#94A3B8" />
    <Text style={{ color: "#94A3B8", marginTop: 8 }}>Mapa disponível no celular</Text>
  </View>
) : require("react-native-maps").default;

const Marker = Platform.OS !== "web" ? require("react-native-maps").Marker : () => null;
const Polyline = Platform.OS !== "web" ? require("react-native-maps").Polyline : () => null;

type Props = NativeStackScreenProps<RootStackParamList, "Rota">;

export default function RotaScreen({ route, navigation }: Props) {
  const { saida, destino } = route.params;

  const [paradas, setParadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const midLat = (saida.lat + destino.lat) / 2;
  const midLon = (saida.lon + destino.lon) / 2;
  const deltaLat = Math.abs(saida.lat - destino.lat) * 1.5;
  const deltaLon = Math.abs(saida.lon - destino.lon) * 1.5;

  useEffect(() => {
    buscarParadas();
  }, []);

  async function buscarParadas() {
    setLoading(true);

    // Busca todos os pontos e filtra os que estão próximos à rota
    const { data, error } = await supabase
      .from("pontos_descanso")
      .select("*, avaliacoes(nota_geral)");

    if (error || !data) {
      setLoading(false);
      return;
    }

    // Filtra pontos dentro do bounding box da rota
    const latMin = Math.min(saida.lat, destino.lat) - 0.5;
    const latMax = Math.max(saida.lat, destino.lat) + 0.5;
    const lonMin = Math.min(saida.lon, destino.lon) - 0.5;
    const lonMax = Math.max(saida.lon, destino.lon) + 0.5;

    // Calcula distância de cada ponto até a saída
    const pontosNaRota = data
      .filter((p) => {
        if (!p.latitude || !p.longitude) return false;
        return (
          p.latitude >= latMin &&
          p.latitude <= latMax &&
          p.longitude >= lonMin &&
          p.longitude <= lonMax
        );
      })
      .map((p) => {
        const notas = p.avaliacoes?.map((a: any) => a.nota_geral) || [];
        const media = notas.length > 0
          ? notas.reduce((acc: number, n: number) => acc + n, 0) / notas.length
          : 0;

        // Distância aproximada até a saída em km
        const dist = Math.round(
          Math.sqrt(
            Math.pow((p.latitude - saida.lat) * 111, 2) +
            Math.pow((p.longitude - saida.lon) * 111, 2)
          )
        );

        return { ...p, media, distancia: dist };
      })
      .sort((a, b) => a.distancia - b.distancia);

    setParadas(pontosNaRota);
    setLoading(false);
  }

  function renderStars(media: number) {
    const full = Math.round(media);
    return "⭐".repeat(full) + "☆".repeat(5 - full);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Sua Rota</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {saida.nome.split(",")[0]} → {destino.nome.split(",")[0]}
          </Text>
        </View>
        <Ionicons name="notifications-outline" size={22} color="#fff" />
      </View>

      {/* Mapa */}
      <MapView
        style={styles.map}
        region={{
          latitude: midLat,
          longitude: midLon,
          latitudeDelta: Math.max(deltaLat, 0.5),
          longitudeDelta: Math.max(deltaLon, 0.5),
        }}
      >
        {/* Marcador de saída */}
        <Marker coordinate={{ latitude: saida.lat, longitude: saida.lon }} title="Saída" />

        {/* Marcador de destino */}
        <Marker coordinate={{ latitude: destino.lat, longitude: destino.lon }} title="Destino" />

        {/* Linha da rota */}
        <Polyline
          coordinates={[
            { latitude: saida.lat, longitude: saida.lon },
            { latitude: destino.lat, longitude: destino.lon },
          ]}
          strokeColor="#1D4ED8"
          strokeWidth={3}
        />

        {/* Marcadores das paradas */}
        {paradas.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.nome}
            pinColor="#F59E0B"
          />
        ))}
      </MapView>

      {/* Lista de paradas */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Paradas encontradas na sua rota</Text>

        {loading ? (
          <ActivityIndicator color="#4A7FD4" style={{ marginTop: 20 }} />
        ) : paradas.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma parada encontrada nesta rota.</Text>
        ) : (
          <FlatList
            data={paradas}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
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
                <View style={styles.distanciaBox}>
                  <Text style={styles.distanciaTexto}>{item.distancia} km</Text>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#5A84E0",
    paddingTop: 52,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 2,
  },
  map: {
    height: 260,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -16,
    padding: 16,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  emptyText: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 10,
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
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  cardStars: {
    fontSize: 11,
    color: "#F59E0B",
    marginTop: 2,
  },
  servicosRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  servicoIcon: {
    fontSize: 13,
  },
  distanciaBox: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  distanciaTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
});