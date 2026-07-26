import GoalEngine, { SystemProject, TaskStatus } from './GoalEngine';
import Logger from '../../utils/Logger';
export interface PredictiveGoalMetrics {
projectedCompletionProbability: number; // Mathematical ceiling scale: [0.0 - 1.0]
criticalPathBlockerCount: number;
daysToTargetHorizon: number;
}
export class ProjectContextEngine {
/**
Runs prediction computations over an active task graph node topology to evaluate delivery probability parameters.
*/
public generatePredictiveMetrics(projectId: string): PredictiveGoalMetrics {
const project = GoalEngine.getProject(projectId);
if (!project || project.status !== 'active') {
return { projectedCompletionProbability: 0.0, criticalPathBlockerCount: 0, daysToTargetHorizon: 0 };
}
const tasks = Array.from(project.tasks.values());
if (tasks.length === 0) {
return { projectedCompletionProbability: 1.0, criticalPathBlockerCount: 0, daysToTargetHorizon: 0 };
}
const completedCount = tasks.filter(t => t.status === 'completed').length;
const blockedCount = tasks.filter(t => t.status === 'blocked').length;
const failedCount = tasks.filter(t => t.status === 'failed').length;
// Baseline calculation algorithms calculating failure states against completion velocity profiles
let structuralProbability = (completedCount / tasks.length) * 1.0;
if (failedCount > 0) structuralProbability -= (failedCount / tasks.length) * 0.5;
if (blockedCount > 0) structuralProbability -= (blockedCount / tasks.length) * 0.2;
// Enforce math parameter clipping boundaries
const optimizedProbabilityScore = Math.min(1.0, Math.max(0.0, structuralProbability));
Logger.info(ProjectContextEngine: Probability metrics completed for ${projectId} => Score: ${optimizedProbabilityScore});
return {
projectedCompletionProbability: Number(optimizedProbabilityScore.toFixed(3)),
criticalPathBlockerCount: blockedCount,
daysToTargetHorizon: this.calculateTargetHorizonDays(tasks)
};
}
private calculateTargetHorizonDays(tasks: any[]): number {
const now = Date.now();
let latestDeadline = now;
for (const task of tasks) {
if (task.deadline && task.deadline > latestDeadline) {
latestDeadline = task.deadline;
}
}
const deltaMs = latestDeadline - now;
return Math.ceil(deltaMs / (24 * 60 * 60 * 1000));
}
}
export default new ProjectContextEngine();
