export type AIProviderType = "local" | "remote";

export type MessageRole =
  | "system"
  | "user"
  | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface GenerationOptions {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxTokens?: number;
  stop?: string[];
  stream?: boolean;
}

export interface TokenUsage {
  prompt: number;
  completion: number;
  total: number;
}

export interface AIResponse {
  id: string;
  text: string;
  usage?: TokenUsage;
  finishReason: "stop" | "length" | "cancelled" | "error";
}

export interface AIHealth {
  ready: boolean;
  model: string;
  contextSize: number;
}

export interface AIProvider {
  readonly type: AIProviderType;

  initialize(): Promise<void>;

  generate(
    messages: ChatMessage[],
    options?: GenerationOptions,
  ): Promise<AIResponse>;

  health(): Promise<AIHealth>;

  dispose(): Promise<void>;
}

