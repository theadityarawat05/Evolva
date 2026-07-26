import {
  ChatMessage,
} from "../services/ai/types";

export default class ContextWindow {

  static trim(
    messages: ChatMessage[],
    maxMessages: number,
  ): ChatMessage[] {

    if (
      messages.length <=
      maxMessages
    ) {
      return messages;
    }

    return messages.slice(
      messages.length -
        maxMessages,
    );

  }

}

