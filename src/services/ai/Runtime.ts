import {
  initLlama,
  type LlamaContext,
} from "llama.rn";

import {
  AI_CONFIG,
} from "../../config/ai";

import Logger
from "../../utils/Logger";

import ModelManager
from "./ModelManager";

import {
  RuntimeStatus,
} from "./RuntimeState";

export default class Runtime {

  private context:
    LlamaContext | null = null;

  private status =
    RuntimeStatus.IDLE;

  private modelManager =
    new ModelManager();

  async initialize() {

    if (
      this.context
    ) {

      return;

    }

    this.status =
      RuntimeStatus.INITIALIZING;

    await this.modelManager
      .initialize();

    const model =
      this.modelManager
      .getModel();

    Logger.info(
      "Loading model..."
    );

    this.context =
      await initLlama({

        model: model.path,

        n_ctx:
          AI_CONFIG.CONTEXT_SIZE,

        n_threads:
          AI_CONFIG.THREADS,

        n_gpu_layers:
          AI_CONFIG.GPU_LAYERS,

        use_mmap:
          AI_CONFIG.USE_MMAP,

        use_mlock:
          AI_CONFIG.USE_MLOCK,

      });

    this.status =
      RuntimeStatus.READY;

    Logger.info(
      "Runtime Ready."
    );

  }

  getContext() {

    if (
      !this.context
    ) {

      throw new Error(
        "Runtime not initialized."
      );

    }

    return this.context;

  }

  getStatus() {

    return this.status;

  }

}

