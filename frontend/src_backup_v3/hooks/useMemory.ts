
import {
useState,
useEffect,
} from "react";

import { Memory } from "../types/memory";

import {
getMemories,
saveMemory,
} from "../database/memories";

export function useMemory() {
const [memories, setMemories] =
useState<Memory[]>([]);

useEffect(() => {
loadMemories();
}, []);

function loadMemories() {
setMemories(
getMemories()
);
}

function addMemory(
content: string
) {
const memory: Memory = {
id: Date.now().toString(),
content,
category: "general",
createdAt: Date.now(),
};

saveMemory(memory);

setMemories((prev) => [
  memory,
  ...prev,
]);

}

return {
memories,
addMemory,
loadMemories,
};
}

