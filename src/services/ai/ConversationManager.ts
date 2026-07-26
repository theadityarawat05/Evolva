import { Conversation } from './Conversation';
import { Session } from './Session';
import { ConversationMetadata } from './ConversationMetadata';
import { MessageQueue, Queueltem } from './MessageQueue';
import TokenCounter from '../../utils/TokenCounter';
import Logger from '../../utils/Logger';
export interface GenerationTask {
conversationId: string;
userMessage: string;
systemPromptOverride?: string;
}
export class ConversationManager {
private activeSession: Session | null = null;
private metadataRegistry: Map<string, ConversationMetadata> = new Map();
private executionQueue: MessageQueue<GenerationTask>;
private isInitialized = false;
constructor(maxRetries = 2) {
this.executionQueue = new MessageQueue<GenerationTask>({
maxRetries,
autoStart: true,
});
}
/**
Initializes the manager with an active runtime session, syncing metadata.
*/
public initialize(session: Session): void {
this.activeSession = session;
this.metadataRegistry.clear();
// Reconstruct structural metadata representations for active tracking
for (const conversation of session.getConversations()) {
const metadata = new ConversationMetadata(
session.getId(),
conversation.getTitle(),
conversation.getId()
);
this.metadataRegistry.set(conversation.getId(), metadata);
}
this.isInitialized = true;
Logger.info(ConversationManager fully orchestrated for session: ${session.getId()});
}
/**
Submits a user message context to a conversation, tracking state and queue mechanics.
*/
public async submitPrompt(conversationId: string, text: string, priority = 0): Promise<string> {
this.ensureInitialized();
if (!this.activeSession || !this.activeSession.hasConversation(conversationId)) {
throw new Error(Target conversation context "${conversationId}" does not exist in the active session.);
}
const conversation = this.activeSession.getConversation(conversationId);
const metadata = this.metadataRegistry.get(conversationId);
// 1. Immediately log the structural user message to local state for UX responsiveness
const rawTokens = TokenCounter.estimateTokens(text);
conversation.append('user', text, rawTokens);
if (metadata) {
metadata.incrementMessageCount();
}
// 2. Wrap transaction and slide into execution queue pipeline
const task: GenerationTask = {
conversationId,
userMessage: text,
};
const queueItem = this.executionQueue.enqueue(task, priority);
Logger.debug(Prompt submitted and queued. Task ID: ${queueItem.id}, Priority: ${priority});
return queueItem.id;
}
/**
Registers a callback handler processing the low-level queue inference tasks.
*/
public registerProcessor(processor: (task: GenerationTask) => Promise<void>): void {
this.executionQueue.setProcessor(async (item: Queueltem<GenerationTask>) => {
try {
await processor(item.payload);
} catch (error) {
Logger.error(Error encountered within task execution boundary: ${item.id}, error);
throw error;
}
});
Logger.info('Inference execution processor securely bound to ConversationManager.');
}
/**
Safe data accessor for conversation metadata.
*/
public getMetadata(conversationId: string): ConversationMetadata | null {
return this.metadataRegistry.get(conversationId) ?? null;
}
/**
Creates a brand new conversation channel inside the active running session.
*/
public createConversation(title?: string): Conversation {
this.ensureInitialized();
if (!this.activeSession) {
throw new Error('Active session container missing during invocation.');
}
const conversation = this.activeSession.createConversation(title);
const metadata = new ConversationMetadata(
this.activeSession.getId(),
conversation.getTitle(),
conversation.getId()
);
this.metadataRegistry.set(conversation.getId(), metadata);
Logger.info(New conversation pipeline initialized: ${conversation.getId()});
return conversation;
}
/**
Clears runtime memory caches and halts execution processing tasks.
*/
public terminate(): void {
this.executionQueue.clear();
this.metadataRegistry.clear();
this.activeSession = null;
this.isInitialized = false;
Logger.warn('ConversationManager runtime structures decoupled and flushed.');
}
private ensureInitialized(): void {
if (!this.isInitialized) {
throw new Error('ConversationManager operations invoked prior to running initialization.');
}
}
}
export default new ConversationManager();
