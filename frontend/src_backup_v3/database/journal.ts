
import { db } from "./sqlite";
import { JournalEntry } from "../types/journal";

export function saveJournalEntry(
entry: JournalEntry
) {
db.runSync(
"INSERT INTO journal_entries ( id, title, content, createdAt ) VALUES (?, ?, ?, ?)",
[
entry.id,
entry.title,
entry.content,
entry.createdAt,
]
);
}

export function getJournalEntries() {
return db.getAllSync(
"SELECT * FROM journal_entries ORDER BY createdAt DESC"
) as JournalEntry[];
}

