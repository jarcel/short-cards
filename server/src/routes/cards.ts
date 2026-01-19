import { Router } from 'express';
import { createCard, findCardByShortCode, incrementAccessCount } from '../services/card.service.js';
import { generateVCard, getVCardFilename } from '../services/vcard.service.js';
import { validateCreateCard } from '../middleware/validation.js';
import type { CreateCardRequest, CreateCardResponse } from '@short-cards/shared';

const router = Router();

// Create a new card
router.post('/api/cards', validateCreateCard, (req, res) => {
  const { contact } = req.body as CreateCardRequest;

  const card = createCard(contact);

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const shortUrl = `${baseUrl}/c/${card.shortCode}`;

  const response: CreateCardResponse = {
    success: true,
    shortCode: card.shortCode,
    shortUrl,
  };

  res.status(201).json(response);
});

// Download vCard by short code
router.get('/c/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  const card = findCardByShortCode(shortCode);

  if (!card) {
    res.status(404).json({
      success: false,
      error: 'Card not found',
    });
    return;
  }

  // Increment access count
  incrementAccessCount(shortCode);

  // Generate vCard
  const vcfContent = generateVCard(card);
  const filename = getVCardFilename(card);

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(vcfContent);
});

export default router;
