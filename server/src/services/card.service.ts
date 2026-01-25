import { db } from '../db/index.js';
import { generateRandomCode } from '@short-cards/shared';
import type { ContactInfo, Card } from '@short-cards/shared';

interface CardRow {
  id: number;
  short_code: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  prefix: string | null;
  suffix: string | null;
  email: string | null;
  phone: string | null;
  cell_phone: string | null;
  work_phone: string | null;
  organization: string | null;
  title: string | null;
  website: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  notes: string | null;
  created_at: string;
  access_count: number;
}

function rowToCard(row: CardRow): Card {
  return {
    id: row.id,
    shortCode: row.short_code,
    firstName: row.first_name,
    lastName: row.last_name,
    middleName: row.middle_name ?? undefined,
    prefix: row.prefix ?? undefined,
    suffix: row.suffix ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    cellPhone: row.cell_phone ?? undefined,
    workPhone: row.work_phone ?? undefined,
    organization: row.organization ?? undefined,
    title: row.title ?? undefined,
    website: row.website ?? undefined,
    address: (row.address_street || row.address_city || row.address_state || row.address_postal_code || row.address_country)
      ? {
          street: row.address_street ?? undefined,
          city: row.address_city ?? undefined,
          state: row.address_state ?? undefined,
          postalCode: row.address_postal_code ?? undefined,
          country: row.address_country ?? undefined,
        }
      : undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    accessCount: row.access_count,
  };
}

function shortCodeExists(shortCode: string): boolean {
  const row = db.prepare('SELECT 1 FROM cards WHERE short_code = ?').get(shortCode);
  return row !== undefined;
}

function generateUniqueShortCode(): string {
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    const code = generateRandomCode(8);
    if (!shortCodeExists(code)) {
      return code;
    }
  }

  // Extremely unlikely to reach here with 58^8 possibilities
  throw new Error('Failed to generate unique short code');
}

export function createCard(contact: ContactInfo): Card {
  const shortCode = generateUniqueShortCode();

  const insertStmt = db.prepare(`
    INSERT INTO cards (
      short_code, first_name, last_name, middle_name, prefix, suffix,
      email, phone, cell_phone, work_phone, organization, title, website,
      address_street, address_city, address_state, address_postal_code, address_country,
      notes
    ) VALUES (
      @short_code, @first_name, @last_name, @middle_name, @prefix, @suffix,
      @email, @phone, @cell_phone, @work_phone, @organization, @title, @website,
      @address_street, @address_city, @address_state, @address_postal_code, @address_country,
      @notes
    )
  `);

  insertStmt.run({
    short_code: shortCode,
    first_name: contact.firstName,
    last_name: contact.lastName,
    middle_name: contact.middleName || null,
    prefix: contact.prefix || null,
    suffix: contact.suffix || null,
    email: contact.email || null,
    phone: contact.phone || null,
    cell_phone: contact.cellPhone || null,
    work_phone: contact.workPhone || null,
    organization: contact.organization || null,
    title: contact.title || null,
    website: contact.website || null,
    address_street: contact.address?.street || null,
    address_city: contact.address?.city || null,
    address_state: contact.address?.state || null,
    address_postal_code: contact.address?.postalCode || null,
    address_country: contact.address?.country || null,
    notes: contact.notes || null,
  });

  return findCardByShortCode(shortCode)!;
}

export function findCardByShortCode(shortCode: string): Card | null {
  const row = db.prepare('SELECT * FROM cards WHERE short_code = ?').get(shortCode) as CardRow | undefined;

  if (!row) {
    return null;
  }

  return rowToCard(row);
}

export function incrementAccessCount(shortCode: string): void {
  db.prepare('UPDATE cards SET access_count = access_count + 1 WHERE short_code = ?').run(shortCode);
}
