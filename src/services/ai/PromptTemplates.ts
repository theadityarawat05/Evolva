import { ChatMessage } from "./types";
import { SYSTEM_PROMPT } from "./SystemPrompt";

export default class PromptTemplates {

  static build(
    history: ChatMessage[],
    userMessage: string,
  ): ChatMessage[] {

    return [

      {
        id: "system",
        role: "system",
        content: SYSTEM_PROMPT,
        createdAt: Date.now(),
      },

      ...history,

      {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        createdAt: Date.now(),
      },

    ];

  }

}

