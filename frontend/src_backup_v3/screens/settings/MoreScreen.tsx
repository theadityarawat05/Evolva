
import React from "react";

import {
ScrollView,
Text,
TouchableOpacity,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

const items = [
"Memory",
"Goals",
"Timeline",
"Insights",
"Identity",
"Settings",
];

export default function MoreScreen() {
return (
<ScrollView style={styles.container}>
<Text style={styles.header}>
More
</Text>

  {items.map((item) => (
    <TouchableOpacity
      key={item}
      style={styles.item}
    >
      <Text style={styles.itemText}>
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: COLORS.background,
padding: 20,
},

header: {
color: COLORS.text,
fontSize: 32,
fontWeight: "800",
marginBottom: 20,
},

item: {
backgroundColor: COLORS.surface,
padding: 18,
borderRadius: 14,
marginBottom: 14,
},

itemText: {
color: COLORS.text,
fontSize: 16,
fontWeight: "600",
},
});

