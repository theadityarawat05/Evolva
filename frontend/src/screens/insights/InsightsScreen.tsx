
import React from "react";

import {
View,
Text,
StyleSheet,
ScrollView,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function InsightsScreen() {
return (
<ScrollView style={styles.container}>
<Text style={styles.title}>
Insights
</Text>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      Growth Patterns
    </Text>

    <Text style={styles.cardText}>
      No insights generated yet.
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      Habits
    </Text>

    <Text style={styles.cardText}>
      Waiting for activity data.
    </Text>
  </View>
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
padding: 16,
},

title: {
color: COLORS.text,
fontSize: 32,
fontWeight: "800",
marginBottom: 20,
},

card: {
backgroundColor: COLORS.surface,
padding: 16,
borderRadius: 16,
marginBottom: 16,
},

cardTitle: {
color: COLORS.text,
fontSize: 18,
fontWeight: "700",
marginBottom: 8,
},

cardText: {
color: COLORS.textSecondary,
},
});

