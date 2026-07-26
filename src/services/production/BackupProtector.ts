import RNFS from 'react-native-fs';
import { CryptoEngine } from '../security/CryptoEngine';
import KeyManager from '../security/KeyManager';
import Logger from '../../utils/Logger';
export interface BackupPackageManifest {
archiveId: string;
timestamp: number;
encryptedDataBlob: string;
verificationHash: string;
}
export class BackupProtector {
private readonly backupDirectory = ${RNFS.DocumentDirectoryPath}/Evolva/backups;
/**
Compiles and encrypts target JSON files to establish a secure, portable system snapshot state.
*/
public async createSystemBackupArchive(sourceJsonPath: string): Promise<BackupPackageManifest | null> {
Logger.info(BackupProtector: Commencing encrypted system state snapshot export loop from source: ${sourceJsonPath});
try {
const fileExists = await RNFS.exists(sourceJsonPath);
if (!fileExists) {
throw new Error(Backup source target path "${sourceJsonPath}" is unhydrated.);
}
// 1. Ensure target backup path directories are established
const dirExists = await RNFS.exists(this.backupDirectory);
if (!dirExists) {
await RNFS.mkdir(this.backupDirectory);
}
// 2. Read the source plain payload manifest file
const rawTextData = await RNFS.readFile(sourceJsonPath, 'utf8');
const textBytes = new TextEncoder().encode(rawTextData);
// 3. Resolve context isolated backup key material via KeyManager routing
const subKeyData = await KeyManager.getActiveSubKey('backup_enclave_export');
// 4. Transform bytes utilizing authenticated GCM primitive wrappers
const encryptedPack = await CryptoEngine.encryptAuthenticated(
textBytes,
subKeyData.keyMaterial,
Evolva_Backup_Signature_v${subKeyData.meta.version}
);
const serializedBackupString = JSON.stringify(encryptedPack);
const outputHashBytes = await CryptoEngine.computeSHA256(new TextEncoder().encode(serializedBackupString));
const fileVerificationHash = Array.from(outputHashBytes).map(b => b.toString(16).padStart(2, '0')).join('');
const archiveId = bak_${Date.now()};
const destinationFileTarget = ${this.backupDirectory}/${archiveId}.enc;
// 5. Commit fully encrypted sequence payload block onto disk partitions
await RNFS.writeFile(destinationFileTarget, serializedBackupString, 'utf8');
Logger.info(BackupProtector: System backup file successfully materialized: ${destinationFileTarget});
return {
archiveId,
timestamp: Date.now(),
encryptedDataBlob: serializedBackupString,
verificationHash: fileVerificationHash
};
} catch (error) {
Logger.error('BackupProtector: Critical error encountered while producing system backup envelope.', error);
return null;
}
}
}
export default new BackupProtector();
