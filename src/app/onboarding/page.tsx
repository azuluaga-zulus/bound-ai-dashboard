'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'

import { onboardingSchema, type OnboardingFormData } from '@/types/onboarding-v2'
import { enrichWebsite, isEU, sanitizeInstagramHandle, sanitizeLinkedinPage, generateAgentPreview } from '@/utils/onboarding'
import BuildProgressModal from '@/components/onboarding/BuildProgressModal'

export default function OnboardingPage() {
  const router = useRouter()
  const [isEnriching, setIsEnriching] = useState(false)
  const [showBuildModal, setShowBuildModal] = useState(false)
  const [showGDPR, setShowGDPR] = useState(false)
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null)

  // Generate UUID compatible with all browsers
  const generateUUID = (): string => {
    // Check if crypto.randomUUID is available (modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    
    // Fallback UUID generation for older browsers
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    // TODO: remove dummy defaults in production
    defaultValues: {
      fullName: 'Carlos Zuluaga',
      email: 'carlos@thelittlesugars.com',
      companyName: 'The Little Sugars',
      websiteUrl: 'https://thelittlesugars.com/',
      instagramUrl: 'https://instagram.com/thelittlesugars',
      businessDescription: 'We believe that sharing our baked goods is one of the best ways to spread joy and happiness. That\'s why we offer a variety of curated gift boxes, perfect for every occasion! Whether you\'re looking for a sweet treat for yourself or for someone special, our gift boxes are packed with a selection of our most popular handcrafted baked goods. From classic chocolate chip cookies and fudgy brownies to buttery pies and cinnamon rolls, our gift boxes have something for everyone.',
      gdprConsent: false,
    }
  })

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid }, trigger } = methods

  // Check if user needs GDPR consent
  useEffect(() => {
    setShowGDPR(isEU())
  }, [])

  // Handle website enrichment
  const handleWebsiteBlur = async (url: string) => {
    if (!url || !url.startsWith('http')) return

    setIsEnriching(true)
    try {
      const enrichedData = await enrichWebsite(url)
      const currentValues = methods.getValues()
      
      // Only set if fields are empty
      if (!currentValues.instagramUrl && enrichedData.suggestedInstagram) {
        // Convert handle to full URL
        const instagramUrl = enrichedData.suggestedInstagram.startsWith('http') 
          ? enrichedData.suggestedInstagram 
          : `https://instagram.com/${enrichedData.suggestedInstagram.replace('@', '')}`
        setValue('instagramUrl', instagramUrl)
      }
      if (!currentValues.businessDescription && enrichedData.suggestedDescription) {
        setValue('businessDescription', enrichedData.suggestedDescription)
      }
    } catch (error) {
      console.error('Enrichment failed:', error)
    } finally {
      setIsEnriching(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data: OnboardingFormData) => {
    if (showGDPR && !data.gdprConsent) {
      return
    }

    const sanitizedData = {
      ...data,
    }

    // Generate unique agent ID
    const agentId = generateUUID()
    console.log('🆔 Generated agent ID (with UUID fix):', agentId)
    
    // Store agentId in state
    setCurrentAgentId(agentId)

    console.log('📤 Enviando datos a N8N:', { agentId, formData: sanitizedData })
    
    // Show progress bar immediately
    setShowBuildModal(true)
    
    try {
      // Send data to N8N webhook with unique ID
      const response = await fetch('https://agents.bound.work/webhook/onboarding-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_agent',
          agentId: agentId,
          formData: sanitizedData,
          timestamp: new Date().toISOString()
        })
      })

      console.log('🔄 Respuesta de N8N:', response.status, response.statusText)
      
      if (response.ok) {
        const responseData = await response.json()
        console.log('✅ Data recibida de N8N:', responseData)
        console.log('🔄 N8N confirmó procesamiento para agentId:', agentId)
        console.log('🗄️ ¿N8N devolvió agent_id?', responseData?.agent_id)
        console.log('🗄️ ¿Coinciden los IDs?', responseData?.agent_id === agentId)
        
        // N8N processed successfully - data should be in Supabase
        // Modal will handle polling for the agent while progress bar runs
        
      } else {
        console.error('❌ Error en N8N:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Detalles del error:', errorText)
        // On N8N error, still pass agentId to modal for timeout fallback
        // The modal will redirect with agentId after timeout
      }

    } catch (error) {
      console.error('❌ Error enviando a N8N:', error)
      // On network error, still pass agentId for timeout fallback
    }
  }


  // Handle build completion
  const handleBuildComplete = (agentId?: string) => {
    setShowBuildModal(false)
    if (agentId) {
      router.push(`/onboarding/success?agentId=${agentId}`)
    } else {
      // Fallback to onboarding if no agentId
      router.push('/onboarding')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-[#0F121B] text-[#F5F7FA] py-8 px-4">
      <FormProvider {...methods}>
        <div className="max-w-[960px] w-full mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Create Your AI Sales Agent
            </h1>
            <p className="text-[#F5F7FA]/70 text-lg max-w-2xl mx-auto">
              Tell us about your business and we'll create a personalized AI agent that converts visitors into customers.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-[960px] w-full mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl p-8"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Personal Information */}
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('fullName')}
                        id="fullName"
                        type="text"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 transition-colors ${
                          errors.fullName ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="Enter your full name"
                        aria-invalid={errors.fullName ? 'true' : 'false'}
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        id="email"
                        type="email"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 transition-colors ${
                          errors.email ? 'border-red-500' : 'border-white/20'
                        }`}
                        placeholder="you@company.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Company Information */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="companyName" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                      Company Name *
                    </label>
                    <input
                      {...register('companyName')}
                      id="companyName"
                      type="text"
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 transition-colors ${
                        errors.companyName ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Your Company Inc"
                      aria-invalid={errors.companyName ? 'true' : 'false'}
                    />
                    {errors.companyName && (
                      <p className="text-red-400 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="websiteUrl" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                      Website URL *
                    </label>
                    <input
                      {...register('websiteUrl')}
                      id="websiteUrl"
                      type="url"
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 transition-colors ${
                        errors.websiteUrl ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="https://yourcompany.com"
                      onBlur={(e) => handleWebsiteBlur(e.target.value)}
                      aria-invalid={errors.websiteUrl ? 'true' : 'false'}
                    />
                    {errors.websiteUrl && (
                      <p className="text-red-400 text-sm mt-1">{errors.websiteUrl.message}</p>
                    )}
                    {isEnriching && (
                      <p className="text-[#6D4CFF] text-sm mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Auto-filling Instagram URL...
                      </p>
                    )}
                  </motion.div>

                  {/* Social Media */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="instagramUrl" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                      Instagram URL (optional)
                    </label>
                    <input
                      {...register('instagramUrl')}
                      id="instagramUrl"
                      type="url"
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 transition-colors ${
                        errors.instagramUrl ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="https://instagram.com/yourpage"
                      aria-invalid={errors.instagramUrl ? 'true' : 'false'}
                    />
                    {errors.instagramUrl && (
                      <p className="text-red-400 text-sm mt-1">{errors.instagramUrl.message}</p>
                    )}
                  </motion.div>

                  {/* Business Description */}
                  <motion.div variants={itemVariants}>
                    <label htmlFor="businessDescription" className="block text-sm font-semibold text-[#F5F7FA] mb-2">
                      Business Description *
                    </label>
                    <textarea
                      {...register('businessDescription')}
                      id="businessDescription"
                      rows={5}
                      className={`w-full px-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] placeholder-[#F5F7FA]/40 resize-none transition-colors ${
                        errors.businessDescription ? 'border-red-500' : 'border-white/20'
                      }`}
                      placeholder="Describe your business, target customers, and what leads you want to generate. Example: 'We're a bakery specializing in custom gift boxes with handcrafted goods. Our ideal customers are people looking for special treats for occasions, corporate gifts, or personal indulgences.'"
                      aria-invalid={errors.businessDescription ? 'true' : 'false'}
                    />
                    {errors.businessDescription && (
                      <p className="text-red-400 text-sm mt-1">{errors.businessDescription.message}</p>
                    )}
                    <p className="text-[#F5F7FA]/50 text-sm mt-2">
                      The more details you provide, the better your AI agent will be.
                    </p>
                  </motion.div>

                  {/* GDPR Consent */}
                  {showGDPR && (
                    <motion.div variants={itemVariants} className="flex items-start gap-3">
                      <input
                        {...register('gdprConsent')}
                        id="gdprConsent"
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-[#6D4CFF] bg-white/5 border-white/20 rounded focus:ring-[#6D4CFF] focus:ring-2"
                      />
                      <label htmlFor="gdprConsent" className="text-sm text-[#F5F7FA]/70">
                        I accept the Data Processing Agreement and consent to the processing of my business data to create and optimize my AI agent. *
                      </label>
                      {errors.gdprConsent && (
                        <p className="text-red-400 text-sm">{errors.gdprConsent.message}</p>
                      )}
                    </motion.div>
                  )}

                  {/* Trust Badge */}
                  <motion.div variants={itemVariants} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <svg className="w-5 h-5 text-[#6D4CFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-sm text-[#F5F7FA]/70">
                      We encrypt your data and never share it.
                    </p>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={!isValid}
                      className="w-full px-8 py-4 bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] text-white font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-[#6D4CFF] flex items-center justify-center gap-3"
                      whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(109,76,255,0.45)' }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Create your personalized AI sales agent"
                    >
                      <span>Create My AI Agent</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.button>
                  </motion.div>
                </form>
            </motion.div>
          </div>
        </div>
      </FormProvider>

      {/* Build Progress Modal */}
      <BuildProgressModal 
        isOpen={showBuildModal} 
        onComplete={handleBuildComplete}
        agentId={currentAgentId}
      />
    </div>
  )
}