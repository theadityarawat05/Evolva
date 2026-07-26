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

  async generate(
    messages: ChatMessage[],
    options?: GenerationOptions,
  ): Promise<AIResponse> {
    const context = this.runtime.getContext();
    const last = messages[messages.length - 1];
    const messageId = Date.now().toString();

    // Trigger the streaming start event
    StreamingController.registerStream(messageId);

    const result = await context.completion(
      {
        messages,
        temperature: options?.temperature ?? 0.7,
        top_p: options?.topP ?? 0.95,
        top_k: options?.topK ?? 40,
        n_predict: options?.maxTokens ?? 512,
        stop: options?.stop ?? ["</s>"],
      },
      (data: { token: string }) => {
        // Push every token chunk straight to the streaming controller
        StreamingController.pushChunk(messageId, data.token);
      }
    );

    // Safely close the stream channel when done
    StreamingController.closeStream(messageId);

    return {
      id: messageId,
      text: result.text,
      finishReason: "stop",
      usage: TokenCounter.buildUsage(last.content, result.text),
    };
  }

  async health(): Promise<AIHealth> {
    return {
      ready: true,
      model: "Qwen2.5",
      contextSize: 4048,
    };
  }

  async dispose() {
    // Cleanup hooks
  }
}
