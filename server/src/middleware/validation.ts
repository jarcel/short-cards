import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
}).optional();

export const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  cellPhone: z.string().optional(),
  workPhone: z.string().optional(),
  organization: z.string().optional(),
  title: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: addressSchema,
  notes: z.string().optional(),
});

export const createCardSchema = z.object({
  contact: contactSchema,
});

export function validateCreateCard(req: Request, res: Response, next: NextFunction): void {
  const result = createCardSchema.safeParse(req.body);

  if (!result.success) {
    const errors: Record<string, string> = {};

    for (const error of result.error.errors) {
      const path = error.path.join('.');
      errors[path] = error.message;
    }

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors,
    });
    return;
  }

  req.body = result.data;
  next();
}
