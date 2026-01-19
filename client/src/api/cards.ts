import type { ContactInfo, CreateCardResponse, ApiError } from '@short-cards/shared';

export async function createCard(contact: ContactInfo): Promise<CreateCardResponse> {
  const response = await fetch('/api/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contact }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiError;
    throw new Error(error.error || 'Failed to create card');
  }

  return data as CreateCardResponse;
}
