
import React from "react";

import {
ScrollView,
View,
Text,
StyleSheet,
} from "react-native";

import {
COLORS,
SPACING,
} from "../../constants/theme";

export default function HomeScreen() {
return (
<ScrollView
style={styles.container}
>
<View style={styles.header}>
<Text style={styles.title}>
Evolva
</Text>

    <Text style={styles.subtitle}>
      Personal Growth Operating System
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      Today's Focus
    </Text>

    <Text style={styles.cardText}>
      Continue Building Evolva
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      Active Goals
    </Text>

    <Text style={styles.cardText}>
      No goals created yet
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      Memory Status
    </Text>

    <Text style={styles.cardText}>
      Memory system ready
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.cardTitle}>
      AI Status
    </Text>

    <Text style={styles.cardText}>
      Local AI integration pending
    </Text>
  </View>
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor:
COLORS.background,
padding: SPACING.lg,
},

header: {
marginTop: 40,
marginBottom: 20,
},

title: {
color: COLORS.text,
fontSize: 36,
fontWeight: "800",
},

subtitle: {
color: COLORS.textSecondary,
marginTop: 8,
},

card: {
backgroundColor:
COLORS.surface,

padding: 18,

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
color:
COLORS.textSecondary,
},
});

