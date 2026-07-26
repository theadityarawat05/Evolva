
import { db } from "./sqlite";
import { Message } from "../types/message";

export function saveMessage(
message: Message
) {
db.runSync(
"INSERT INTO messages ( id, content, role, createdAt ) VALUES (?, ?, ?, ?)",
[
message.id,
message.content,
message.role,
message.createdAt,
]
);
}

export function getMessages() {
return db.getAllSync(
"SELECT * FROM messages ORDER BY createdAt ASC"
) as Message[];
}

