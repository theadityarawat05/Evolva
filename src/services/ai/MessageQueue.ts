 import { EventEmitter } from 'events';

export type QueueItemStatus = | 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface QueueItem<T = unknown> { readonly id: string; readonly payload: T; readonly priority: number; readonly createdAt: number; status: QueueItemStatus; attempts: number; lastError?: Error; }

export interface MessageQueueOptions { readonly maxRetries?: number; readonly autoStart?: boolean; }

export type QueueProcessor<T> = (item: QueueItem<T>) => Promise<void>;

export class MessageQueue<T = unknown> extends EventEmitter { private readonly queue: QueueItem<T>[] = []; private readonly maxRetries: number;

private processor: QueueProcessor<T> | null = null; private processing = false; private paused = false;

constructor(options: MessageQueueOptions = {}) { super();

this.maxRetries = options.maxRetries ?? 3;

if (options.autoStart ?? true) {
  queueMicrotask(() => void this.process());
}

}

public setProcessor(processor: QueueProcessor<T>): void { this.processor = processor; }

public enqueue( payload: T, priority = 0, id = crypto.randomUUID(), ): QueueItem<T> { const item: QueueItem<T> = { id, payload, priority, createdAt: Date.now(), status: 'queued', attempts: 0, };

this.queue.push(item);
this.queue.sort((a, b) => b.priority - a.priority);

this.emit('enqueue', item);

void this.process();

return item;

}

public pause(): void { this.paused = true; }

public resume(): void { if (!this.paused) { return; }

this.paused = false;
void this.process();

}

public clear(): void { this.queue.length = 0; }

public size(): number { return this.queue.length; }

public isProcessing(): boolean { return this.processing; }

public snapshot(): readonly QueueItem<T>[] { return [...this.queue]; }

private async process(): Promise<void> { if (this.processing || this.paused || !this.processor) { return; }

this.processing = true;

try {
  while (!this.paused && this.queue.length > 0) {
    const item = this.queue.shift()!;

    item.status = 'processing';
    item.attempts++;

    this.emit('processing', item);

    try {
      await this.processor(item);

      item.status = 'completed';

      this.emit('completed', item);
    } catch (error) {
      item.lastError =
        error instanceof Error ? error : new Error(String(error));

      if (item.attempts < this.maxRetries) {
        item.status = 'queued';
        this.queue.unshift(item);

        this.emit('retry', item);
      } else {
        item.status = 'failed';

        this.emit('failed', item);
      }
    }
  }
} finally {
  this.processing = false;
}

} } 