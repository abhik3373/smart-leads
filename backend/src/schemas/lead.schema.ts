import { z } from 'zod';

const statusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const sourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Invalid email').toLowerCase(),
    status: statusEnum.optional().default('New'),
    source: sourceEnum,
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2).trim().optional(),
    email: z.string().email().toLowerCase().optional(),
    status: statusEnum.optional(),
    source: sourceEnum.optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Lead ID required'),
  }),
});

export const leadQuerySchema = z.object({
  query: z.object({
    status: statusEnum.optional(),
    source: sourceEnum.optional(),
    search: z.string().optional(),
    sort: z.enum(['latest', 'oldest']).optional().default('latest'),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
  }),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>['body'];
export type LeadQueryInput = z.infer<typeof leadQuerySchema>['query'];
