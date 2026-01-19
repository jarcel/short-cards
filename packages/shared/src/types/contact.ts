export interface ContactInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  email?: string;
  phone?: string;
  cellPhone?: string;
  workPhone?: string;
  organization?: string;
  title?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  notes?: string;
}

export interface Card extends ContactInfo {
  id: number;
  shortCode: string;
  createdAt: string;
  accessCount: number;
}

export interface CreateCardRequest {
  contact: ContactInfo;
}

export interface CreateCardResponse {
  success: true;
  shortCode: string;
  shortUrl: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string>;
}

export type ApiResponse<T> = T | ApiError;
