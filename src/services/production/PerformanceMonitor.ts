import Logger from '../../utils/Logger';
export interface ResourceTelemetrySnapshot {
timestamp: number;
cpuLoadEstimate: number;
ramFootprintBytes: number;
batteryDrainState: 'nominal' | 'critical';
}
export class PerformanceMonitor {
private telemetryHistory: ResourceTelemetrySnapshot[] = [];
private readonly maxHistoryCapacity = 500;
/**
Registers a point-in-time performance metrics tracking node to monitor platform execution boundaries.
*/
public trackAllocationState(cpuLoad: number, ramBytes: number, voltageDrainLow: boolean): ResourceTelemetrySnapshot {
const snapshot: ResourceTelemetrySnapshot = {
timestamp: Date.now(),
cpuLoadEstimate: Math.min(1.0, Math.max(0.0, cpuLoad)),
ramFootprintBytes: Math.max(0, ramBytes),
batteryDrainState: voltageDrainLow ? 'critical' : 'nominal'
};
this.telemetryHistory.push(snapshot);
if (this.telemetryHistory.length > this.maxHistoryCapacity) {
this.telemetryHistory.shift(); // Evict oldest record index to bound memory footprint sizes
}
if (snapshot.cpuLoadEstimate > 0.85 || snapshot.batteryDrainState === 'critical') {
Logger.warn(PerformanceMonitor: High resource stress envelope observed. CPU: ${snapshot.cpuLoadEstimate}, Power: ${snapshot.batteryDrainState});
}
return snapshot;
}
public getAverageCpuUtilization(): number {
if (this.telemetryHistory.length === 0) return 0.0;
const sum = this.telemetryHistory.reduce((acc, curr) => acc + curr.cpuLoadEstimate, 0);
return Number((sum / this.telemetryHistory.length).toFixed(3));
}
public clearTelemetryCache(): void {
this.telemetryHistory = [];
Logger.debug('PerformanceMonitor: Telemetry log buffer arrays cleared.');
}
}
export default new PerformanceMonitor();
