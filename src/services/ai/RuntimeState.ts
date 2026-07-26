export enum RuntimeStatus {
  IDLE = "IDLE",
  INITIALIZING = "INITIALIZING",
  READY = "READY",
  GENERATING = "GENERATING",
  ERROR = "ERROR",
  DISPOSED = "DISPOSED",
}

export interface RuntimeMetrics {
  loadTime: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  generationTime: number;
}

export interface RuntimeState {

  status: RuntimeStatus;

  initialized: boolean;

  modelLoaded: boolean;

  currentModel?: string;

  metrics: RuntimeMetrics;

}

export const DEFAULT_RUNTIME_STATE: RuntimeState = {

  status: RuntimeStatus.IDLE,

  initialized: false,

  modelLoaded: false,

  currentModel: undefined,

  metrics: {

    loadTime: 0,

    promptTokens: 0,

    completionTokens: 0,

    totalTokens: 0,

    generationTime: 0,

  },

};

