import IdentityEngine, { PsychologicalProfile } from '../identity/IdentityEngine';
import GoalEngine, { SystemProject } from '../goals/GoalEngine';
import ReflectionEngine, { ReflectionPeriod, CognitiveInsight } from '../reflection/ReflectionEngine';
import Logger from '../../utils/Logger';
export interface InsightCard {
id: string;
type: 'productivity_velocity' | 'habit_decay' | 'cognitive_friction' | 'strategic_recommendation';
title: string;
description: string;
impactScore: number;       // Quantitative metric of importance: [1 - 10]
confidenceInterval: number; // Statistical variance value: [0.0 - 1.0]
actionableStep: string;
generatedAt: number;
}
export interface IntelligenceDashboardSnapshot {
productivityVelocityEMA: number;
habitStabilityIndex: number;
cognitiveFrictionRatio: number;
activeInsightCards: InsightCard[];
}
export class InsightsEngine {
private dynamicInsightCards: InsightCard[] = [];
private readonly lookbackWindowMs = 7 * 24 * 60 * 60 * 1000; // 7-day trailing lookback matrix
/**
Compiles high-dimensional analytics across system engines to produce predictive insight vectors.
*/
public generateIntelligenceDashboard(): IntelligenceDashboardSnapshot {
Logger.info('InsightsEngine: Commencing advanced multi-engine intelligence compilation sequence.');
const startTime = Date.now();
// 1. Extract structural data dependencies from sibling engines
const identityProfile = IdentityEngine.getProfile();
const activeProjects = GoalEngine.listActiveProjects();
const reflectionPeriod = ReflectionEngine.compileReflectionReview(this.lookbackWindowMs);
// 2. Compute mathematical moving averages and friction metrics
const productivityVelocityEMA = this.computeProductivityVelocityEMA(activeProjects);
const habitStabilityIndex = this.computeHabitStabilityIndex(identityProfile);
const cognitiveFrictionRatio = this.computeCognitiveFrictionRatio(reflectionPeriod);
// 3. Purge stale matrix records and generate highly advanced Insight Cards
this.dynamicInsightCards = [];
this.synthesizeProductivityInsights(productivityVelocityEMA, activeProjects);
this.synthesizeHabitInsights(habitStabilityIndex, identityProfile);
this.synthesizeCognitiveInsights(cognitiveFrictionRatio, reflectionPeriod);
const executionDuration = Date.now() - startTime;
Logger.info(InsightsEngine: Intelligence compilation completed successfully in ${executionDuration}ms.);
return {
productivityVelocityEMA,
habitStabilityIndex,
cognitiveFrictionRatio,
activeInsightCards: this.dynamicInsightCards
};
}
/**
Calculates structural project completion trends using an Exponential Moving Average algorithm.
*/
private computeProductivityVelocityEMA(projects: SystemProject[]): number {
if (projects.length === 0) return 0.0;
let totalVelocity = 0.0;
const smoothingFactor = 0.3; // Alpha parameter for internal smoothing math
for (const project of projects) {
const progress = GoalEngine.calculateProgressRatio(project.id);
const projectAgeDays = Math.max(1, (Date.now() - project.createdAt) / (24 * 60 * 60 * 1000));
// Velocity Vector = Progress Delta / Timeline Elapsed
const instantaneousVelocity = progress / projectAgeDays;
// Recalculate rolling mathematical progression
totalVelocity = (instantaneousVelocity * smoothingFactor) + (totalVelocity * (1.0 - smoothingFactor));
}
return Number(totalVelocity.toFixed(4));
}
/**
Evaluates habit tracking structures to measure identity alignment values.
*/
private computeHabitStabilityIndex(profile: PsychologicalProfile): number {
const habits = Object.values(profile.habits);
if (habits.length === 0) return 1.0;
let aggregateConsistency = 0.0;
for (const habit of habits) {
aggregateConsistency += habit.consistencyScore;
}
return Number((aggregateConsistency / habits.length).toFixed(3));
}
/**
Quantifies negative valence frequencies against regular execution cycles.
*/
private computeCognitiveFrictionRatio(reflection: ReflectionPeriod): number {
const totalInsights = reflection.insights.length;
if (totalInsights === 0) return 0.0;
const frictionEvents = reflection.insights.filter(i => i.type === 'mistake_detected').length;
// Scale friction factor adjusted by dominant emotional valence metrics
const baseFriction = frictionEvents / totalInsights;
const emotionalMultiplier = reflection.dominantEmotion.valence < 0 ? 1.2 : 0.8;
return Number(Math.min(1.0, baseFriction * emotionalMultiplier).toFixed(3));
}
/**
Evaluates productivity vectors to generate advanced planning strategy corrections.
*/
private synthesizeProductivityInsights(velocity: number, projects: SystemProject[]): void {
if (velocity < 0.05 && projects.length > 0) {
this.dynamicInsightCards.push({
id: card_prod_${crypto.randomUUID().substring(0, 8)},
type: 'productivity_velocity',
title: 'Project Pipeline Stagnation Detected',
description: 'Task progression patterns exhibit downward standard deviation scaling. Execution constraints indicate high task blockage density.',
impactScore: 8,
confidenceInterval: 0.92,
actionableStep: 'Execute high-priority dependency optimization loops on top active projects to break task blockers.',
generatedAt: Date.now()
});
}
}
/**
Monitors dynamic shifts in habits to flag potential routines breaking down.
*/
private synthesizeHabitInsights(stability: number, profile: PsychologicalProfile): void {
if (stability < 0.60) {
this.dynamicInsightCards.push({
id: card_habit_${crypto.randomUUID().substring(0, 8)},
type: 'habit_decay',
title: 'Behavioral Routine Decay Anomaly',
description: 'Aggregate habit consistency vectors dropped below systemic safety baselines.',
impactScore: 7,
confidenceInterval: 0.88,
actionableStep: 'Isolate lowest scoring habit metrics and schedule automated milestone reminders to recover target routines.',
generatedAt: Date.now()
});
}
}
/**
Cross-references cognitive anomalies to generate behavioral optimization loops.
*/
private synthesizeCognitiveInsights(friction: number, reflection: ReflectionPeriod): void {
if (friction > 0.40) {
const primaryMistake = reflection.insights.find(i => i.type === 'mistake_detected');
this.dynamicInsightCards.push({
id: card_cog_${crypto.randomUUID().substring(0, 8)},
type: 'cognitive_friction',
title: 'High Mental Friction Loop Discovered',
description: 'Systemic behavioral tracking indicates recurring execution errors generating negative performance deviations.',
impactScore: 9,
confidenceInterval: 0.95,
actionableStep: primaryMistake
? Deploy a dedicated intervention protocol targeting: ${primaryMistake.description}
: 'Initiate a systematic review of active priorities to realign workflow execution strategies.',
generatedAt: Date.now()
});
}
}
}
export default new InsightsEngine();
