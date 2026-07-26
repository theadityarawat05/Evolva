import { useState } from "react";
import { useChatStore } from "../stores/chatStore";
import RequestManager from "../services/ai/RequestManager";

export default function useChat() {
  const { messages, add } = useChatStore();
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    if (!text.trim()) return;
    setLoading(true);

    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      role: "user" as const,
      content: text,
      createdAt: Date.now(),
    };
    add(userMessage);

    // Use a fixed conversation container ID for the session runtime context
    const conversationId = "default_conversation";

    try {
      await RequestManager.execute(
        conversationId,
        text,
        {
          onStart: (messageId) => {
            // Placeholder can be used to prepare UI components if needed
          },
          onChunk: (chunk) => {
            // Logic to append streaming token deltas dynamically onto chat stores can go here
          },
          onComplete: (response) => {
            add({
              id: response.id,
              role: "assistant",
              content: response.text,
              createdAt: Date.now(),
            });
            setLoading(false);
          },
          onError: (err) => {
            console.error("Inference Error:", err);
            setLoading(false);
          }
        },
        0 // Priority setting for transaction queues
      );
    } catch (error) {
      console.error("Execution failed:", error);
      setLoading(false);
    }
  }

  return {
    messages,
    loading,
    send,
  };
}
