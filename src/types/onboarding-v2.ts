import { z } from 'zod'

// Single-step form schema
export const onboardingSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  websiteUrl: z.string().url('Please enter a valid website URL'),
  instagramUrl: z.string()
    .refine(val => !val || (val.startsWith('http') && val.includes('instagram.com/')), {
      message: 'Instagram URL must start with http and include instagram.com/'
    })
    .optional(),
  businessDescription: z.string().min(50, 'Please provide at least 50 characters describing your business'),
  gdprConsent: z.boolean().optional(),
})

// TypeScript types
export type OnboardingFormData = z.infer<typeof onboardingSchema>

// Enrichment response type
export interface EnrichmentData {
  suggestedInstagram?: string
  suggestedLinkedin?: string
  suggestedDescription?: string
}

// Agent preview type
export interface AgentPreview {
  greeting: string
  tone: string
  expertise: string[]
}