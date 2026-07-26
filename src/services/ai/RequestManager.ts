import ConversationManager from './ConversationManager';
import StreamingController from './StreamingController';
import { ChatMessage, AIResponse } from './types';
import Logger from '../../utils/Logger';
import LocalProvider from './LocalProvider';

export interface ExecutionRequest {
  requestId: string;
  conversationId: string;
  prompt: string;
  priority: number;
  timestamp: number;
}

export interface RequestCallbacks {
  onStart?: (messageId: string) => void;
  onChunk?: (chunk: string) => void;
  onComplete?: (response: AIResponse) => void;
  onError?: (error: Error) => void;
}

export class RequestManager {
  private activeRequests: Map<string, ExecutionRequest> = new Map();
  private requestCallbacks: Map<string, RequestCallbacks> = new Map();
  private provider = new LocalProvider();
  private processorBound = false;

  public async execute(
    conversationId: string,
    prompt: string,
    callbacks: RequestCallbacks = {},
    priority = 0
  ): Promise<string> {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) {
      throw new Error('Cannot execute an empty prompt request.');
    }

    const taskId = await ConversationManager.submitPrompt(conversationId, cleanPrompt, priority);
    const request: ExecutionRequest = {
      requestId: taskId,
      conversationId,
      prompt: cleanPrompt,
      priority,
      timestamp: Date.now(),
    };
    
    this.activeRequests.set(taskId, request);
    this.requestCallbacks.set(taskId, callbacks);
    
    this.ensureProcessorBound();
    return taskId;
  }

  private ensureProcessorBound(): void {
    if (this.processorBound) return;
    this.processorBound = true;

    ConversationManager.registerProcessor(async (task) => {
      const targetRequest = Array.from(this.activeRequests.values()).find(
        (req) => req.conversationId === task.conversationId && req.prompt === task.userMessage
      );
      
      if (!targetRequest) return;

      const requestId = targetRequest.requestId;
      const callbacks = this.requestCallbacks.get(requestId);

      const handleStart = (msgId: string) => callbacks?.onStart?.(msgId);
      const handleChunk = (payload: { messageId: string; text: string }) => callbacks?.onChunk?.(payload.text);
      const handleEnd = () => this.cleanupRequest(requestId, handleStart, handleChunk, handleEnd, handleAbort);
      const handleAbort = (payload: { messageId: string; reason: string }) => {
        callbacks?.onError?.(new Error(`Stream generation aborted: ${payload.reason}`));
        this.cleanupRequest(requestId, handleStart, handleChunk, handleEnd, handleAbort);
      };

      StreamingController.on('stream:start', handleStart);
      StreamingController.on('stream:chunk', handleChunk);
      StreamingController.on('stream:end', handleEnd);
      StreamingController.on('stream:abort', handleAbort);

      try {
        await this.provider.initialize();
        const historyMessages: ChatMessage[] = [
          { id: Date.now().toString(), role: 'user', content: task.userMessage, createdAt: Date.now() }
        ];

        const response = await this.provider.generate(historyMessages);
        callbacks?.onComplete?.(response);
      } catch (error) {
        callbacks?.onError?.(error instanceof Error ? error : new Error(String(error)));
        StreamingController.abortStream(requestId, String(error));
      }
    });
  }

  private cleanupRequest(
    requestId: string,
    startFn: Function,
    chunkFn: Function,
    endFn: Function,
    abortFn: Function
  ): void {
    StreamingController.off('stream:start', startFn as any);
    StreamingController.off('stream:chunk', chunkFn as any);
    StreamingController.off('stream:end', endFn as any);
    StreamingController.off('stream:abort', abortFn as any);
    this.activeRequests.delete(requestId);
    this.requestCallbacks.delete(requestId);
  }

  public cancelRequest(requestId: string): boolean {
    const request = this.activeRequests.get(requestId);
    if (!request) return false;
    
    StreamingController.abortStream(requestId, 'User requested manual cancellation.');
    this.activeRequests.delete(requestId);
    this.requestCallbacks.delete(requestId);
    return true;
  }

  public getPendingCount(): number {
    return this.activeRequests.size;
  }
}

export default new RequestManager();
