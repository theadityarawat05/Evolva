export const AI_CONFIG = Object.freeze({
  MODEL_PATH:
    "/storage/emulated/0/Evolva/models/qwen2.5-1.5b-instruct-q4_k_m.gguf",

  MODEL_NAME: "Qwen2.5-1.5B-Instruct",

  CONTEXT_SIZE: 4096,

  THREADS: 4,

  GPU_LAYERS: 99,

  TEMPERATURE: 0.7,

  TOP_P: 0.95,

  TOP_K: 40,

  MAX_TOKENS: 512,

  STOP: ["</s>"],

  USE_MMAP: true,

  USE_MLOCK: false,
} as const);

export type AIConfig = typeof AI_CONFIG;

