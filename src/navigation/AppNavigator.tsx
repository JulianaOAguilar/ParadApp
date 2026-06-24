import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import StopDetailsScreen from "../screens/StopDetailsScreen";
import Authentication from "../screens/Authentication";
import Register from "../screens/Register";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Authentication} />
      <Stack.Screen name="Cadastro" component={Register} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={StopDetailsScreen} />
    </Stack.Navigator>
  );
}