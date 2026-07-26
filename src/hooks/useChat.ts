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
    add({
      id: userMessageId,
      role: "user",
      content: text,
      createdAt: Date.now(),
    });

    const conversationId = "default_session_id";

    try {
      await RequestManager.execute(
        conversationId,
        text,
        {
          onStart: () => {},
          onChunk: (chunk) => {},
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
            console.error("Execution error:", err);
            setLoading(false);
          }
        },
        0
      );
    } catch (error) {
      console.error("Request failed:", error);
      setLoading(false);
    }
  }

  return {
    messages,
    loading,
    send,
  };
}
