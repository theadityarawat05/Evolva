import { ChatMessage } from './types';
import TokenCounter from '../../utils/TokenCounter';
import Logger from '../../utils/Logger';
export interface CompressorOptions {
maxAllowedTokens: number;
preserveSystemPrompt: boolean;
compressionRatio: number; // Percentage of context to drop when overflowing (e.g., 0.2 = 20%)
}
export class ContextCompressor {
private defaultOptions: CompressorOptions = {
maxAllowedTokens: 3000, // Safe headroom budget below hard 4096 context size
preserveSystemPrompt: true,
compressionRatio: 0.25,
};
/**
Evaluates historical conversation matrices and compresses content if token limits are breached.
*/
public compress(messages: ChatMessage[], options?: Partial<CompressorOptions>): ChatMessage[] {
const config = { ...this.defaultOptions, ...options };
// 1. Calculate total current token footprint across the history array
let totalTokens = 0;
const messageTokenMap = messages.map(msg => {
const tokens = TokenCounter.estimateTokens(msg.content);
totalTokens += tokens;
return { msg, tokens };
});
Logger.info(ContextCompressor: Evaluating message array. Current estimated token footprint: ${totalTokens}/${config.maxAllowedTokens});
if (totalTokens <= config.maxAllowedTokens) {
return messages;
}
Logger.warn(Context window threshold breached (${totalTokens} tokens). Commencing historical compression pipeline.);
// 2. Isolate immutable system anchors from standard conversational buffers
const systemMessages: ChatMessage[] = [];
let processingPool = [...messageTokenMap];
if (config.preserveSystemPrompt) {
systemMessages.push(...messages.filter(m => m.role === 'system'));
processingPool = processingPool.filter(item => item.msg.role !== 'system');
}
// 3. Systematically prune chronological records from the oldest indices until we sit safely below target bounds
let reductionTarget = totalTokens - config.maxAllowedTokens;
let prunedTokens = 0;
let shiftIndex = 0;
while (prunedTokens < reductionTarget && shiftIndex < processingPool.length) {
// Retain the newest turn sequence if we're hitting a critical floor to avoid absolute amnesia
if (processingPool.length - shiftIndex <= 2) {
Logger.warn('Context Compressor reached critical conversation horizon boundary. Halting truncation sequence.');
break;
}
prunedTokens += processingPool[shiftIndex].tokens;
shiftIndex++;
}
const compressedContext = [
...systemMessages,
...processingPool.slice(shiftIndex).map(item => item.msg)
];
const finalTokens = compressedContext.reduce((acc, current) => acc + TokenCounter.estimateTokens(current.content), 0);
Logger.info(Compression cycle completed successfully. Pruned ${shiftIndex} historical messages. New footprint: ${finalTokens} tokens.);
return compressedContext;
}
/**
Inject a structural summaries milestone marker directly into the history layer.
Used when long-term memory aggregation replaces raw historic conversation indexes.
*/
public injectSummaryMarker(history: ChatMessage[], summaryText: string): ChatMessage[] {
const systemPrompt = history.find(m => m.role === 'system');
const userAndAssistantHistory = history.filter(m => m.role !== 'system');
const summaryMessage: ChatMessage = {
id: summary_${Date.now()},
role: 'system',
content: [CONTEXT SUMMARY: ${summaryText}],
createdAt: Date.now()
};
return systemPrompt
? [systemPrompt, summaryMessage, ...userAndAssistantHistory]
: [summaryMessage, ...userAndAssistantHistory];
}
}
export default new ContextCompressor();
