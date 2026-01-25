import { db } from '../db/index.js';
import { generateRandomCode } from '@short-cards/shared';
import type { ContactInfo, Card } from '@short-cards/shared';
import { encrypt, decrypt } from '../utils/crypto.js';

// Fields that contain PII and should be encrypted
const ENCRYPTED_FIELDS = [
  'first_name',
  'last_name',
  'middle_name',
  'prefix',
  'suffix',
  'email',
  'phone',
  'cell_phone',
  'work_phone',
  'organization',
  'title',
  'website',
  'address_street',
  'address_city',
  'address_state',
  'address_postal_code',
  'address_country',
  'notes',
] as const;

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

function decryptRow(row: CardRow): CardRow {
  const decrypted = { ...row };
  for (const field of ENCRYPTED_FIELDS) {
    const value = decrypted[field];
    if (value) {
      (decrypted[field] as string) = decrypt(value);
    }
  }
  return decrypted;
}

function rowToCard(row: CardRow): Card {
  const decrypted = decryptRow(row);
  return {
    id: decrypted.id,
    shortCode: decrypted.short_code,
    firstName: decrypted.first_name,
    lastName: decrypted.last_name,
    middleName: decrypted.middle_name ?? undefined,
    prefix: decrypted.prefix ?? undefined,
    suffix: decrypted.suffix ?? undefined,
    email: decrypted.email ?? undefined,
    phone: decrypted.phone ?? undefined,
    cellPhone: decrypted.cell_phone ?? undefined,
    workPhone: decrypted.work_phone ?? undefined,
    organization: decrypted.organization ?? undefined,
    title: decrypted.title ?? undefined,
    website: decrypted.website ?? undefined,
    address: (decrypted.address_street || decrypted.address_city || decrypted.address_state || decrypted.address_postal_code || decrypted.address_country)
      ? {
          street: decrypted.address_street ?? undefined,
          city: decrypted.address_city ?? undefined,
          state: decrypted.address_state ?? undefined,
          postalCode: decrypted.address_postal_code ?? undefined,
          country: decrypted.address_country ?? undefined,
        }
      : undefined,
    notes: decrypted.notes ?? undefined,
    createdAt: decrypted.created_at,
    accessCount: decrypted.access_count,
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

// Helper to encrypt a value if it exists
function encryptValue(value: string | undefined | null): string | null {
  if (!value) return null;
  return encrypt(value);
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
    first_name: encrypt(contact.firstName),
    last_name: encrypt(contact.lastName),
    middle_name: encryptValue(contact.middleName),
    prefix: encryptValue(contact.prefix),
    suffix: encryptValue(contact.suffix),
    email: encryptValue(contact.email),
    phone: encryptValue(contact.phone),
    cell_phone: encryptValue(contact.cellPhone),
    work_phone: encryptValue(contact.workPhone),
    organization: encryptValue(contact.organization),
    title: encryptValue(contact.title),
    website: encryptValue(contact.website),
    address_street: encryptValue(contact.address?.street),
    address_city: encryptValue(contact.address?.city),
    address_state: encryptValue(contact.address?.state),
    address_postal_code: encryptValue(contact.address?.postalCode),
    address_country: encryptValue(contact.address?.country),
    notes: encryptValue(contact.notes),
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
