import RNFS from 'react-native-fs';
import { ConversationSnapshot } from './Conversation';
import { SessionSnapshot } from './Session';
import { ConversationMetadataSnapshot } from './ConversationMetadata';
import Logger from '../../utils/Logger';
export interface ChatStoragePayload {
sessions: Record<string, SessionSnapshot>;
conversations: Record<string, ConversationSnapshot>;
metadata: Record<string, ConversationMetadataSnapshot>;
}
export class ChatRepository {
private readonly storageDirectory: string;
private readonly databasePath: string;
private cache: ChatStoragePayload = {
sessions: {},
conversations: {},
metadata: {},
};
constructor() {
// Persisting data within internal application document sandbox directories
this.storageDirectory = ${RNFS.DocumentDirectoryPath}/Evolva/db;
this.databasePath = ${this.storageDirectory}/chat_store.json;
}
/**
Initializes target storage directories and hydrates state caches from local disk.
*/
public async initialize(): Promise<void> {
try {
const dirExists = await RNFS.exists(this.storageDirectory);
if (!dirExists) {
await RNFS.mkdir(this.storageDirectory);
Logger.info(Created secure storage architecture path: ${this.storageDirectory});
}
const fileExists = await RNFS.exists(this.databasePath);
if (fileExists) {
const rawContent = await RNFS.readFile(this.databasePath, 'utf8');
this.cache = JSON.parse(rawContent) as ChatStoragePayload;
Logger.info(Hydrated ChatRepository cache successfully from disk store.);
} else {
await this.flushToDisk();
Logger.info(Initialized empty state storage manifest file.);
}
} catch (error) {
Logger.error(Critical failure during ChatRepository initialization pipeline, error);
throw error;
}
}
/**
Commits an active session snapshot and all corresponding internal assets to disk.
*/
public async saveSession(
session: SessionSnapshot,
conversations: ConversationSnapshot[],
metadataList: ConversationMetadataSnapshot[]
): Promise<void> {
this.cache.sessions[session.id] = session;
for (const conv of conversations) {
this.cache.conversations[conv.id] = conv;
}
for (const meta of metadataList) {
this.cache.metadata[meta.id] = meta;
}
await this.flushToDisk();
Logger.debug(Persistent updates committed successfully for Session: ${session.id});
}
/**
Retrieves a previously archived session composition context map from local files.
*/
public getSessionData(sessionId: string): {
session: SessionSnapshot | null;
conversations: ConversationSnapshot[];
metadata: ConversationMetadataSnapshot[];
} {
const session = this.cache.sessions[sessionId] || null;
if (!session) {
return { session: null, conversations: [], metadata: [] };
}
const conversations = session.conversationIds
.map(id => this.cache.conversations[id])
.filter(Boolean);
const metadata = session.conversationIds
.map(id => this.cache.metadata[id])
.filter(Boolean);
return { session, conversations, metadata };
}
/**
Performs an indexed text search queries cross-cutting conversation histories.
*/
public searchMessages(query: string): Array<{ conversationId: string; title: string; matchText: string }> {
const cleanQuery = query.toLowerCase().trim();
if (!cleanQuery) return [];
const matches: Array<{ conversationId: string; title: string; matchText: string }> = [];
for (const [convId, snapshot] of Object.entries(this.cache.conversations)) {
const meta = this.cache.metadata[convId];
const title = meta ? meta.title : snapshot.title;
for (const msg of snapshot.messages) {
if (msg.content.toLowerCase().includes(cleanQuery)) {
matches.push({
conversationId: convId,
title,
matchText: msg.content,
});
}
}
}
return matches;
}
/**
Gathers all metadata objects matching filtering parameters (e.g. pinned/archived tracking).
*/
public getMetadataIndex(filter?: { pinned?: boolean; archived?: boolean }): ConversationMetadataSnapshot[] {
let indices = Object.values(this.cache.metadata);
if (filter) {
if (filter.pinned !== undefined) {
indices = indices.filter(m => m.pinned === filter.pinned);
}
if (filter.archived !== undefined) {
indices = indices.filter(m => m.archived === filter.archived);
}
}
return indices.sort((a, b) => (b.lastMessageAt || b.updatedAt) - (a.lastMessageAt || a.updatedAt));
}
/**
Evicts a target conversation structure completely from persistent collections.
*/
public async deleteConversation(sessionId: string, conversationId: string): Promise<void> {
const session = this.cache.sessions[sessionId];
if (session) {
this.cache.sessions[sessionId] = {
...session,
conversationIds: session.conversationIds.filter(id => id !== conversationId),
};
}
delete this.cache.conversations[conversationId];
delete this.cache.metadata[conversationId];
await this.flushToDisk();
Logger.warn(Conversation payload completely purged from storage index: ${conversationId});
}
/**
Internal routine coordinating JSON string writing down to storage partitions.
*/
private async flushToDisk(): Promise<void> {
try {
const payloadString = JSON.stringify(this.cache, null, 2);
await RNFS.writeFile(this.databasePath, payloadString, 'utf8');
} catch (error) {
Logger.error(Failed executing transaction serialization flush to system storage disk, error);
throw error;
}
}
}
export default new ChatRepository();
