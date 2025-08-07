import type { EnrichmentData, AgentPreview, OnboardingFormData } from '@/types/onboarding-v2'

/**
 * Enriches website data by calling backend API
 * TODO: Replace with actual API call
 */
export async function enrichWebsite(url: string): Promise<EnrichmentData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock enrichment based on common patterns
  const domain = new URL(url).hostname.replace('www.', '')
  const brandName = domain.split('.')[0]
  
  return {
    suggestedInstagram: `@${brandName}`,
    suggestedLinkedin: `company/${brandName}`,
    suggestedDescription: `We are ${brandName}, a growing business focused on delivering exceptional value to our customers. We help our target audience solve their key challenges through our products and services.`
  }
}

/**
 * Checks if user is in EU region
 * TODO: Replace with actual IP geolocation
 */
export function isEU(): boolean {
  // Check browser language for EU countries
  const euLanguages = ['de', 'fr', 'es-ES', 'it', 'nl', 'pt', 'pl', 'ro', 'cs', 'hu']
  const userLang = navigator.language
  
  return euLanguages.some(lang => userLang.startsWith(lang))
}

/**
 * Sanitizes Instagram handle
 */
export function sanitizeInstagramHandle(input: string): string {
  return input.replace(/^(https?:\/\/)?(www\.)?(instagram\.com\/)?@?/, '').replace(/\/$/, '')
}

/**
 * Sanitizes LinkedIn page
 */
export function sanitizeLinkedinPage(input: string): string {
  return input.replace(/^(https?:\/\/)?(www\.)?(linkedin\.com\/)?/, '').replace(/\/$/, '')
}

/**
 * Generates agent preview based on form data
 */
export function generateAgentPreview(data: Partial<OnboardingFormData>): AgentPreview {
  const companyName = data.companyName || 'your company'
  const description = data.businessDescription || ''
  
  // Extract business type from description
  let businessType = 'business'
  if (description.toLowerCase().includes('restaurant')) businessType = 'restaurant'
  else if (description.toLowerCase().includes('clinic') || description.toLowerCase().includes('dental')) businessType = 'healthcare practice'
  else if (description.toLowerCase().includes('agency')) businessType = 'agency'
  else if (description.toLowerCase().includes('store') || description.toLowerCase().includes('shop')) businessType = 'retail business'
  else if (description.toLowerCase().includes('consultant')) businessType = 'consultancy'
  
  // Generate contextual greeting
  const greeting = `Hi there! I'm the AI assistant for ${companyName}. I'd love to help you learn more about how we can serve your needs. What brings you to our ${businessType} today?`
  
  // Determine tone based on business type
  let tone = 'Professional and helpful'
  if (businessType === 'restaurant') tone = 'Warm and welcoming'
  else if (businessType === 'healthcare practice') tone = 'Caring and professional'
  else if (businessType === 'agency') tone = 'Expert and consultative'
  
  // Extract expertise areas
  const expertise = []
  if (description.toLowerCase().includes('lead')) expertise.push('Lead Generation')
  if (description.toLowerCase().includes('customer') || description.toLowerCase().includes('client')) expertise.push('Customer Service')
  if (description.toLowerCase().includes('book') || description.toLowerCase().includes('appointment')) expertise.push('Appointment Booking')
  if (description.toLowerCase().includes('product') || description.toLowerCase().includes('service')) expertise.push('Product Information')
  if (expertise.length === 0) expertise.push('Business Inquiries')
  
  return {
    greeting,
    tone,
    expertise: expertise.slice(0, 3) // Max 3 expertise areas
  }
}

/**
 * Analytics tracking stub
 * TODO: Replace with actual analytics implementation (GA4, Mixpanel, etc.)
 */
export function track(event: string, properties?: Record<string, any>) {
  console.log(`Analytics: ${event}`, properties)
  
  // Example implementations:
  // gtag('event', event, properties)
  // mixpanel.track(event, properties)
  // amplitude.track(event, properties)
}