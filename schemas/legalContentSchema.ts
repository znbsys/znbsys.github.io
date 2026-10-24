import { z } from 'zod';

export const LegalSectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  items: z.array(z.string().min(1)).optional(),
});

export const LegalPageSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(320),
  updatedAt: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(LegalSectionSchema).min(1),
});

export const LegalContentSchema = z.object({
  labels: z.object({
    updatedAt: z.string().min(1),
    toc: z.string().min(1),
  }),
  privacy: LegalPageSchema,
  terms: LegalPageSchema,
});

export type LegalSection = z.infer<typeof LegalSectionSchema>;
export type LegalPage = z.infer<typeof LegalPageSchema>;
export type LegalContent = z.infer<typeof LegalContentSchema>;
export type LegalPageKey = 'privacy' | 'terms';
