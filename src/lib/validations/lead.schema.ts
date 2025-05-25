import { z } from 'zod';

export const LeadStatus = z.enum(['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost']);
export const LeadPriority = z.enum(['low', 'medium', 'high']);
export const ActivityType = z.enum(['call', 'email', 'meeting', 'note', 'status_change']);

export const CreateLeadSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  company: z.string().min(1, 'Company is required').max(200),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  status: LeadStatus.default('new'),
  priority: LeadPriority.default('medium'),
  estimated_value: z.number().min(0).optional(),
  closing_probability: z.number().min(0).max(100).default(0),
  source: z.string().optional(),
  notes: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({
  id: z.string().uuid(),
});

export const LeadFilterSchema = z.object({
  status: LeadStatus.optional(),
  priority: LeadPriority.optional(),
  assigned_to: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort_by: z.enum(['created_at', 'updated_at', 'company', 'estimated_value']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

export const CreateActivitySchema = z.object({
  lead_id: z.string().uuid(),
  type: ActivityType,
  description: z.string().min(1, 'Description is required'),
  metadata: z.record(z.any()).optional(),
});

export const ImportLeadsSchema = z.object({
  leads: z.array(CreateLeadSchema).max(1000, 'Maximum 1000 leads per import'),
  skip_duplicates: z.boolean().default(true),
  update_existing: z.boolean().default(false),
});

export const BulkUpdateLeadsSchema = z.object({
  lead_ids: z.array(z.string().uuid()).min(1, 'At least one lead ID required'),
  updates: z.object({
    status: LeadStatus.optional(),
    priority: LeadPriority.optional(),
    assigned_to: z.string().uuid().optional(),
  }),
});

// Type exports
export type Lead = z.infer<typeof CreateLeadSchema> & {
  id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
};

export type LeadFilter = z.infer<typeof LeadFilterSchema>;
export type CreateLead = z.infer<typeof CreateLeadSchema>;
export type UpdateLead = z.infer<typeof UpdateLeadSchema>;
export type CreateActivity = z.infer<typeof CreateActivitySchema>;
export type ImportLeads = z.infer<typeof ImportLeadsSchema>;
export type BulkUpdateLeads = z.infer<typeof BulkUpdateLeadsSchema>; 