
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/home/HomeScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import MemoryScreen from "../screens/memory/MemoryScreen";
import JournalScreen from "../screens/journal/JournalScreen";
import MoreScreen from "../screens/settings/MoreScreen";

import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();

export default function RootNavigator() {
return (
<Tab.Navigator
screenOptions={{
headerShown: false,

    tabBarStyle: {
      backgroundColor: COLORS.surface,
      borderTopColor: COLORS.border,
      height: 70,
    },

    tabBarActiveTintColor:
      COLORS.primary,

    tabBarInactiveTintColor:
      COLORS.textSecondary,
  }}
>
  <Tab.Screen
    name="Home"
    component={HomeScreen}
  />

  <Tab.Screen
    name="Chat"
    component={ChatScreen}
  />

  <Tab.Screen
    name="Memory"
    component={MemoryScreen}
  />

  <Tab.Screen
    name="Journal"
    component={JournalScreen}
  />

  <Tab.Screen
    name="More"
    component={MoreScreen}
  />
</Tab.Navigator>

);
}

