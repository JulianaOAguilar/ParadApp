import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native"
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/types"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"

type Props = NativeStackScreenProps<RootStackParamList, "Home">

export default function HomeScreen({ navigation }: Props) {
  const [pontos, setPontos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchPontos() {
    setLoading(true)

    const { data, error } = await supabase
      .from("pontos_descanso")
      .select("*")
      .order("criado_em", { ascending: false })

    if (error) {
      console.log("Erro ao buscar pontos:", error.message)
      setLoading(false)
      return
    }

    setPontos(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPontos()
  }, [])

  return (
    <View style={styles.container}>

      {/* TOP BAR */}
      <View style={styles.topBar}>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("TiposLocal")}
        >
          <Text style={styles.addText}>+ Novo Ponto</Text>
        </TouchableOpacity>

      </View>

      {/* HEADER */}
      <Text style={styles.title}>Olá!</Text>
      <Text style={styles.subtitle}>
        Encontre os melhores pontos de parada na sua rota!
      </Text>

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />
      ) : pontos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum ponto cadastrado 😴</Text>
        </View>
      ) : (
        <FlatList
          data={pontos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>

              {/* MÍDIA */}
              {item.foto_url ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.foto_url }}
                    style={styles.image}
                  />
                </View>
              ) : null}

              {/* NOME */}
              <Text style={styles.cardTitle}>{item.nome}</Text>

              {/* DESCRIÇÃO */}
              <Text style={styles.cardText}>
                {item.descricao || "Sem descrição"}
              </Text>

              {/* LOCALIZAÇÃO */}
              <Text style={styles.cardTextSmall}>
                📍 {item.localizacao || "Local não informado"}
              </Text>

              {/* TIPO */}
              <Text style={styles.cardTextSmall}>
                🚛 Tipo: {item.tipo_local}
              </Text>

            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 20,
  },

  // TOP BAR
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },

  addButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  addText: {
    color: "#111827",
    fontWeight: "800",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F9FAFB",
  },

  subtitle: {
    color: "#d7d7d7",
    marginTop: 4,
    marginBottom: 20,
  },

  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },

  // CARD
  card: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardTitle: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  cardText: {
    color: "#94A3B8",
    marginTop: 4,
  },

  cardTextSmall: {
    color: "#CBD5E1",
    fontSize: 12,
    marginTop: 4,
  },

  // IMAGEM
  imageContainer: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },
})