
import { create } from "zustand";

import { Memory } from "../types/memory";

interface MemoryState {
memories: Memory[];

addMemory: (
memory: Memory
) => void;

clearMemories: () => void;
}

export const useMemoryStore =
create<MemoryState>((set) => ({
memories: [],

addMemory: (memory) =>
  set((state) => ({
    memories: [
      memory,
      ...state.memories,
    ],
  })),

clearMemories: () =>
  set({
    memories: [],
  }),

}));

