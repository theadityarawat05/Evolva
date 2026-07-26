import { initLlama, type LlamaContext } from "llama.rn";

class Runtime {
  private context: LlamaContext | null = null;
  private initialized = false;

  async init() {
    if (this.initialized && this.context) return this.context;

    this.context = await initLlama({
      model: "/storage/emulated/0/Evolva/models/qwen2.5-1.5b-instruct-q4_k_m.gguf",
      n_ctx: 4096,
      n_threads: 4,
      n_gpu_layers: 99,
      use_mmap: true,
      use_mlock: false,
      seed: -1,
    });

    this.initialized = true;
    console.log("✅ Evolva Runtime Ready");

    return this.context;
  }

  async generate(prompt: string): Promise<string> {
    if (!this.context) {
      await this.init();
    }

    const result = await this.context!.completion({
      prompt,
      temperature: 0.7,
      top_k: 40,
      top_p: 0.95,
      n_predict: 512,
      stop: ["</s>"],
    });

    return result.text;
  }

  async dispose() {
    if (!this.context) return;

    await this.context.release();
    this.context = null;
    this.initialized = false;
  }
}

export default new Runtime();
