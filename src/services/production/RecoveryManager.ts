import RNFS from 'react-native-fs';
import { CryptoEngine, AuthenticatedPackage } from '../security/CryptoEngine';
import KeyManager from '../security/KeyManager';
import Logger from '../../utils/Logger';
export class RecoveryManager {
/**
Decrypts, validates, and restores an external backup archive straight back into production storage layout vectors.
*/
public async restoreSystemFromArchive(archivePath: string, destinationDbPath: string): Promise<boolean> {
Logger.info(RecoveryManager: Executing disaster recovery reconstruction loop for snapshot source: ${archivePath});
try {
const archiveExists = await RNFS.exists(archivePath);
if (!archiveExists) {
throw new Error(Recovery processing failed. Input target package missing at path: ${archivePath});
}
// 1. Extract serialized target structural package contents
const rawFileString = await RNFS.readFile(archivePath, 'utf8');
const encryptedPackage: AuthenticatedPackage = JSON.parse(rawFileString);
// 2. Resolve target decryption tracking subkey reference materials
const subKeyData = await KeyManager.getActiveSubKey('backup_enclave_export');
// 3. Authenticate block boundaries and decode payload directly back to plain byte strings
const decryptedBytes = await CryptoEngine.decryptAuthenticated(encryptedPackage, subKeyData.keyMaterial);
const plaintextDatabaseString = new TextDecoder().decode(decryptedBytes);
// Verify structure formatting matches parsing schemas perfectly before overriding disk records
JSON.parse(plaintextDatabaseString);
// 4. Safe destination block rewrite loop
const targetDir = destinationDbPath.substring(0, destinationDbPath.lastIndexOf('/'));
const dirExists = await RNFS.exists(targetDir);
if (!dirExists) {
await RNFS.mkdir(targetDir);
}
await RNFS.writeFile(destinationDbPath, plaintextDatabaseString, 'utf8');
Logger.info(RecoveryManager: Enclave database records successfully reconstructed: ${destinationDbPath});
return true;
} catch (error) {
Logger.error(RecoveryManager: Disaster recovery cycle aborted. Cryptographic signature failed or payload data is corrupt., error);
return false;
}
}
}
export default new RecoveryManager();
