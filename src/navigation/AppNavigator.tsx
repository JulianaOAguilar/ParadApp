import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

import { RootStackParamList } from "./types";

import Authentication from "../screens/autentication/Authentication";
import Register from "../screens/autentication/Register";
import StopDetailsScreen from "../screens/StopDetailsScreen";
import CadastroPonto from "../screens/CadastrarPonto/CadastroPonto";
import NovoPontoTipos from "../screens/CadastrarPonto/TiposLocal";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Authentication} />
      <Stack.Screen name="Cadastro" component={Register} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={StopDetailsScreen} />
      <Stack.Screen name="TiposLocal" component={NovoPontoTipos} />
      <Stack.Screen name="NovoPonto" component={CadastroPonto} />

      
      
  
    </Stack.Navigator>
  );
}