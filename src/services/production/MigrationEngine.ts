import Logger from '../../utils/Logger';
export interface MigrationStepBlock {
targetVersion: number;
executeSchemaPatch(dbConnection: any): Promise<void>;
}
export class MigrationEngine {
private currentSchemaVersion = 1;
private readonly targetSystemVersion = 3;
private migrationRegistry: Map<number, MigrationStepBlock> = new Map();
constructor() {
this.registerMigrationSequenceSteps();
}
/**
Registers sequential data restructuring steps to ensure clean application structural upgrades.
*/
private registerMigrationSequenceSteps(): void {
// Migration Path definition: Upgrading database schemas from version 1 to 2
this.migrationRegistry.set(2, {
targetVersion: 2,
executeSchemaPatch: async (db) => {
db.execute('ALTER TABLE memory_nodes ADD COLUMN global_sync_marker TEXT;');
}
});
// Migration Path definition: Upgrading database schemas from version 2 to 3
this.migrationRegistry.set(3, {
targetVersion: 3,
executeSchemaPatch: async (db) => {
db.execute('CREATE TABLE IF NOT EXISTS system_metadata_cache (meta_key TEXT PRIMARY KEY, meta_val TEXT);');
}
});
}
/**
Runs schema upgrades sequentially until the database reaches the target production version.
*/
public async executeStructuralMigrations(databaseInstance: any, activeDbVersion: number): Promise<boolean> {
this.currentSchemaVersion = activeDbVersion;
if (this.currentSchemaVersion >= this.targetSystemVersion) {
Logger.info(MigrationEngine: Storage schema structures comply with latest version constraints: v${this.currentSchemaVersion});
return true;
}
Logger.warn(MigrationEngine: Outdated storage layout verified (v${this.currentSchemaVersion}). Initializing structural upgrade pass.);
try {
while (this.currentSchemaVersion < this.targetSystemVersion) {
const nextVersionIndex = this.currentSchemaVersion + 1;
const upgradePatch = this.migrationRegistry.get(nextVersionIndex);
if (!upgradePatch) {
throw new Error(Migration pipeline break: Upgrade step patch script missing for target version version marker: v${nextVersionIndex});
}
Logger.info(MigrationEngine: Applying transformation patch straight to version schema baseline: v${nextVersionIndex});
await upgradePatch.executeSchemaPatch(databaseInstance);
this.currentSchemaVersion = nextVersionIndex;
}
Logger.info(MigrationEngine: Successfully upgraded data partitions to standard production specs: v${this.currentSchemaVersion});
return true;
} catch (migrationFault) {
Logger.error('MigrationEngine: Cascade migration pass aborted due to a critical structure patch script failure.', migrationFault);
return false;
}
}
}
export default new MigrationEngine();
