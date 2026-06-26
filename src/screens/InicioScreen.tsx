import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { supabase } from "../services/supabase";
import { useEffect } from "react";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BUSCAS_RECENTES = [
  "Itu - SP",
  "São Roque - SP",
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
];

export default function InicioScreen() {
  const navigation = useNavigation<Nav>();

  const [saida, setSaida] = useState("");
  const [destino, setDestino] = useState("");
  const [sugestoesSaida, setSugestoesSaida] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);
  const [buscandoSaida, setBuscandoSaida] = useState(false);
  const [buscandoDestino, setBuscandoDestino] = useState(false);
  const [coordSaida, setCoordSaida] = useState<{ lat: number; lon: number } | null>(null);
  const [coordDestino, setCoordDestino] = useState<{ lat: number; lon: number } | null>(null);

  const timeoutSaida = useRef<any>(null);
  const timeoutDestino = useRef<any>(null);

  async function buscarEndereco(
    texto: string,
    setSugestoes: (s: any[]) => void,
    setBuscando: (b: boolean) => void,
    timeoutRef: React.MutableRefObject<any>
  ) {
    if (texto.length < 3) { setSugestoes([]); return; }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(texto)}&format=json&limit=5&countrycodes=br`,
          { headers: { "Accept-Language": "pt-BR", "User-Agent": "ParadApp/1.0" } }
        );
        const data = await res.json();
        setSugestoes(data);
      } catch {
        setSugestoes([]);
      } finally {
        setBuscando(false);
      }
    }, 800);
  }

  const [nomeUsuario, setNomeUsuario] = useState("")
  
  
  async function fetchUsuario() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setNomeUsuario(user.user_metadata?.nome || "Usuário");
  }

  useEffect(() => {
    fetchUsuario();
  }, []);



  function buscarRota() {
    if (!coordSaida || !coordDestino) {
      return;
    }
    navigation.navigate("Rota", {
      saida: { nome: saida, ...coordSaida },
      destino: { nome: destino, ...coordDestino },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Ionicons name="menu-outline" size={26} color="#fff" />
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>

      <Text style={styles.greeting}>Olá, {nomeUsuario}! </Text>
      <Text style={styles.subtitle}>Encontre os melhores pontos de parada na sua rota.</Text>

      {/* Card de busca */}
      <View style={styles.card}>
        {/* Ponto de saída */}
        <Text style={styles.inputLabel}>Ponto de saída</Text>
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={16} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="Digite o ponto de saída"
            placeholderTextColor="#94A3B8"
            value={saida}
            onChangeText={(t) => {
              setSaida(t);
              setCoordSaida(null);
              buscarEndereco(t, setSugestoesSaida, setBuscandoSaida, timeoutSaida);
            }}
          />
          {buscandoSaida
            ? <ActivityIndicator size="small" color="#4A7FD4" />
            : <Ionicons name="search-outline" size={16} color="#94A3B8" />
          }
        </View>
        {sugestoesSaida.length > 0 && (
          <View style={styles.sugestoesBox}>
            {sugestoesSaida.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sugestaoItem}
                onPress={() => {
                  setSaida(s.display_name);
                  setCoordSaida({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
                  setSugestoesSaida([]);
                }}
              >
                <Ionicons name="location-outline" size={13} color="#2563EB" />
                <Text style={styles.sugestaoTexto} numberOfLines={2}>{s.display_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Destino */}
        <Text style={[styles.inputLabel, { marginTop: 12 }]}>Destino</Text>
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={16} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="Digite o destino"
            placeholderTextColor="#94A3B8"
            value={destino}
            onChangeText={(t) => {
              setDestino(t);
              setCoordDestino(null);
              buscarEndereco(t, setSugestoesDestino, setBuscandoDestino, timeoutDestino);
            }}
          />
          {buscandoDestino
            ? <ActivityIndicator size="small" color="#4A7FD4" />
            : <Ionicons name="search-outline" size={16} color="#94A3B8" />
          }
        </View>
        {sugestoesDestino.length > 0 && (
          <View style={styles.sugestoesBox}>
            {sugestoesDestino.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sugestaoItem}
                onPress={() => {
                  setDestino(s.display_name);
                  setCoordDestino({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
                  setSugestoesDestino([]);
                }}
              >
                <Ionicons name="location-outline" size={13} color="#2563EB" />
                <Text style={styles.sugestaoTexto} numberOfLines={2}>{s.display_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Botão buscar rota */}
        <TouchableOpacity
          style={[styles.btnBuscar, (!coordSaida || !coordDestino) && { opacity: 0.5 }]}
          onPress={buscarRota}
          disabled={!coordSaida || !coordDestino}
        >
          <Ionicons name="search-outline" size={18} color="#fff" />
          <Text style={styles.btnBuscarTexto}>Buscar rota</Text>
        </TouchableOpacity>

        {/* Buscas recentes */}
        <Text style={styles.recentesTitle}>Buscas recentes</Text>
        {BUSCAS_RECENTES.map((item) => (
          <TouchableOpacity key={item} style={styles.recenteItem}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.recenteTexto}>{item}</Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#DBEAFE",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  sugestoesBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 4,
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 8,
  },
  sugestaoTexto: {
    flex: 1,
    fontSize: 12,
    color: "#334155",
  },
  btnBuscar: {
    backgroundColor: "#1D4ED8",
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  btnBuscarTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  recentesTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginTop: 16,
    marginBottom: 8,
  },
  recenteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    gap: 10,
  },
  recenteTexto: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },
});