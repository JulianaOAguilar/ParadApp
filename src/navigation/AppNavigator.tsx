import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";

import { RootStackParamList } from "./types";
import ForgotPassword from "../screens/ForgotPassword";
import NewPassword from "../screens/NewPassword";

import Authentication from "../screens/autentication/Authentication";
import Register from "../screens/autentication/Register";
import CadastroPonto from "../screens/CadastrarPonto/CadastroPonto";
import NovoPontoTipos from "../screens/CadastrarPonto/TiposLocal";
import StopDetailsScreen from "../screens/StopDetailsScreen";
import AvaliarLocal from "../screens/Avaliacao/AvaliarLocal";
import AvaliacaoDetalhhes from "../screens/Avaliacao/AvaliacoesDetails";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Authentication} />
      <Stack.Screen name="Cadastro" component={Register} />
      <Stack.Screen name="Esquecer" component={ForgotPassword} />
      <Stack.Screen name="Redefinir" component={NewPassword} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TiposLocal" component={NovoPontoTipos} />
      <Stack.Screen name="NovoPonto" component={CadastroPonto} />
      <Stack.Screen name="Details" component={StopDetailsScreen} />
      <Stack.Screen name="AvaliarLocal" component={AvaliarLocal} />
            <Stack.Screen name="AvaliacaoDetalhes" component={AvaliacaoDetalhhes} />


  
      
      
  
    </Stack.Navigator>
  );
}