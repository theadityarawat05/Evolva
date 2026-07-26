 import { randomUUID } from 'crypto'; import { Conversation } from './Conversation';

export interface SessionSnapshot { readonly id: string; readonly createdAt: number; readonly updatedAt: number; readonly activeConversationId: string | null; readonly conversationIds: readonly string[]; }

export class Session { private readonly id: string; private readonly createdAt: number; private updatedAt: number;

private readonly conversations = new Map<string, Conversation>(); private activeConversationId: string | null = null;

constructor(id?: string) { const now = Date.now();

this.id = id ?? randomUUID();
this.createdAt = now;
this.updatedAt = now;

}

public getId(): string { return this.id; }

public createConversation(title = 'New Conversation'): Conversation { const conversation = new Conversation(title);

this.conversations.set(conversation.getId(), conversation);

this.activeConversationId = conversation.getId();

this.touch();

return conversation;

}

public addConversation(conversation: Conversation): void { const id = conversation.getId();

if (this.conversations.has(id)) {
  throw new Error(`Conversation "${id}" already exists.`);
}

this.conversations.set(id, conversation);

if (this.activeConversationId === null) {
  this.activeConversationId = id;
}

this.touch();

}

public getConversation(id: string): Conversation { const conversation = this.conversations.get(id);

if (!conversation) {
  throw new Error(`Conversation "${id}" not found.`);
}

return conversation;

}

public getActiveConversation(): Conversation | null { if (!this.activeConversationId) { return null; }

return this.getConversation(this.activeConversationId);

}

public setActiveConversation(id: string): void { if (!this.conversations.has(id)) { throw new Error(Conversation "${id}" not found.); }

this.activeConversationId = id;

this.touch();

}

public removeConversation(id: string): void { if (!this.conversations.delete(id)) { return; }

if (this.activeConversationId === id) {
  const next = this.conversations.keys().next();

  this.activeConversationId = next.done ? null : next.value;
}

this.touch();

}

public hasConversation(id: string): boolean { return this.conversations.has(id); }

public getConversations(): readonly Conversation[] { return Array.from(this.conversations.values()); }

public getConversationCount(): number { return this.conversations.size; }

public clear(): void { this.conversations.clear(); this.activeConversationId = null;

this.touch();

}

public export(): SessionSnapshot { return { id: this.id, createdAt: this.createdAt, updatedAt: this.updatedAt, activeConversationId: this.activeConversationId, conversationIds: Array.from(this.conversations.keys()), }; }

private touch(): void { this.updatedAt = Date.now(); } }
 