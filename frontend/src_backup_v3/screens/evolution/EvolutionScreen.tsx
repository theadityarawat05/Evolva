
import React from "react";

import {
View,
Text,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function EvolutionScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>
Evolution Engine
</Text>

  <Text style={styles.subtitle}>
    Personal growth patterns
    will appear here.
  </Text>
</View>

);
}

const styles = StyleSheet.create({
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
fontSize: 30,
fontWeight: "700",
},

subtitle: {
color:
COLORS.textSecondary,
marginTop: 10,
},
});

