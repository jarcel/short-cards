# short.cards

Turn contact info into shareable links. Anyone can download your short.card with one tap.

## Features

- Create digital contact cards with full vCard support
- Generate short URLs with cryptographically random codes
- Field-level AES-256-GCM encryption for PII at rest
- vCards generated on-the-fly (no file storage)
- Self-contained SQLite database

## Tech Stack

- **Frontend:** Vite + React 18 + TypeScript + CSS Modules
- **Backend:** Express + TypeScript
- **Database:** SQLite (via better-sqlite3)
- **Security:** AES-256-GCM encryption, crypto-random short codes

## Getting Started

### Prerequisites

- Node.js 18+
- npm 7+ (for workspaces support)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file and generate encryption key
cp .env.example .env

# Generate a secure encryption key
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))" >> .env
```

### Development

```bash
# Start both client and server
npm run dev

# Or start individually
npm run dev:server   # Server on http://localhost:5001
npm run dev:client   # Client on http://localhost:3000
```

### Production Build

```bash
# Build all packages
npm run build

# Start production server
npm run start
```

## Project Structure

```
short-cards/
├── packages/
│   └── shared/           # Shared types and utilities
│       └── src/
│           ├── types/    # ContactInfo, API types
│           └── utils/    # Random code generation
├── client/               # React frontend
│   └── src/
│       ├── api/          # API client
│       ├── components/   # React components
│       └── styles/       # Global CSS
└── server/               # Express backend
    └── src/
        ├── db/           # SQLite setup
        ├── routes/       # API routes
        ├── services/     # Card and vCard services
        ├── utils/        # Encryption utilities
        └── middleware/   # Validation, error handling
```

## API

### Create a Card

```
POST /api/cards
Content-Type: application/json

{
  "contact": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "cellPhone": "+1-555-123-4567",
    "organization": "Acme Corp",
    "title": "Software Engineer"
  }
}
```

Response:

```json
{
  "success": true,
  "shortCode": "2hzV4hzD",
  "shortUrl": "http://localhost:5001/c/2hzV4hzD"
}
```

### Download short.card

```
GET /c/:shortCode
```

Returns a `.vcf` file download.

## Configuration

Environment variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `BASE_URL` | `http://localhost:5001` | Base URL for generated links |
| `DATABASE_PATH` | `server/data/cards.db` | SQLite database path |
| `ENCRYPTION_KEY` | (required) | AES-256 encryption key for PII |

## Security

- **Random Short Codes:** 8-character codes generated with `crypto.getRandomValues()` prevent enumeration attacks
- **Encrypted Storage:** All PII fields are AES-256-GCM encrypted at rest in the database
- **On-the-fly Generation:** vCards are decrypted and generated per-request, never stored as files

## License

MIT
