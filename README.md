# Short Cards

A vCard URL shortener that generates shareable contact card links. Create a digital business card and get a short URL that others can visit to download your vCard.

## Features

- Create vCards with contact information (name, email, phone, organization, address, etc.)
- Generate short URLs for easy sharing
- vCards generated on-the-fly (no file storage required)
- Responsive design with dark mode support
- Self-contained SQLite database

## Tech Stack

- **Frontend:** Vite + React 18 + TypeScript + CSS Modules
- **Backend:** Express + TypeScript
- **Database:** SQLite (via better-sqlite3)
- **Shared:** TypeScript types in workspace package

## Getting Started

### Prerequisites

- Node.js 18+
- npm 7+ (for workspaces support)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
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
│           └── utils/    # Base58 encoding
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
  "shortCode": "2",
  "shortUrl": "http://localhost:5001/c/2"
}
```

### Download vCard

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

## License

MIT
