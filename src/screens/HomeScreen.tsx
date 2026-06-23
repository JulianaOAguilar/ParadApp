import { useEffect } from "react"
import { View, Text, Button } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../navigation/AppNavigator"
import { supabase } from "../services/supabase"

type Props = NativeStackScreenProps<RootStackParamList, "Home">



export default function HomeScreen({ navigation }: Props) {

  async function adicionarPonto() {
    const { data, error } = await supabase
      .from("pontos_descanso")
      .insert({
        nome: "Posto Teste Expo",
        descricao: "Ponto criado pelo app",
        tipo_local: "posto",
        foto_url: null,

        latitude: -23.5505,
        longitude: -46.6333,

        banheiro: true,
        chuveiro: true,
        restaurante: true,
        sinal_rede: true,
        estacionamento_caminhoes: true
      })

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🚛 Home - Paradas</Text>

      <Button
        title="Criar ponto teste"
        onPress={adicionarPonto}
      />

      <Button
        title="Ir para Detalhes"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  )
}