
import { db } from "./sqlite";
import { Memory } from "../types/memory";

export function saveMemory(
memory: Memory
) {
db.runSync(
"INSERT INTO memories ( id, content, category, createdAt ) VALUES (?, ?, ?, ?)",
[
memory.id,
memory.content,
memory.category,
memory.createdAt,
]
);
}

export function getMemories() {
return db.getAllSync(
"SELECT * FROM memories ORDER BY createdAt DESC"
) as Memory[];
}
