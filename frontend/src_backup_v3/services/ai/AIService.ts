import LocalProvider from "./LocalProvider";

export async function askAI(message: string): Promise<string> {
  await LocalProvider.initialize();
  return await LocalProvider.generate(message);
}
