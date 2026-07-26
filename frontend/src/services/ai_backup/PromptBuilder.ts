import {
  ChatMessage,
} from "./types";

import PromptTemplates
from "./PromptTemplates";

export default class PromptBuilder {

  static buildPrompt(
    history: ChatMessage[],
    message: string,
  ): ChatMessage[] {

    return PromptTemplates.build(
      history,
      message,
    );

  }

}

