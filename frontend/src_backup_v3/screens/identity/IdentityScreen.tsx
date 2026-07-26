
import React from "react";

import {
ScrollView,
View,
Text,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function IdentityScreen() {
return (
<ScrollView
style={styles.container}
>
<Text style={styles.title}>
Identity
</Text>

  <View style={styles.card}>
    <Text style={styles.label}>
      Mission
    </Text>

    <Text style={styles.value}>
      Not Defined
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.label}>
      Values
    </Text>

    <Text style={styles.value}>
      No Values Yet
    </Text>
  </View>

  <View style={styles.card}>
    <Text style={styles.label}>
      Interests
    </Text>

    <Text style={styles.value}>
      No Interests Yet
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
padding: 16,
},

title: {
color: COLORS.text,
fontSize: 32,
fontWeight: "800",
marginBottom: 20,
},

card: {
backgroundColor:
COLORS.surface,
padding: 16,
borderRadius: 16,
marginBottom: 16,
},

label: {
color:
COLORS.textSecondary,
marginBottom: 8,
},

value: {
color: COLORS.text,
fontSize: 16,
},
});

