import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HomeScreen from "../screens/HomeScreen"
import StopDetailsScreen from "../screens/StopDetailsScreen"
import Authentication from "../screens/Authentication"
import Register from "../screens/Register"

export type RootStackParamList = {
  Login: undefined
  Cadastro: undefined
  Home: undefined
  Details: undefined
  
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Authentication} />
        <Stack.Screen name="Cadastro" component={Register} />
        
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={StopDetailsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}