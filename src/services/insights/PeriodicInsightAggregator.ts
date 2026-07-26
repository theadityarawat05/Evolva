import InsightsEngine from './InsightsEngine';
import MemoryRepository from '../memory/MemoryRepository';
import Logger from '../../utils/Logger';
export interface ManifestReport {
periodLabel: 'WEEKLY' | 'MONTHLY';
generatedAt: number;
aggregateFrictionRatio: number;
stabilityIndex: number;
insightCount: number;
}
export class PeriodicInsightAggregator {
/**
Compiles and materializes unified analytical cards for high-level user reflection profiles.
*/
public compilePeriodicManifest(type: 'WEEKLY' | 'MONTHLY'): ManifestReport {
Logger.info(PeriodicInsightAggregator: Executing ${type} intelligence consolidation loop.);
const dashboardSnapshot = InsightsEngine.generateIntelligenceDashboard();
const targetCards = dashboardSnapshot.activeInsightCards;
const generatedAt = Date.now();
if (targetCards.length === 0) {
Logger.info('PeriodicInsightAggregator: Empty anomaly profile vector. Synchronization pass skipped.');
return { periodLabel: type, generatedAt, aggregateFrictionRatio: dashboardSnapshot.cognitiveFrictionRatio, stabilityIndex: dashboardSnapshot.habitStabilityIndex, insightCount: 0 };
}
try {
const structuralSummaryText = [INTELLIGENCE MANIFEST - ${type}] Stability Index: ${dashboardSnapshot.habitStabilityIndex}, Friction Ratio: ${dashboardSnapshot.cognitiveFrictionRatio}. Active Insight Dimensions: ${targetCards.length};
const uniqueManifestId = man_${type.toLowerCase()}_${generatedAt};
MemoryRepository.commitNode({
id: uniqueManifestId,
bitmask: 1 << 5, // Reflection Bitmask
content: structuralSummaryText,
importance: type === 'MONTHLY' ? 9 : 7,
confidence: 0.98,
vectorSpace: null,
createdAt: generatedAt,
updatedAt: generatedAt
});
// Link newly compiled periodic baseline cards directly down to individual insight nodes
for (const card of targetCards) {
MemoryRepository.linkMemories(uniqueManifestId, card.id, 'AGGREGATES_INSIGHT');
}
Logger.info(PeriodicInsightAggregator: Hardened ${type} summary log committed: ${uniqueManifestId});
} catch (error) {
Logger.error(PeriodicInsightAggregator: Error encountered finalizing periodic manifest compile sequence., error);
}
return {
periodLabel: type,
generatedAt,
aggregateFrictionRatio: dashboardSnapshot.cognitiveFrictionRatio,
stabilityIndex: dashboardSnapshot.habitStabilityIndex,
insightCount: targetCards.length
};
}
}
export default new PeriodicInsightAggregator();
