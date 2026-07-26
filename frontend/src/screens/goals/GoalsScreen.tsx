
import React from "react";

import {
View,
Text,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function GoalsScreen() {
return (
<View style={styles.container}>
<Text style={styles.title}>
Goals
</Text>

  <Text style={styles.subtitle}>
    Track personal growth goals.
  </Text>
</View>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
justifyContent: "center",
alignItems: "center",
},

title: {
color: COLORS.text,
fontSize: 28,
fontWeight: "700",
},

subtitle: {
color: COLORS.textSecondary,
marginTop: 10,
},
});

