import { EventEmitter } from 'events';
import Logger from '../../utils/Logger';
export interface StreamChunkPayload {
messageId: string;
text: string;
timestamp: number;
}
export interface StreamState {
messageId: string;
isActive: boolean;
chunkCount: number;
startedAt: number;
}
export class StreamingController extends EventEmitter {
private activeStreams: Map<string, StreamState> = new Map();
/**
Registers and initializes a new streaming context for a generation task.
*/
public registerStream(messageId: string): void {
if (this.activeStreams.has(messageId)) {
Logger.warn(Stream context for message "${messageId}" already exists. Re-initializing.);
}
const state: StreamState = {
messageId,
isActive: true,
chunkCount: 0,
startedAt: Date.now(),
};
this.activeStreams.set(messageId, state);
this.emit('stream:start', messageId);
Logger.info(Streaming context registered for message: ${messageId});
}
/**
Pushes a raw text token/chunk into the stream pipeline and notifies consumers.
*/
public pushChunk(messageId: string, text: string): void {
const state = this.activeStreams.get(messageId);
if (!state) {
Logger.warn(Received chunk for unregistered or inactive stream: ${messageId});
return;
}
if (!state.isActive) {
Logger.warn(Stream for message "${messageId}" is already closed. Dropping chunk.);
return;
}
state.chunkCount++;
const payload: StreamChunkPayload = {
messageId,
text,
timestamp: Date.now(),
};
this.emit('stream:chunk', payload);
}
/**
Finalizes a stream session successfully, sealing its state.
*/
public closeStream(messageId: string): void {
const state = this.activeStreams.get(messageId);
if (!state) {
Logger.error(Cannot close stream. Context not found for message: ${messageId});
return;
}
state.isActive = false;
const duration = Date.now() - state.startedAt;
this.emit('stream:end', {
messageId,
totalChunks: state.chunkCount,
durationMs: duration,
});
this.activeStreams.delete(messageId);
Logger.info(Stream context safely closed for message: ${messageId} (${state.chunkCount} chunks, ${duration}ms));
}
/**
Aborts an active stream due to failure or manual user cancellation.
*/
public abortStream(messageId: string, reason?: string): void {
const state = this.activeStreams.get(messageId);
if (!state) {
return;
}
state.isActive = false;
this.emit('stream:abort', { messageId, reason: reason ?? 'Manual abort requested' });
this.activeStreams.delete(messageId);
Logger.warn(Stream interrupted and purged for message: ${messageId}. Reason: ${reason ?? 'None provided'});
}
/**
Operational check to see if a specific message stream is processing.
*/
public isStreaming(messageId: string): boolean {
const state = this.activeStreams.get(messageId);
return state ? state.isActive : false;
}
/**
Returns a list of all currently active streaming IDs.
*/
public getActiveStreamIds(): string[] {
return Array.from(this.activeStreams.keys());
}
/**
Resets the entire controller state layer, clearing internal tracking caches.
*/
public clear(): void {
for (const messageId of this.activeStreams.keys()) {
this.abortStream(messageId, 'Controller reset sequence triggered');
}
this.activeStreams.clear();
this.removeAllListeners();
Logger.info('StreamingController completely purged and reset.');
}
}
export default new StreamingController();
