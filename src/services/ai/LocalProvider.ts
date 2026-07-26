import { BaseAIProvider } from "./AIProvider";
import { AIHealth, AIResponse, ChatMessage, GenerationOptions } from "./types";
import Runtime from "./Runtime";
import TokenCounter from "../../utils/TokenCounter";
import StreamingController from "./StreamingController";

export default class LocalProvider extends BaseAIProvider {
  readonly type = "local" as const;
  private runtime = new Runtime();

  async initialize() {
    await this.runtime.initialize();
  }

  private formatChatML(messages: ChatMessage[]): string {
    let formatted = messages
      .map((m) => `<|im_start|>${m.role}\n${m.content}<|im_end|>`)
      .join("\n");
    return `${formatted}\n<|im_start|>assistant\n`;
  }

  async generate(
    messages: ChatMessage[],
    options?: GenerationOptions,
  ): Promise<AIResponse> {
    const context = this.runtime.getContext();
    const last = messages[messages.length - 1];
    const messageId = Date.now().toString();

    const prompt = this.formatChatML(messages);

    StreamingController.registerStream(messageId);

    const result = await context.completion(
      {
        prompt,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP ?? 0.95,
        top_k: options?.topK ?? 40,
        n_predict: options?.maxTokens ?? 512,
        stop: options?.stop ?? ["<|im_end|>", "</s>"],
      },
      (data: { token: string }) => {
        StreamingController.pushChunk(messageId, data.token);
      }
    );

    StreamingController.closeStream(messageId);

    return {
      id: messageId,
      text: result.text.trim(),
      finishReason: "stop",
      usage: TokenCounter.buildUsage(last.content, result.text),
    };
  }

  async health(): Promise<AIHealth> {
    return {
      ready: true,
      model: "Qwen2.5",
      contextSize: 4096,
    };
  }

  async dispose() {}
}
