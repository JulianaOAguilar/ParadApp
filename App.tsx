import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from "./src/navigation/AppNavigator"

import { useFonts } from "expo-font"
import { ProtestStrike_400Regular } from "@expo-google-fonts/protest-strike"

export default function App() {
  const [fontsLoaded] = useFonts({
    ProtestStrike: ProtestStrike_400Regular,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
}