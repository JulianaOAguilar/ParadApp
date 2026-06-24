import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import StopDetailsScreen from "../screens/StopDetailsScreen";
import Authentication from "../screens/Authentication";
import Register from "../screens/Register";
import { RootStackParamList } from "./types";
import ForgotPassword from "../screens/ForgotPassword";
import NewPassword from "../screens/NewPassword";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Authentication} />
      <Stack.Screen name="Cadastro" component={Register} />
      <Stack.Screen name="Esquecer" component={ForgotPassword} />
      <Stack.Screen name="Redefinir" component={NewPassword} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={StopDetailsScreen} />
    </Stack.Navigator>
  );
}