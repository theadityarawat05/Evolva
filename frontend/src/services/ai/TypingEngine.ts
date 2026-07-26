import { EventEmitter } from 'events';
import StreamingController, { StreamChunkPayload } from './StreamingController';
import RequestManager, { RequestCallbacks } from './RequestManager';
import ConversationManager from './ConversationManager';
import { AIResponse } from './types';
import Logger from '../../utils/Logger';
export type TypingStatus = 'idle' | 'typing' | 'cancelled' | 'error';
export interface TypingState {
conversationId: string;
messageId: string | null;
status: TypingStatus;
accumulatedText: string;
lastUpdated: number;
}
export class TypingEngine extends EventEmitter {
private activeStates: Map<string, TypingState> = new Map();
private retryTracker: Map<string, { lastPrompt: string; attemptCount: number }> = new Map();
constructor() {
super();
this.initializeListeners();
}
/**
Internal routine binding the engine directly to the active low-level StreamingController events.
*/
private initializeListeners(): void {
StreamingController.on('stream:start', (messageId: string) => {
const state = this.findStateByMessageId(messageId);
if (state) {
state.status = 'typing';
state.lastUpdated = Date.now();
this.emit('typing:start', state);
}
});
StreamingController.on('stream:chunk', (payload: StreamChunkPayload) => {
const state = this.findStateByMessageId(payload.messageId);
if (state && state.status === 'typing') {
state.accumulatedText += payload.text;
state.lastUpdated = Date.now();
this.emit('typing:delta', state);
}
});
StreamingController.on('stream:end', (payload: { messageId: string }) => {
const state = this.findStateByMessageId(payload.messageId);
if (state) {
state.status = 'idle';
state.lastUpdated = Date.now();
this.emit('typing:end', state);
this.activeStates.delete(state.conversationId);
}
});
StreamingController.on('stream:abort', (payload: { messageId: string; reason: string }) => {
const state = this.findStateByMessageId(payload.messageId);
if (state) {
state.status = state.status === 'cancelled' ? 'cancelled' : 'error';
state.lastUpdated = Date.now();
this.emit('typing:fault', { state, reason: payload.reason });
this.activeStates.delete(state.conversationId);
}
});
}
/**
Initializes a guided streaming prompt interaction tracking sequence.
*/
public async dispatchPrompt(conversationId: string, prompt: string): Promise<string> {
if (this.isConversationTyping(conversationId)) {
throw new Error(Conversation channel "${conversationId}" is currently busy generating another text frame.);
}
// Cache context execution values to enable accurate localized retries down the line
this.retryTracker.set(conversationId, {
lastPrompt: prompt,
attemptCount: 0
});
const state: TypingState = {
conversationId,
messageId: null,
status: 'idle',
accumulatedText: '',
lastUpdated: Date.now()
};
this.activeStates.set(conversationId, state);
const callbacks: RequestCallbacks = {
onStart: (msgId: string) => {
state.messageId = msgId;
},
onError: (err: Error) => {
Logger.error(TypingEngine encountered runtime generation boundary failure, err);
}
};
return await RequestManager.execute(conversationId, prompt, callbacks);
}
/**
Triggers a manual interruption context across the underlying inference loops.
*/
public stopGeneration(conversationId: string): boolean {
const state = this.activeStates.get(conversationId);
if (!state || !state.messageId) {
return false;
}
state.status = 'cancelled';
const result = RequestManager.cancelRequest(state.messageId);
if (result) {
Logger.warn(Typing Engine actively intercepted and forced execution step down on conversation: ${conversationId});
}
return result;
}
/**
Re-executes the last prompt run inside a conversation container, handling automatic rollback.
*/
public async retryLastPrompt(conversationId: string): Promise<string> {
const historicalRun = this.retryTracker.get(conversationId);
if (!historicalRun) {
throw new Error(No historical dispatch footprints tracked for conversation: ${conversationId});
}
historicalRun.attemptCount++;
Logger.info(Re-triggering text processing prompt run. Attempt: ${historicalRun.attemptCount});
// If an interaction is currently processing, cleanly sever context strings first
this.stopGeneration(conversationId);
return await this.dispatchPrompt(conversationId, historicalRun.lastPrompt);
}
/**
State check validating if a designated conversation is actively processing textual streams.
*/
public isConversationTyping(conversationId: string): boolean {
const state = this.activeStates.get(conversationId);
return state ? state.status === 'typing' : false;
}
/**
Pulls the reactive state vector cache assigned to an active conversation context.
*/
public getTypingState(conversationId: string): TypingState | null {
return this.activeStates.get(conversationId) ?? null;
}
private findStateByMessageId(messageId: string): TypingState | undefined {
return Array.from(this.activeStates.values()).find(s => s.messageId === messageId);
}
}
export default new TypingEngine();
