import ChatRepository from './ChatRepository';
import ConversationManager from './ConversationManager';
import { Session, SessionSnapshot } from './Session';
import { Conversation } from './Conversation';
import { ConversationMetadata } from './ConversationMetadata';
import Logger from '../../utils/Logger';
export interface ConversationAnalyticsReport {
conversationId: string;
totalMessages: number;
userMessageCount: number;
assistantMessageCount: number;
estimatedPromptTokens: number;
estimatedCompletionTokens: number;
estimatedTotalTokens: number;
sessionLifespanMs: number;
}
export class ConversationRecovery {
/**
Restores a saved session state from the database file and hydrates the active ConversationManager.
*/
public async restoreSession(sessionId: string): Promise<Session | null> {
Logger.info(Initiating session restoration sequence for ID: ${sessionId});
try {
const complexPayload = ChatRepository.getSessionData(sessionId);
if (!complexPayload.session) {
Logger.warn(No historical records found on disk for session: ${sessionId});
return null;
}
// 1. Reconstruct the base core Session object instance
const session = new Session(complexPayload.session.id);
// 2. Hydrate and rebuild individual conversations matching structural history snapshots
for (const convSnapshot of complexPayload.conversations) {
const conversation = new Conversation(convSnapshot.title, convSnapshot.id);
// Append all historically recorded messages back into structural class arrays
for (const msg of convSnapshot.messages) {
conversation.append(
msg.role,
msg.content,
msg.tokenCount,
msg.metadata as Record<string, unknown>
);
}
session.addConversation(conversation);
}
// 3. Set the preserved active conversation index pointer if it exists
if (complexPayload.session.activeConversationId) {
session.setActiveConversation(complexPayload.session.activeConversationId);
}
// 4. Pass control off to the manager runtime layer to orchestrate live instances
ConversationManager.initialize(session);
Logger.info(Session ${sessionId} successfully restored and bound to runtime memory.);
return session;
} catch (error) {
Logger.error(Failed executing disaster-recovery session restoration sequence, error);
throw error;
}
}
/**
serializes an isolated conversation context into a transportable string asset payload.
*/
public exportConversation(sessionId: string, conversationId: string): string {
const dataContext = ChatRepository.getSessionData(sessionId);
const targetSnapshot = dataContext.conversations.find(c => c.id === conversationId);
if (!targetSnapshot) {
throw new Error(Target conversation context "${conversationId}" missing from archive package.);
}
const exportBundle = {
version: "Evolva_Export_v1",
exportedAt: Date.now(),
payload: targetSnapshot
};
return JSON.stringify(exportBundle, null, 2);
}
/**
Compiles diagnostic performance metrics across historical structural conversation logs.
*/
public computeAnalytics(sessionId: string, conversationId: string): ConversationAnalyticsReport {
const dataContext = ChatRepository.getSessionData(sessionId);
const snapshot = dataContext.conversations.find(c => c.id === conversationId);
if (!snapshot) {
throw new Error(Analytics evaluation failed. Conversation reference missing for: ${conversationId});
}
const totalMessages = snapshot.messages.length;
const userMessageCount = snapshot.messages.filter(m => m.role === 'user').length;
const assistantMessageCount = snapshot.messages.filter(m => m.role === 'assistant').length;
const sessionLifespanMs = totalMessages > 1
? snapshot.messages[totalMessages - 1].createdAt - snapshot.messages[0].createdAt
: 0;
return {
conversationId,
totalMessages,
userMessageCount,
assistantMessageCount,
estimatedPromptTokens: snapshot.promptTokens,
estimatedCompletionTokens: snapshot.completionTokens,
estimatedTotalTokens: snapshot.totalTokens,
sessionLifespanMs
};
}
/**
Force executes a critical point-in-time recovery freeze checkpoint out onto persistent sectors.
*/
public async emergencyCheckpointSave(session: Session): Promise<void> {
Logger.warn(Executing automatic emergency recovery checkpoint serialization save for session: ${session.getId()});
const sessionSnapshot = session.export();
const conversations = session.getConversations().map(c => c.export());
const metadataList = session.getConversations().map(c => {
return ConversationManager.getMetadata(c.getId())?.export() || {
id: c.getId(),
sessionId: session.getId(),
title: c.getTitle(),
summary: "",
tags: [],
createdAt: sessionSnapshot.createdAt,
updatedAt: Date.now(),
lastMessageAt: Date.now(),
archived: false,
pinned: false,
messageCount: c.getMessages().length
};
});
await ChatRepository.saveSession(sessionSnapshot, conversations, metadataList);
}
}
export default new ConversationRecovery();
