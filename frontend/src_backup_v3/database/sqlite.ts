
import * as SQLite from "expo-sqlite";

export const db =
SQLite.openDatabaseSync("evolva.db");

export function initializeDatabase() {
db.execSync("CREATE TABLE IF NOT EXISTS messages ( id TEXT PRIMARY KEY NOT NULL, content TEXT NOT NULL, role TEXT NOT NULL, createdAt INTEGER NOT NULL );");

db.execSync("CREATE TABLE IF NOT EXISTS memories ( id TEXT PRIMARY KEY NOT NULL, content TEXT NOT NULL, category TEXT NOT NULL, createdAt INTEGER NOT NULL );");

db.execSync("CREATE TABLE IF NOT EXISTS journal_entries ( id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, createdAt INTEGER NOT NULL );");

db.execSync("CREATE TABLE IF NOT EXISTS goals ( id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, completed INTEGER NOT NULL, createdAt INTEGER NOT NULL );");
}

