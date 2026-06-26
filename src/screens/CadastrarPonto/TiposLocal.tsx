import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "TiposLocal">;

const tipos = [
  { nome: "Posto de combustível", icone: "car-sport-outline" },
  { nome: "Pátio de descanso (PPD)", icone: "cube-outline" },
  { nome: "Restaurante", icone: "restaurant-outline" },
  { nome: "Mecânico", icone: "construct-outline" },
  { nome: "Outro", icone: "ellipsis-horizontal-outline" },
];

export default function NovoPontoTipos({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Adicionar nova parada</Text>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressAtivo} />
        <View style={styles.progressInativo} />
        <Text style={styles.progressTexto}>1/2</Text>
      </View>

      {/* Título */}
      <Text style={styles.title}>Tipo do local</Text>
      <Text style={styles.subtitle}>
        Selecione o tipo que melhor representa este local:
      </Text>

      {/* Cards */}
      {tipos.map((item) => (
        <TouchableOpacity
          key={item.nome}
          style={styles.card}
          onPress={() => navigation.navigate("NovoPonto", { tipo: item.nome })}
        >
          <View style={styles.cardLeft}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icone as any} size={22} color="#2563EB" />
            </View>
            <Text style={styles.cardText}>{item.nome}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#2563EB" />
        </TouchableOpacity>
      ))}
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
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  progressAtivo: {
    flex: 1,
    height: 6,
    backgroundColor: "#1D4ED8",
    borderRadius: 10,
  },
  progressInativo: {
    flex: 1,
    height: 6,
    backgroundColor: "#93C5FD",
    borderRadius: 10,
  },
  progressTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#DBEAFE",
    fontSize: 13,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});