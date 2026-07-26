
import React, {
useState,
} from "react";

import {
View,
Text,
FlatList,
TextInput,
TouchableOpacity,
StyleSheet,
} from "react-native";

import {
COLORS,
} from "../../constants/theme";

export default function ChatScreen() {
const [messages, setMessages] =
useState<any[]>([]);

const [input, setInput] =
useState("");

function handleSend() {
if (!input.trim()) return;

const userMessage = {
  id: Date.now().toString(),
  role: "user",
  content: input,
};

setMessages((prev) => [
  ...prev,
  userMessage,
]);

setInput("");

}

return (
<View style={styles.container}>
<FlatList
data={messages}
keyExtractor={(item) =>
item.id
}
renderItem={({ item }) => (
<View style={styles.message}>
<Text
style={styles.messageText}
>
{item.content}
</Text>
</View>
)}
/>

  <View style={styles.inputRow}>
    <TextInput
      value={input}
      onChangeText={setInput}
      placeholder="Message Evolva..."
      placeholderTextColor="#777"
      style={styles.input}
    />

    <TouchableOpacity
      style={styles.button}
      onPress={handleSend}
    >
      <Text
        style={styles.buttonText}
      >
        Send
      </Text>
    </TouchableOpacity>
  </View>
</View>

);
}

const styles =
StyleSheet.create({
container: {
flex: 1,
backgroundColor:
COLORS.background,
},

message: {
  backgroundColor:
    COLORS.surface,

  margin: 10,

  padding: 12,

  borderRadius: 12,
},

messageText: {
  color: COLORS.text,
},

inputRow: {
  flexDirection: "row",
  padding: 12,
},

input: {
  flex: 1,

  backgroundColor:
    COLORS.surface,

  color: COLORS.text,

  borderRadius: 12,

  paddingHorizontal: 12,
},

button: {
  marginLeft: 10,

  backgroundColor:
    COLORS.primary,

  paddingHorizontal: 18,

  justifyContent: "center",

  borderRadius: 12,
},

buttonText: {
  color: "#fff",
  fontWeight: "700",
},

});

