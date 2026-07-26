import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Core Pipeline Entrypoint Active. System Memory Offline. Input layer open.", sender: 'system' }
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble, 
              item.sender === 'user' ? styles.userBubble : styles.systemBubble
            ]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Log raw perspective..."
            placeholderTextColor={theme.colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  chatList: { padding: theme.spacing.md, gap: theme.spacing.sm },
  messageBubble: { padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, maxWidth: '85%' },
  userBubble: { backgroundColor: theme.colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: theme.borderRadius.xs },
  systemBubble: { backgroundColor: theme.colors.surface, alignSelf: 'flex-start', borderWidth: 1, borderColor: theme.colors.border, borderBottomLeftRadius: theme.borderRadius.xs },
  messageText: { color: theme.colors.text, fontSize: 16, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  input: { flex: 1, backgroundColor: theme.colors.background, color: theme.colors.text, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.md, marginRight: theme.spacing.sm, fontSize: 16, maxHeight: 100 },
  sendButton: { backgroundColor: theme.colors.secondary, justifyContent: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.md },
  sendButtonText: { color: theme.colors.text, fontWeight: 'bold' }
});
