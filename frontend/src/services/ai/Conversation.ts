 import { randomUUID } from 'crypto';

export type ConversationRole = 'system' | 'user' | 'assistant' | 'tool';

export type MessageStatus = | 'pending' | 'streaming' | 'completed' | 'failed' | 'cancelled';

export interface ConversationMessage { readonly id: string; readonly role: ConversationRole; content: string; status: MessageStatus; tokenCount: number; readonly createdAt: number; updatedAt: number; metadata: Readonly<Record<string, unknown>>; }

export interface ConversationSnapshot { readonly id: string; readonly title: string; readonly createdAt: number; readonly updatedAt: number; readonly messages: readonly ConversationMessage[]; readonly promptTokens: number; readonly completionTokens: number; readonly totalTokens: number; }

export class Conversation { private readonly id: string; private title: string; private readonly createdAt: number; private updatedAt: number; private readonly messages: ConversationMessage[] = [];

private promptTokens = 0; private completionTokens = 0;

constructor(title = 'New Conversation', id?: string) { const now = Date.now();

this.id = id ?? randomUUID();
this.title = title.trim() || 'New Conversation';
this.createdAt = now;
this.updatedAt = now;

}

public getId(): string { return this.id; }

public getTitle(): string { return this.title; }

public rename(title: string): void { const value = title.trim();

if (!value) {
  throw new Error('Conversation title cannot be empty.');
}

this.title = value;
this.touch();

}

public getMessages(): readonly ConversationMessage[] { return this.messages; }

public append( role: ConversationRole, content: string, tokenCount = 0, metadata: Record<string, unknown> = {}, ): ConversationMessage { const now = Date.now();

const message: ConversationMessage = {
  id: randomUUID(),
  role,
  content,
  status: 'completed',
  tokenCount,
  createdAt: now,
  updatedAt: now,
  metadata,
};

this.messages.push(message);

if (role === 'assistant') {
  this.completionTokens += tokenCount;
} else {
  this.promptTokens += tokenCount;
}

this.touch();

return message;

}

public beginStreaming(): ConversationMessage { const now = Date.now();

const message: ConversationMessage = {
  id: randomUUID(),
  role: 'assistant',
  content: '',
  status: 'streaming',
  tokenCount: 0,
  createdAt: now,
  updatedAt: now,
  metadata: {},
};

this.messages.push(message);
this.touch();

return message;

}

public streamChunk(messageId: string, chunk: string): void { const message = this.find(messageId);

if (message.status !== 'streaming') {
  throw new Error('Message is not streaming.');
}

message.content += chunk;
message.updatedAt = Date.now();

this.touch();

}

public finishStreaming( messageId: string, tokenCount: number, ): ConversationMessage { const message = this.find(messageId);

message.status = 'completed';
message.tokenCount = tokenCount;
message.updatedAt = Date.now();

this.completionTokens += tokenCount;

this.touch();

return message;

}

public failMessage(messageId: string): void { const message = this.find(messageId);

message.status = 'failed';
message.updatedAt = Date.now();

this.touch();

}

public removeMessage(messageId: string): void { const index = this.messages.findIndex(m => m.id === messageId);

if (index < 0) {
  return;
}

this.messages.splice(index, 1);

this.touch();

}

public clear(): void { this.messages.length = 0; this.promptTokens = 0; this.completionTokens = 0;

this.touch();

}

public export(): ConversationSnapshot { return { id: this.id, title: this.title, createdAt: this.createdAt, updatedAt: this.updatedAt, messages: this.messages.map(message => ({ ...message, metadata: { ...message.metadata }, })), promptTokens: this.promptTokens, completionTokens: this.completionTokens, totalTokens: this.promptTokens + this.completionTokens, }; }

private find(messageId: string): ConversationMessage { const message = this.messages.find(m => m.id === messageId);

if (!message) {
  throw new Error(`Message "${messageId}" not found.`);
}

return message;

}

private touch(): void { this.updatedAt = Date.now(); } }
 