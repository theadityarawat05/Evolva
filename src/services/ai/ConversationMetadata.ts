 import { randomUUID } from 'crypto';

export interface ConversationMetadataSnapshot { readonly id: string; readonly sessionId: string; readonly title: string; readonly summary: string; readonly tags: readonly string[]; readonly createdAt: number; readonly updatedAt: number; readonly lastMessageAt: number | null; readonly archived: boolean; readonly pinned: boolean; readonly messageCount: number; }

export class ConversationMetadata { private readonly id: string; private readonly sessionId: string;

private title: string; private summary = '';

private readonly tags = new Set<string>();

private readonly createdAt: number; private updatedAt: number; private lastMessageAt: number | null = null;

private archived = false; private pinned = false; private messageCount = 0;

constructor(sessionId: string, title: string, id?: string) { if (!sessionId.trim()) { throw new Error('Session id cannot be empty.'); }

if (!title.trim()) {
  throw new Error('Conversation title cannot be empty.');
}

const now = Date.now();

this.id = id ?? randomUUID();
this.sessionId = sessionId;
this.title = title.trim();
this.createdAt = now;
this.updatedAt = now;

}

public getId(): string { return this.id; }

public getSessionId(): string { return this.sessionId; }

public getTitle(): string { return this.title; }

public rename(title: string): void { const value = title.trim();

if (!value) {
  throw new Error('Conversation title cannot be empty.');
}

this.title = value;
this.touch();

}

public getSummary(): string { return this.summary; }

public updateSummary(summary: string): void { this.summary = summary.trim(); this.touch(); }

public addTag(tag: string): void { const value = tag.trim().toLowerCase();

if (!value) {
  return;
}

this.tags.add(value);
this.touch();

}

public removeTag(tag: string): void { if (this.tags.delete(tag.trim().toLowerCase())) { this.touch(); } }

public getTags(): readonly string[] { return Array.from(this.tags.values()).sort(); }

public incrementMessageCount(): void { this.messageCount += 1; this.lastMessageAt = Date.now(); this.touch(); }

public decrementMessageCount(): void { if (this.messageCount > 0) { this.messageCount -= 1; this.touch(); } }

public pin(): void { if (!this.pinned) { this.pinned = true; this.touch(); } }

public unpin(): void { if (this.pinned) { this.pinned = false; this.touch(); } }

public archive(): void { if (!this.archived) { this.archived = true; this.touch(); } }

public restore(): void { if (this.archived) { this.archived = false; this.touch(); } }

public export(): ConversationMetadataSnapshot { return { id: this.id, sessionId: this.sessionId, title: this.title, summary: this.summary, tags: this.getTags(), createdAt: this.createdAt, updatedAt: this.updatedAt, lastMessageAt: this.lastMessageAt, archived: this.archived, pinned: this.pinned, messageCount: this.messageCount, }; }

private touch(): void { this.updatedAt = Date.now(); } } 