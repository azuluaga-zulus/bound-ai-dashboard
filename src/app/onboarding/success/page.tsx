'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { track } from '@/utils/onboarding'
import { supabase } from '@/lib/supabase'
import SearchableSelect from '@/components/ui/SearchableSelect'
import MultiSelect from '@/components/ui/MultiSelect'
import Dropdown from '@/components/ui/Dropdown'
import { 
  INDUSTRY_OPTIONS, 
  GEOGRAPHY_OPTIONS, 
  GEOGRAPHY_OPTIONS_GROUPED,
  JOB_TITLE_OPTIONS, 
  DEPARTMENT_OPTIONS, 
  COMMUNICATION_STYLES,
  COMPANY_SIZE_PRESETS
} from '@/data/editor-options'

// Agent data structure from Supabase
interface AgentData {
  agent_id: string
  user_name?: string
  company_name?: string
  email?: string
  business_description?: string
  icp_geo?: string
  icp_industries?: string
  icp_employees?: number
  icp_locations?: number
  icp_revenue?: number
  icp_traits?: string
  icp_title?: string
  icp_department?: string
  icp_motivations?: string
  icp_why?: string
  key_differentiators?: string
  comm_style?: string
  rationale_business_description?: string
  rationale_icp?: string
  rationale_diff?: string
  rationale_comms?: string
}

// Helper functions for data normalization
function parseKeyDifferentiators(diffStr: string | undefined): string[] {
  if (!diffStr) return []
  return diffStr
    .split(/[;,]/)
    .map(d => d.trim())
    .filter(d => d.length > 0)
    .slice(0, 3) // Top 3
}

function formatIndustries(industries: string | undefined): string {
  if (!industries) return ''
  const items = industries.split(',').map(i => i.trim()).filter(i => i)
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  const last = items.pop()
  return `${items.join(', ')}, and ${last}`
}

function formatCompanySize(employees?: number, locations?: number, revenue?: number): string {
  const parts = []
  if (employees) parts.push(`~${employees.toLocaleString()} employees`)
  if (locations) parts.push(`${locations} location${locations > 1 ? 's' : ''}`)
  if (revenue) parts.push(`$${(revenue / 1000000).toFixed(1)}M revenue`)
  return parts.join(' • ')
}

function truncateStyle(style: string | undefined, maxLength = 120): string {
  if (!style) return ''
  if (style.length <= maxLength) return style
  return style.substring(0, maxLength).trim() + '...'
}

export default function OnboardingSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [agentData, setAgentData] = useState<AgentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [showRationale, setShowRationale] = useState(false)
  const [editorData, setEditorData] = useState<Partial<AgentData & { icp_industries_array?: string[], icp_geo_array?: string[], icp_title_array?: string[], icp_department_array?: string[] }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [icpPreview, setIcpPreview] = useState('')

  // Fetch agent data on mount
  useEffect(() => {
    const agentId = searchParams.get('agentId')
    
    if (!agentId) {
      setHasError(true)
      setErrorMessage('No agent ID provided. Please complete the onboarding process.')
      setIsLoading(false)
      return
    }

    const fetchAgentData = async () => {
      try {
        setIsLoading(true)
        
        console.log('🔍 Loading agent data for success page:', agentId)
        
        // Fetch specific agent - should be available since modal polled for it
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false })
          .limit(1)
        
        if (error) {
          console.error('❌ Error de Supabase:', error)
          throw new Error(error.message)
        }
        
        if (!data || data.length === 0) {
          console.error('❌ Agent not found - this should not happen after modal polling')
          throw new Error('Agent not found')
        }
        
        // Get the first (most recent) record
        const agentRecord = data[0]
        console.log('✅ Agente cargado en success page:', agentRecord.agent_id)
        
        setAgentData(agentRecord)
        // Convert comma-separated strings to arrays for multi-selects
        const editorRecord = {
          ...agentRecord,
          icp_industries_array: agentRecord.icp_industries ? agentRecord.icp_industries.split(',').map(i => i.trim()).filter(i => i) : [],
          icp_geo_array: agentRecord.icp_geo ? agentRecord.icp_geo.split(',').map(g => g.trim()).filter(g => g) : [],
          icp_title_array: agentRecord.icp_title ? [agentRecord.icp_title] : [],
          icp_department_array: agentRecord.icp_department ? [agentRecord.icp_department] : []
        }
        setEditorData(editorRecord)
        
        track('agent_success_loaded', { agentId, source: 'supabase' })
      } catch (error) {
        console.error('Failed to load agent:', error)
        setHasError(true)
        setErrorMessage('Failed to load your agent data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgentData()
  }, [searchParams])

  // Update ICP preview in real-time
  useEffect(() => {
    if (Object.keys(editorData).length > 0) {
      const preview = buildICPNarrative(editorData)
      setIcpPreview(preview)
    }
  }, [editorData])

  const handleUpdateAgent = async () => {
    if (!agentData) return
    
    setIsSubmitting(true)
    try {
      // Convert arrays back to comma-separated strings for database
      const updateData = {
        ...editorData,
        icp_industries: editorData.icp_industries_array?.join(', ') || editorData.icp_industries,
        icp_geo: editorData.icp_geo_array?.join(', ') || editorData.icp_geo,
        icp_title: editorData.icp_title_array?.join(', ') || editorData.icp_title,
        icp_department: editorData.icp_department_array?.join(', ') || editorData.icp_department
      }
      delete updateData.icp_industries_array
      delete updateData.icp_geo_array
      delete updateData.icp_title_array
      delete updateData.icp_department_array
      
      // Update in Supabase
      const { error } = await supabase
        .from('agents')
        .update(updateData)
        .eq('agent_id', agentData.agent_id)
      
      if (error) throw new Error(error.message)
      
      // Update local state with converted data
      const updatedAgentData = {
        ...agentData,
        ...updateData
      }
      setAgentData(updatedAgentData)
      setEditorOpen(false)
      track('agent_updated', { agentId: agentData.agent_id })
    } catch (error) {
      console.error('Failed to update agent:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Build ICP narrative
  const buildICPNarrative = (data: Partial<AgentData & { icp_industries_array?: string[], icp_geo_array?: string[], icp_title_array?: string[], icp_department_array?: string[] }>) => {
    // Handle both array and string formats
    const industries = data.icp_industries_array?.length ? 
      formatIndustries(data.icp_industries_array.join(', ')) :
      formatIndustries(data.icp_industries)
    
    const geo = data.icp_geo_array?.length ? 
      data.icp_geo_array.join(', ') :
      data.icp_geo
      
    const employees = data.icp_employees
    const locations = data.icp_locations
    const revenue = data.icp_revenue
    const traits = data.icp_traits
    
    const title = data.icp_title_array?.length ? 
      data.icp_title_array.join(', ') :
      data.icp_title
      
    const department = data.icp_department_array?.length ? 
      data.icp_department_array.join(', ') :
      data.icp_department
      
    const motivations = data.icp_motivations
    const why = data.icp_why
    
    let narrative = "I'll prioritize "
    
    // Industries and geography - only show if we have data
    if (industries) {
      narrative += `${industries} companies`
    } else {
      narrative += "businesses"
    }
    
    // Only add geography if it exists and is not a placeholder
    if (geo && geo.trim() !== "" && !geo.toLowerCase().includes("unknown") && !geo.toLowerCase().includes("various")) {
      narrative += ` in ${geo}`
    }
    
    narrative += ". "
    
    // Company size details
    const sizeDetails = []
    if (employees && employees > 0) sizeDetails.push(`around ${employees.toLocaleString()} employees`)
    if (locations && locations > 0) sizeDetails.push(`${locations} location${locations > 1 ? 's' : ''}`)
    if (revenue && revenue > 0) sizeDetails.push(`$${(revenue / 1000000).toFixed(1)}M annual revenue`)
    
    if (sizeDetails.length > 0) {
      if (sizeDetails.length === 1) {
        narrative += `I focus on companies with ${sizeDetails[0]}. `
      } else if (sizeDetails.length === 2) {
        narrative += `I focus on companies with ${sizeDetails[0]} and ${sizeDetails[1]}. `
      } else {
        const last = sizeDetails.pop()
        narrative += `I focus on companies with ${sizeDetails.join(', ')}, and ${last}. `
      }
    }
    
    // Decision maker details
    if (title || department) {
      narrative += "My ideal contact is "
      if (title && department) {
        narrative += `a ${title} in ${department}. `
      } else if (title) {
        narrative += `a ${title}. `
      } else if (department) {
        narrative += `someone in ${department}. `
      }
    }
    
    // Motivations and traits
    if (motivations && motivations.trim() !== "") {
      narrative += `They're motivated by ${motivations.toLowerCase()}. `
    }
    
    if (traits && traits.trim() !== "") {
      const traitsText = traits.toLowerCase().startsWith('value') || traits.toLowerCase().startsWith('they') 
        ? traits 
        : `value ${traits.toLowerCase()}`
      narrative += `They ${traitsText}. `
    }
    
    return narrative.trim()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F121B] text-[#F5F7FA] flex items-center justify-center px-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="h-12 bg-white/5 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 bg-white/5 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-white/5 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#0F121B] text-[#F5F7FA] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Unable to Load Agent</h1>
            <p className="text-[#F5F7FA]/70 mb-6">{errorMessage}</p>
            <button
              onClick={() => router.push('/onboarding')}
              className="px-6 py-3 bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] text-white font-semibold rounded-lg"
            >
              Back to Onboarding
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!agentData) {
    console.log('🚫 agentData is null, no render')
    return null
  }

  console.log('🎨 Rendering with agentData:', agentData)
  
  const userName = agentData.user_name || 'there'
  const agentName = 'Sofia' // Default agent name
  const differentiators = parseKeyDifferentiators(agentData.key_differentiators)
  const hasRationale = agentData.rationale_business_description || 
    agentData.rationale_icp || 
    agentData.rationale_diff || 
    agentData.rationale_comms

  console.log('👤 userName:', userName)
  console.log('🔧 differentiators:', differentiators)
  console.log('📝 hasRationale:', hasRationale)

  return (
    <div className="min-h-screen bg-[#0F121B] text-[#F5F7FA] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Hi {userName}! I'm {agentName}, your new AI sales agent.
          </h1>
          <p className="text-xl text-[#F5F7FA]/70">
            I'm online 24/7 and ready to turn visitors into leads. Here's what I already know:
          </p>
        </motion.div>

        {/* Two Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Card 1: About Your Business */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-[#6D4CFF] mb-4">
              Here's what I understand about your business:
            </h2>
            <p className="text-[#F5F7FA]/80 leading-relaxed mb-4">
              {agentData.business_description || 'Your business description will appear here.'}
              {agentData.comm_style && ` I'll keep my tone ${truncateStyle(agentData.comm_style)}.`}
            </p>
            {differentiators.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {differentiators.map((diff, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#6D4CFF]/20 text-[#F5F7FA]/90 text-sm rounded-full border border-[#6D4CFF]/30"
                  >
                    {diff}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Card 2: Your Primary ICP */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-[#6D4CFF] mb-4">
              Who I'll focus on first:
            </h2>
            <p className="text-[#F5F7FA]/80 leading-relaxed mb-6">
              {buildICPNarrative(agentData)}
            </p>
            
            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              {(agentData.icp_title || agentData.icp_department) && (
                <div className="flex justify-between">
                  <span className="text-[#F5F7FA]/60">Decision-maker:</span>
                  <span className="text-[#F5F7FA]/90">
                    {agentData.icp_title && agentData.icp_department 
                      ? `${agentData.icp_title}, ${agentData.icp_department}`
                      : agentData.icp_title || `${agentData.icp_department} team member`
                    }
                  </span>
                </div>
              )}
              
              {agentData.icp_industries && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#F5F7FA]/60">Industries:</span>
                  <span className="text-[#F5F7FA]/90 text-right">{formatIndustries(agentData.icp_industries)}</span>
                </div>
              )}
              
              {agentData.icp_geo && agentData.icp_geo.trim() !== "" && !agentData.icp_geo.toLowerCase().includes("unknown") && !agentData.icp_geo.toLowerCase().includes("various") && (
                <div className="flex justify-between">
                  <span className="text-[#F5F7FA]/60">Geography:</span>
                  <span className="text-[#F5F7FA]/90">{agentData.icp_geo}</span>
                </div>
              )}
              
              {formatCompanySize(agentData.icp_employees, agentData.icp_locations, agentData.icp_revenue) && (
                <div className="flex justify-between">
                  <span className="text-[#F5F7FA]/60">Company size:</span>
                  <span className="text-[#F5F7FA]/90">
                    {formatCompanySize(agentData.icp_employees, agentData.icp_locations, agentData.icp_revenue)}
                  </span>
                </div>
              )}
              
              {agentData.icp_motivations && agentData.icp_motivations.trim() !== "" && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#F5F7FA]/60">Motivations:</span>
                  <span className="text-[#F5F7FA]/90 text-right">{agentData.icp_motivations}</span>
                </div>
              )}
              
              {agentData.icp_traits && agentData.icp_traits.trim() !== "" && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#F5F7FA]/60">Values:</span>
                  <span className="text-[#F5F7FA]/90 text-right">{agentData.icp_traits}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Rationale Box */}
        {hasRationale && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-br from-[#6D4CFF]/10 to-[#4B75FF]/5 border border-[#6D4CFF]/20 rounded-xl p-6 relative overflow-hidden">
              
              {/* AI Sparkle Background */}
              <div className="absolute top-4 right-4 opacity-20">
                <div className="relative">
                  <div className="absolute inset-0 animate-ping">
                    ✨
                  </div>
                  <div>✨</div>
                </div>
              </div>
              
              {/* Header with AI Badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#6D4CFF]/20 to-[#4B75FF]/20 border border-[#6D4CFF]/30 rounded-full">
                  <span className="text-lg animate-pulse">✨</span>
                  <span className="text-xs font-semibold text-[#6D4CFF] tracking-wide">AI GENERATED</span>
                </div>
                <h3 className="text-lg font-semibold text-[#F5F7FA]">Why I Made These Choices</h3>
              </div>
              
              {/* Rationale Content */}
              <div className="space-y-4">
                {agentData.rationale_business_description && (
                  <div className="bg-white/[0.03] border-l-4 border-[#6D4CFF]/50 pl-4 py-2">
                    <h4 className="text-sm font-medium text-[#6D4CFF] mb-1">Business Understanding</h4>
                    <p className="text-sm text-[#F5F7FA]/80 leading-relaxed">
                      {agentData.rationale_business_description}
                    </p>
                  </div>
                )}
                
                {agentData.rationale_icp && (
                  <div className="bg-white/[0.03] border-l-4 border-[#6D4CFF]/50 pl-4 py-2">
                    <h4 className="text-sm font-medium text-[#6D4CFF] mb-1">Target Audience Analysis</h4>
                    <p className="text-sm text-[#F5F7FA]/80 leading-relaxed">
                      {agentData.rationale_icp}
                    </p>
                  </div>
                )}
                
                {agentData.rationale_diff && (
                  <div className="bg-white/[0.03] border-l-4 border-[#6D4CFF]/50 pl-4 py-2">
                    <h4 className="text-sm font-medium text-[#6D4CFF] mb-1">Differentiator Selection</h4>
                    <p className="text-sm text-[#F5F7FA]/80 leading-relaxed">
                      {agentData.rationale_diff}
                    </p>
                  </div>
                )}
                
                {agentData.rationale_comms && (
                  <div className="bg-white/[0.03] border-l-4 border-[#6D4CFF]/50 pl-4 py-2">
                    <h4 className="text-sm font-medium text-[#6D4CFF] mb-1">Communication Style Reasoning</h4>
                    <p className="text-sm text-[#F5F7FA]/80 leading-relaxed">
                      {agentData.rationale_comms}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Footer Note */}
              <div className="mt-4 pt-3 border-t border-[#6D4CFF]/20">
                <p className="text-xs text-[#F5F7FA]/50 italic">
                  This analysis was automatically generated based on your website, social media, and business information.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] text-white font-bold text-lg rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#6D4CFF]"
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(109,76,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            aria-label="Navigate to dashboard"
          >
            Looks great — Go to Dashboard
          </motion.button>
          
          <motion.button
            onClick={() => setEditorOpen(true)}
            className="flex-1 px-8 py-4 border-2 border-[#6D4CFF] text-[#6D4CFF] font-semibold text-lg rounded-lg hover:bg-[#6D4CFF] hover:text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#6D4CFF]"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Open editor to polish agent"
          >
            Let's polish it
          </motion.button>
        </motion.div>
      </div>

      {/* Slide-in Editor */}
      <AnimatePresence>
        {editorOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditorOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Editor Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-full bg-[#0F121B] border-l border-white/10 shadow-2xl z-50 w-full sm:w-[380px] overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h3 className="text-xl font-bold text-[#F5F7FA]">Polish Your Agent</h3>
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#F5F7FA]/70 hover:text-[#F5F7FA] hover:bg-white/20 transition-colors"
                    aria-label="Close editor"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#6D4CFF] mb-4">BUSINESS</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          Description
                        </label>
                        <textarea
                          value={editorData.business_description || ''}
                          onChange={(e) => {
                            setEditorData({ ...editorData, business_description: e.target.value })
                            // Auto-resize
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = `${Math.max(target.scrollHeight, 80)}px`
                          }}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm resize-none overflow-hidden"
                          style={{ minHeight: '80px' }}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = `${Math.max(target.scrollHeight, 80)}px`
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          Communication Style
                        </label>
                        <select
                          value={editorData.comm_style || ''}
                          onChange={(e) => setEditorData({ ...editorData, comm_style: e.target.value })}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm appearance-none cursor-pointer"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgb(245 247 250 / 0.5)'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e")`,,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1rem'
                          }}
                        >
                          <option value="" className="text-[#F5F7FA]/50 bg-[#1A1D2E]">
                            Select communication style...
                          </option>
                          {COMMUNICATION_STYLES.map((style, index) => (
                            <option key={index} value={style} className="text-[#F5F7FA] bg-[#1A1D2E]">
                              {style}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          Key Differentiators
                        </label>
                        <textarea
                          value={editorData.key_differentiators || ''}
                          onChange={(e) => setEditorData({ ...editorData, key_differentiators: e.target.value })}
                          rows={3}
                          placeholder="Separate with semicolons"
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#6D4CFF] mb-4">ICP</h4>
                    
                    <div className="space-y-4">
                      <MultiSelect
                        label="Industries"
                        value={editorData.icp_industries_array || []}
                        onChange={(values) => setEditorData({ ...editorData, icp_industries_array: values })}
                        options={INDUSTRY_OPTIONS}
                        placeholder="Select industries..."
                      />
                      
                      <MultiSelect
                        label="Geography (US-focused)"
                        value={editorData.icp_geo_array || []}
                        onChange={(values) => setEditorData({ ...editorData, icp_geo_array: values })}
                        options={GEOGRAPHY_OPTIONS_GROUPED}
                        placeholder="Select US locations..."
                        maxHeight="max-h-80"
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Dropdown
                          label="Company Size"
                          value={String(editorData.icp_employees || '')}
                          onChange={(value) => setEditorData({ ...editorData, icp_employees: value ? parseInt(value) : undefined })}
                          options={COMPANY_SIZE_PRESETS.map(preset => ({ value: preset.employees, label: preset.label }))}
                          placeholder="Select company size..."
                        />
                        <div>
                          <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                            Revenue ($M)
                          </label>
                          <input
                            type="number"
                            value={editorData.icp_revenue ? editorData.icp_revenue / 1000000 : ''}
                            onChange={(e) => setEditorData({ ...editorData, icp_revenue: parseFloat(e.target.value) * 1000000 || undefined })}
                            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <MultiSelect
                          label="Job Titles"
                          value={editorData.icp_title_array || []}
                          onChange={(values) => setEditorData({ ...editorData, icp_title_array: values })}
                          options={JOB_TITLE_OPTIONS}
                          placeholder="Select job titles..."
                        />
                        <MultiSelect
                          label="Departments"
                          value={editorData.icp_department_array || []}
                          onChange={(values) => setEditorData({ ...editorData, icp_department_array: values })}
                          options={DEPARTMENT_OPTIONS}
                          placeholder="Select departments..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          Motivations
                        </label>
                        <textarea
                          value={editorData.icp_motivations || ''}
                          onChange={(e) => setEditorData({ ...editorData, icp_motivations: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          Values/Traits
                        </label>
                        <textarea
                          value={editorData.icp_traits || ''}
                          onChange={(e) => setEditorData({ ...editorData, icp_traits: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#6D4CFF] focus:border-[#6D4CFF] text-[#F5F7FA] text-sm"
                        />
                      </div>
                      
                      
                      <div>
                        <label className="block text-sm font-medium text-[#F5F7FA]/70 mb-2">
                          ICP Preview
                        </label>
                        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-lg text-sm text-[#F5F7FA]/70">
                          {icpPreview || buildICPNarrative(editorData)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="p-6 border-t border-white/10">
                  <motion.button
                    onClick={handleUpdateAgent}
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-[#6D4CFF]"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? 'Updating...' : "Let's go"}
                  </motion.button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}