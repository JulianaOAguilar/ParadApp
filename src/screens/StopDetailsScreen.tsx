import { View, Text, Button } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../navigation/types";




type Props = NativeStackScreenProps<RootStackParamList, "Details">

export default function StopDetailsScreen({ navigation }: Props) {


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>📍 Detalhes da Parada</Text>
      <Button
        title="Voltar para Home"
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}