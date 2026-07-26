import MemoryRepository from '../memory/MemoryRepository';
import { ChatMessage } from '../ai/types';
import Logger from '../../utils/Logger';
export interface CommunicationMetrics {
averageSentenceLength: number;
vocabularyComplexityScore: number;
formalityIndex: number; // Continuum scale: [0.0 = Casual/Slang, 1.0 = Highly Technical/Formal]
dominantToneToken: string;
}
export class CommunicationProfiler {
private activeMetrics: CommunicationMetrics = {
averageSentenceLength: 12,
vocabularyComplexityScore: 0.5,
formalityIndex: 0.5,
dominantToneToken: 'neutral'
};
/**
Dynamically tracks linguistic configurations across user messages to adjust AI communication style output constraints.
*/
public analyzeTurnStyle(history: ChatMessage[]): CommunicationMetrics {
const userTurns = history.filter(m => m.role === 'user');
if (userTurns.length === 0) return this.activeMetrics;
let totalWords = 0;
let totalSentences = 0;
let technicalTermCount = 0;
const technicalMarkers = ['code', 'optimize', 'compile', 'architecture', 'hardware', 'interface', 'database', 'system'];
for (const turn of userTurns) {
const text = turn.content.trim();
const words = text.split(/\s+/);
const sentences = text.split(/[.!?]+/).filter(Boolean);
totalWords += words.length;
totalSentences += Math.max(1, sentences.length);
const lowercaseContent = text.toLowerCase();
for (const marker of technicalMarkers) {
if (lowercaseContent.includes(marker)) technicalTermCount++;
}
}
const avgSentenceLength = totalWords / totalSentences;
const computedFormality = Math.min(1.0, technicalTermCount / Math.max(1, userTurns.length * 2));
this.activeMetrics = {
averageSentenceLength: Number(avgSentenceLength.toFixed(2)),
vocabularyComplexityScore: Number(Math.min(1.0, totalWords / 200).toFixed(2)),
formalityIndex: Number(computedFormality.toFixed(2)),
dominantToneToken: computedFormality > 0.6 ? 'technical_analytical' : 'casual_collaborative'
};
Logger.debug(CommunicationProfiler: Dynamic style update complete => Formality: ${this.activeMetrics.formalityIndex});
return this.activeMetrics;
}
public getStyleConstraintsString(): string {
return [AI STYLE CONSTRAINTS: Match the user's current communication footprint. Current Formality Index: ${this.activeMetrics.formalityIndex}. Mode: ${this.activeMetrics.dominantToneToken}];
}
}
export default new CommunicationProfiler();
