import Database, { type Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/cards.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db: DatabaseType = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short_code TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      middle_name TEXT,
      prefix TEXT,
      suffix TEXT,
      email TEXT,
      phone TEXT,
      cell_phone TEXT,
      work_phone TEXT,
      organization TEXT,
      title TEXT,
      website TEXT,
      address_street TEXT,
      address_city TEXT,
      address_state TEXT,
      address_postal_code TEXT,
      address_country TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      access_count INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_cards_short_code ON cards(short_code);
  `);

  console.log('Database initialized');
}

export function closeDatabase(): void {
  db.close();
}
