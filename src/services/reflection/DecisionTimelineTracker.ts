import MemoryRepository from '../memory/MemoryRepository';
import Logger from '../../utils/Logger';
export interface DecisionTrace {
id: string;
context: string;
alternativesConsidered: string[];
chosenPath: string;
rationale: string;
impactScore: number; // Scale: [1 - 10]
timestamp: number;
}
export class DecisionTimelineTracker {
private activeTraces: Map<string, DecisionTrace> = new Map();
/**
Records a distinct user decision vector into the timeline registry, mapping alternatives and rationales.
*/
public logDecision(
context: string,
alternatives: string[],
chosenPath: string,
rationale: string,
impactScore: number
): DecisionTrace {
const traceId = dec_${crypto.randomUUID().substring(0, 8)};
const trace: DecisionTrace = {
id: traceId,
context: context.trim(),
alternativesConsidered: alternatives.map(a => a.trim()),
chosenPath: chosenPath.trim(),
rationale: rationale.trim(),
impactScore: Math.min(10, Math.max(1, impactScore)),
timestamp: Date.now()
};
this.activeTraces.set(traceId, trace);
Logger.info(DecisionTimelineTracker: Registered decision matrix [ID: ${traceId}]. Impact: ${impactScore});
this.persistTraceToEnclave(trace);
return trace;
}
/**
Commits the decision trace structural text block to the secure memory repository partition.
*/
private persistTraceToEnclave(trace: DecisionTrace): void {
try {
const serializedContent = [DECISION CONTEXT]: ${trace.context} | Chosen Path: ${trace.chosenPath} | Rationale: ${trace.rationale} | Alternatives: ${trace.alternativesConsidered.join(', ')};
MemoryRepository.commitNode({
id: trace.id,
bitmask: 1 << 5, // Reflection Bitmask
content: serializedContent,
importance: trace.impactScore,
confidence: 0.95,
vectorSpace: null,
createdAt: trace.timestamp,
updatedAt: trace.timestamp
});
} catch (error) {
Logger.error(DecisionTimelineTracker: Failed to persist decision node ${trace.id}, error);
}
}
public getTracesInWindow(startTime: number, endTime: number): DecisionTrace[] {
return Array.from(this.activeTraces.values())
.filter(t => t.timestamp >= startTime && t.timestamp <= endTime)
.sort((a, b) => b.timestamp - a.timestamp);
}
}
export default new DecisionTimelineTracker();
