import vCardsJS from 'vcards-js';
import type { Card } from '@short-cards/shared';

export function generateVCard(card: Card): string {
  const vCard = vCardsJS();

  // Name fields
  vCard.firstName = card.firstName;
  vCard.lastName = card.lastName;

  if (card.middleName) {
    vCard.middleName = card.middleName;
  }

  if (card.prefix) {
    vCard.namePrefix = card.prefix;
  }

  if (card.suffix) {
    vCard.nameSuffix = card.suffix;
  }

  // Contact fields
  if (card.email) {
    vCard.email = card.email;
  }

  if (card.phone) {
    vCard.homePhone = card.phone;
  }

  if (card.cellPhone) {
    vCard.cellPhone = card.cellPhone;
  }

  if (card.workPhone) {
    vCard.workPhone = card.workPhone;
  }

  // Organization fields
  if (card.organization) {
    vCard.organization = card.organization;
  }

  if (card.title) {
    vCard.title = card.title;
  }

  // Other fields
  if (card.website) {
    vCard.url = card.website;
  }

  if (card.notes) {
    vCard.note = card.notes;
  }

  // Address
  if (card.address) {
    vCard.homeAddress.street = card.address.street || '';
    vCard.homeAddress.city = card.address.city || '';
    vCard.homeAddress.stateProvince = card.address.state || '';
    vCard.homeAddress.postalCode = card.address.postalCode || '';
    vCard.homeAddress.countryRegion = card.address.country || '';
  }

  return vCard.getFormattedString();
}

export function getVCardFilename(card: Card): string {
  const safeName = `${card.firstName}_${card.lastName}`
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();

  return `${safeName}.vcf`;
}
