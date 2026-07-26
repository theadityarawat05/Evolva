import Runtime from "./Runtime";

class LocalProvider {
  async initialize() {
    return Runtime.init();
  }

  async generate(prompt: string): Promise<string> {
    return Runtime.generate(prompt);
  }

  async dispose() {
    return Runtime.dispose();
  }
}

export default new LocalProvider();
