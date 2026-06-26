
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Ionicons } from "@expo/vector-icons";
type Props = NativeStackScreenProps<RootStackParamList, "Home">;


export default function HomeScreen({ navigation }: Props) {
  const [pontos, setPontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPontos() {
  setLoading(true);

  const { data, error } = await supabase
    .from("pontos_descanso")
    .select(`
      *,
      avaliacoes(nota_geral)
    `);

  if (error) {
    console.log("Erro ao buscar pontos:", error.message);
    setLoading(false);
    return;
  }

  const pontosComMedia = (data || []).map((ponto) => {
    const notas = ponto.avaliacoes?.map((a: any) => a.nota_geral) || [];

    const media =
      notas.length > 0
        ? notas.reduce((acc: number, n: number) => acc + n, 0) / notas.length
        : 0;

    return {
      ...ponto,
      media,
    };
  });

  setPontos(pontosComMedia);
  setLoading(false);
}
  

  useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    fetchPontos();
    fetchUsuario();
  });

  return unsubscribe;
}, [navigation]);

const [nomeUsuario, setNomeUsuario] = useState("")


async function fetchUsuario() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  setNomeUsuario(user.user_metadata?.nome || "Usuário")
}

function renderStars(media: number) {
  const fullStars = Math.round(media); // arredonda média

  return "⭐".repeat(fullStars) + "☆".repeat(5 - fullStars);
}




  return (
    
     <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="menu-outline" size={26} color="#fff" />
        <Text style={styles.feedTitle}>Feed</Text>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>
    {/* HEADER */}
    {/*}
    <Text style={styles.title}>
      Olá, {nomeUsuario}!
    </Text>

    <Text style={styles.subtitle}>
      Encontre os melhores pontos de parada na sua rota!
    </Text> */}

h

    {/* CARD PRINCIPAL */}
    <View style={styles.feedContainer}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#5A84E0"
          style={{ marginTop: 40 }}
        />
      ) : pontos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Nenhum ponto cadastrado 😴
          </Text>
        </View>
      ) : (
        <FlatList
          data={pontos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("Details", {
                  ponto: item,
                })
              }
            >
              <View style={styles.cardContent}>
                {item.foto_url ? (
                  <Image
                    source={{ uri: item.foto_url }}
                    style={styles.cardImage}
                  />
                ) : null}

                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {item.nome}
                  </Text>


                  <Text style={styles.cardStars}>
  {renderStars(item.media)}
</Text>
 
                  <Text style={styles.cardLocation}>
                    📍 Local: {item.localizacao || "Não informado"}
                  </Text>

                </View>
              </View>

              <View style={styles.tagsContainer}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    Tipo: {item.tipo_local}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>


    {/* FOOTER */}
    {/*}
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.logoutText}>
          Sair
        </Text>
      </TouchableOpacity>
    </View>*/}
  </View> 
     );
}const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 20,
    paddingTop: 50,
  },

    headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },



  subtitle: {
    color: "#E5E7EB",
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
  },

  feedTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },

  feedContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 12,
    paddingBottom: 80,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  cardContent: {
    flexDirection: "row",
  },

  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },

  cardTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },

  cardDescription: {
    color: "#475569",
    marginTop: 4,
  },

    cardStars: {
    color: "#475569",
    marginTop: 4,
    fontSize: 10
  },

  cardLocation: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  tag: {
  backgroundColor: "#DBEAFE",
  borderWidth: 1,
  borderColor: "#93C5FD",
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 8,
  alignSelf: "flex-start",
},

tagText: {
  color: "#1D4ED8",
  fontSize: 12,
  fontWeight: "700",
},

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingBottom: 10,
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  addButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  addText: {
    color: "#111827",
    fontWeight: "800",
  },
});