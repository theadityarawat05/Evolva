export interface RegisteredModel {

  id: string;

  name: string;

  path: string;

  contextSize: number;

  gpuLayers: number;

  enabled: boolean;

}

export default class ModelRegistry {

  private static readonly models:
    RegisteredModel[] = [

    {
      id: "qwen2.5-1.5b",

      name: "Qwen2.5-1.5B-Instruct",

      path:
        "/storage/emulated/0/Evolva/models/qwen2.5-1.5b-instruct-q4_k_m.gguf",

      contextSize: 4096,

      gpuLayers: 99,

      enabled: true,
    },

  ];

  static getDefault(): RegisteredModel {

    const model =
      this.models.find(
        m => m.enabled,
      );

    if (!model) {
      throw new Error(
        "No active model registered.",
      );
    }

    return model;

  }

  static list() {

    return this.models;

  }

}

