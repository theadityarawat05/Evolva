export const RUNTIME_CONFIG = Object.freeze({
  AUTO_INITIALIZE: true,

  ENABLE_STREAMING: true,

  ENABLE_LOGGING: true,

  ENABLE_MEMORY: false,

  ENABLE_REASONING: true,

  MAX_CONVERSATION_MESSAGES: 20,

  MAX_RETRY_COUNT: 2,

  INITIALIZATION_TIMEOUT_MS: 30000,
} as const);

export type RuntimeConfig = typeof RUNTIME_CONFIG;

