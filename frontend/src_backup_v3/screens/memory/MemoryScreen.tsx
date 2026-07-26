
import React from "react";

import {
View,
Text,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function MemoryScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>
Memory Explorer
</Text>

  <Text style={styles.subtitle}>
    Memory storage ready
  </Text>
</View>

);
}

const styles =
StyleSheet.create({
container: {
flex: 1,
backgroundColor:
COLORS.background,

  justifyContent:
    "center",

  alignItems:
    "center",
},

title: {
  color: COLORS.text,
  fontSize: 28,
  fontWeight: "700",
},

subtitle: {
  color:
    COLORS.textSecondary,

  marginTop: 10,
},

});

