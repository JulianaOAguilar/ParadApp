import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import PesquisarScreen from "../screens/PesquisarScreen";
import NovoPontoTipos from "../screens/CadastrarPonto/TiposLocal";
import InicioScreen from "../screens/InicioScreen";



const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#4A7FD4",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 8,
          position: "absolute",
          bottom: 0,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#BFDBFE",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >

      <Tab.Screen
        name="Inicio"
        component={InicioScreen as any}
        options={{
          tabBarLabel: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Feed"
        component={HomeScreen as any}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Adicionar"
        component={NovoPontoTipos as any}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Pesquisar"
        component={PesquisarScreen as any}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}