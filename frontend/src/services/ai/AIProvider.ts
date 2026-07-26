import {
  AIHealth,
  AIProvider,
  AIResponse,
  ChatMessage,
  GenerationOptions,
} from "./types";

export abstract class BaseAIProvider
implements AIProvider {

  abstract readonly type:
    "local" | "remote";

  abstract initialize():
    Promise<void>;

  abstract generate(
    messages: ChatMessage[],
    options?: GenerationOptions,
  ): Promise<AIResponse>;

  abstract health():
    Promise<AIHealth>;

  abstract dispose():
    Promise<void>;

}

