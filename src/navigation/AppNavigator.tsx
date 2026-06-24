import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import StopDetailsScreen from "../screens/StopDetailsScreen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={StopDetailsScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
       <Stack.Screen name="Details" component={StopDetailsScreen} />
    </Stack.Navigator>
  );
}