import {
  BaseAIProvider,
} from "./AIProvider";

import {
  AIHealth,
  AIResponse,
  ChatMessage,
  GenerationOptions,
} from "./types";

import Runtime
from "./Runtime";

import TokenCounter
from "../../utils/TokenCounter";

export default class LocalProvider
extends BaseAIProvider {

  readonly type = "local" as const;

  private runtime =
    new Runtime();

  async initialize() {

    await this.runtime
      .initialize();

  }

  async generate(

    messages:
      ChatMessage[],

    options?:
      GenerationOptions,

  ): Promise<AIResponse> {

    const context =
      this.runtime
      .getContext();

    const result =
      await context
      .completion({

        messages,

        temperature:
          options?.temperature ??
          0.7,

        top_p:
          options?.topP ??
          0.95,

        top_k:
          options?.topK ??
          40,

        n_predict:
          options?.maxTokens ??
          512,

        stop:
          options?.stop ??
          ["</s>"],

      });

    const last =
      messages[
        messages.length-1
      ];

    return {

      id:
        Date.now()
        .toString(),

      text:
        result.text,

      finishReason:
        "stop",

      usage:
        TokenCounter
        .buildUsage(

          last.content,

          result.text,

        ),

    };

  }

  async health():
    Promise<AIHealth>{

    return{

      ready:true,

      model:
      "Qwen2.5",

      contextSize:
      4096,

    };

  }

  async dispose(){

  }

}

