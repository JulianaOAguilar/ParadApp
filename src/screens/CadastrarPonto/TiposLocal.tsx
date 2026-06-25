import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../navigation/types"
import React from "react";
type Props = NativeStackScreenProps<RootStackParamList, "TiposLocal">

export default function NovoPontoTipos({ navigation }: Props) {

  const tipos = [
    { nome: "Posto de Combustível", icone: "⛽" },
    { nome: "Pátio de descanso (PPD)", icone: "🅿️" },
    { nome: "Restaurante", icone: "🍽️" },
    { nome: "Mecânico", icone: "🔧" },
    { nome: "Outro", icone: "📍" },
  ]

  return (

    <View style={styles.container}>
     <Text style={styles.title}>Adicionar Nova Parada</Text>

      <Text style={styles.title1}>Tipo do local</Text>
      <Text style={styles.subtitle}>Selecione o tipo que melhor representa este local:</Text>




      {tipos.map((item) => (
        <TouchableOpacity
          key={item.nome}
          style={styles.card}
          onPress={() => navigation.navigate("NovoPonto", { tipo: item.nome })}
        >
          <View style={styles.cardContent}>

            {/* ÍCONE AZUL + TEXTO */}
            <View style={styles.left}>
              <Text style={styles.icon}>{item.icone}</Text>
              <Text style={styles.cardText}>{item.nome}</Text>
            </View>

            {/* SETA FINAL */}
            <Text style={styles.arrow}>›</Text>

          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5A84E0",
    padding: 20,
  },

    subtitle: {
    color: "#ececec",
    marginTop: 10,
    marginBottom: 30,
    fontWeight: "600",
  },

  title1: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
  },

    title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 20,
    marginRight: 10,
    color: "#2563EB", // azul
  },

  cardText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },

  arrow: {
    fontSize: 22,
    color: "#2563EB",
    fontWeight: "bold",
  },
})