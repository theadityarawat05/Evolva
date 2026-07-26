import { TokenUsage } from "../services/ai/types";

export default class TokenCounter {

  static estimateTokens(
    text: string,
  ): number {

    if (!text.trim()) {
      return 0;
    }

    return Math.ceil(
      text.length / 4,
    );

  }

  static buildUsage(
    prompt: string,
    completion: string,
  ): TokenUsage {

    const promptTokens =
      this.estimateTokens(prompt);

    const completionTokens =
      this.estimateTokens(completion);

    return {

      prompt: promptTokens,

      completion: completionTokens,

      total:
        promptTokens +
        completionTokens,

    };

  }

}

