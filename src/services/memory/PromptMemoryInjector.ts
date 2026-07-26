import MemoryRetrieval, { RetrievalResult } from './MemoryRetrieval';
import LocalEmbeddingModel from './LocalEmbeddingModel';
import { ChatMessage } from '../ai/types';
import Logger from '../../utils/Logger';
export class PromptMemoryInjector {
private readonly defaultTokenBudget = 1000;
/**
Enriches the user prompt trajectory by retrieving contextually relevant long-term memories
and injecting them as an authenticated system context frame.
*/
public async injectRelevantContext(
history: ChatMessage[],
userMessage: string
): Promise<ChatMessage[]> {
Logger.info('PromptMemoryInjector: Commencing semantic context lookup for prompt injection.');
try {
// 1. Generate text embeddings utilizing the local transformer layer
const report = await LocalEmbeddingModel.computeTextEmbedding(userMessage);
// 2. Query the memory retrieval cluster using the computed tensor vector
const relevantMatches: RetrievalResult[] = MemoryRetrieval.query(report.vectorSpace, {
targetBitmask: 0xFFFFFF, // Search all categories
maxResults: 8,
similarityThreshold: 0.70
});
if (relevantMatches.length === 0) {
Logger.info('PromptMemoryInjector: No semantic memory matches passed threshold criteria.');
return history;
}
// 3. Compile the structural text block from the matched nodes
const contextInjectionBlock = MemoryRetrieval.compileContextInjectionBlock(relevantMatches, this.defaultTokenBudget);
// 4. Construct the localized context frame message
const contextFrameMessage: ChatMessage = {
id: mem_frame_${Date.now()},
role: 'system',
content: contextInjectionBlock,
createdAt: Date.now()
};
// 5. Inject the frame safely directly under the main system prompt position
const finalizedHistory = [...history];
if (finalizedHistory.length > 0 && finalizedHistory[0].role === 'system') {
finalizedHistory.splice(1, 0, contextFrameMessage);
} else {
finalizedHistory.unshift(contextFrameMessage);
}
Logger.info(PromptMemoryInjector: Successfully injected ${relevantMatches.length} structural memory nodes into prompt stream.);
return finalizedHistory;
} catch (error) {
Logger.error('PromptMemoryInjector: Failed executing prompt injection pipeline pass.', error);
return history;
}
}
}
export default new PromptMemoryInjector();
