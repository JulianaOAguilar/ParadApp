import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "../screens/HomeScreen"
import StopDetailsScreen from "../screens/StopDetailsScreen"

export type RootStackParamList = {
  Home: undefined
  Details: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={StopDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}