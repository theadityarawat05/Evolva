
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import RootNavigator from "./navigation/RootNavigator";
import { initializeDatabase } from "../database/sqlite";

export default function App() {
useEffect(() => {
initializeDatabase();
}, []);

return (
<NavigationContainer>
<StatusBar style="light" />
<RootNavigator />
</NavigationContainer>
);
}

