import LocalProvider
from "./LocalProvider";

import PromptBuilder
from "./PromptBuilder";

import {
  AIResponse,
  ChatMessage,
} from "./types";

export default class AIService {

  private provider =
    new LocalProvider();

  async initialize(){

    await this.provider
      .initialize();

  }

  async ask(

    history:
      ChatMessage[],

    message:
      string,

  ):Promise<AIResponse>{

    const prompt =

      PromptBuilder
      .buildPrompt(

        history,

        message,

      );

    return this.provider
      .generate(
        prompt,
      );

  }

}

