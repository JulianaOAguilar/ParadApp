import { useEffect } from "react"
import { View, Text, Button } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../navigation/AppNavigator"
import { supabase } from "../services/supabase"

type Props = NativeStackScreenProps<RootStackParamList, "Home">

export default function HomeScreen({ navigation }: Props) {

  useEffect(() => {
    testarSupabase()
  }, [])

  async function testarSupabase() {
    const { data, error } = await supabase.auth.getSession()

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🚛 Home - Paradas</Text>

      <Button
        title="Ir para Detalhes"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  )
}