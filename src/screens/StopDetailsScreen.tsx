import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import React from "react";

type Props = NativeStackScreenProps<RootStackParamList, "details">;

export default function StopDetailsScreen({ route }: Props) {
  const { ponto } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {ponto.foto_url && (
          <Image source={{ uri: ponto.foto_url }} style={styles.image} />
        )}

        <Text style={styles.title}>{ponto.nome}</Text>

 
        <Text style={styles.description}>{ponto.descricao}</Text>

    

        <Text style={styles.info}>📍 {ponto.localizacao}</Text>

               <View style={styles.tag}>
          <Text style={styles.tagText}>Tipo: {ponto.tipo_local}</Text>
        </View>


        {/* SERVIÇOS */}
        <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>

        <View style={styles.servicesContainer}>
          {ponto.banheiro && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>🚻 Banheiro</Text>
            </View>
          )}

          {ponto.chuveiro && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>🚿 Chuveiro</Text>
            </View>
          )}

          {ponto.sinal_rede && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>📶 Sinal</Text>
            </View>
          )}

          {ponto.estacionamento_caminhoes && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceText}>🅿️ Estacionamento</Text>
            </View>
          )}
        </View>

        {/* AVALIAÇÕES */}
        <View style={styles.ratingHeader}>
          <View>
            <Text style={styles.sectionTitle}>Avaliações</Text>

            <Text style={styles.rating}>⭐⭐⭐⭐⭐ 5.0</Text>
          </View>

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              Alert.alert(
                "Implementar",
                "Funcionalidade de avaliações será implementada em breve.",
              )
            }
          >
            <Text style={styles.reviewButtonText}>+ Avaliar</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço para avaliações futuras */}
        <View style={styles.reviewCard}>
          <Text style={styles.reviewPlaceholder}>Nenhuma avaliação ainda.</Text>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewPlaceholder}>
            Espaço reservado para avaliações futuras.
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 16,
  },

  reviewButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  reviewButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 13,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  description: {
    color: "#475569",
    marginTop: 12,
    lineHeight: 22,
  },

  info: {
    color: "#64748B",
    marginTop: 10,
    marginBottom: 15,
  },

  tag: {
    alignSelf: "flex-start",
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },

  tagText: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 20,
  },

  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  serviceTag: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
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
    fontSize: 18,
    fontWeight: "700",
  },

  reviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  reviewPlaceholder: {
    color: "#64748B",
  },
});
