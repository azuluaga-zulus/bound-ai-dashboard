'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface BuildProgressModalProps {
  isOpen: boolean
  onComplete: (agentId?: string) => void
  agentId?: string | null
}

const funFacts = [
  "Analyzing your website and business model...",
  "Researching your industry and competitors...",
  "Training your agent on industry best practices...",
  "Creating personalized conversation flows...",
  "Setting up intelligent lead qualification rules...",
  "Configuring your agent's personality and tone...",
  "Optimizing responses for maximum conversion...",
  "Testing agent responses across different scenarios...",
  "Building your custom knowledge base...",
  "Finalizing deployment settings...",
  "Almost ready! Putting the finishing touches..."
]

export default function BuildProgressModal({ isOpen, onComplete, agentId }: BuildProgressModalProps) {
  const [progress, setProgress] = useState(0)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [agentFound, setAgentFound] = useState(false)
  const [pollCount, setPollCount] = useState(0)
  
  // Use refs to maintain current values in closures
  const agentFoundRef = useRef(false)
  const pollCountRef = useRef(0)
  
  // Update refs when state changes
  useEffect(() => {
    agentFoundRef.current = agentFound
  }, [agentFound])
  
  useEffect(() => {
    pollCountRef.current = pollCount
  }, [pollCount])

  // Poll for agent in Supabase while progress runs
  const pollForAgent = useCallback(async () => {
    if (!agentId || agentFoundRef.current) return

    try {
      const currentCount = pollCountRef.current + 1
      console.log(`🔍 Polling for agent (attempt ${currentCount}) during progress:`, agentId)
      
      const { data, error } = await supabase
        .from('agents')
        .select('agent_id')
        .eq('agent_id', agentId)
        .limit(1)

      if (!error && data && data.length > 0) {
        console.log('✅ Agent found during polling! Ready to proceed.')
        setAgentFound(true)
        agentFoundRef.current = true
        return true
      }
      
      setPollCount(currentCount)
      pollCountRef.current = currentCount
      return false
    } catch (error) {
      console.error('Error polling for agent:', error)
      return false
    }
  }, [agentId])

  useEffect(() => {
    if (!isOpen) {
      setProgress(0)
      setCurrentFactIndex(0)
      setAgentFound(false)
      setPollCount(0)
      return
    }

    let progressInterval: NodeJS.Timeout
    let factInterval: NodeJS.Timeout
    let pollInterval: NodeJS.Timeout | null = null
    let startPolling: NodeJS.Timeout

    // Progress animation over 90 seconds (to accommodate 75s processing time)
    progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + (100 / 900), 100) // 900 steps over 90 seconds
        
        // Complete early if agent found and progress > 20%
        if (agentFoundRef.current && newProgress > 20) {
          console.log('🚀 Agent found and minimum progress reached - completing early')
          setTimeout(() => onComplete(agentId || undefined), 500)
          return 100
        }
        
        // Normal completion at 100%
        if (newProgress >= 100) {
          setTimeout(() => onComplete(agentId || undefined), 500)
        }
        return newProgress
      })
    }, 100)

    // Fact rotation every 7.5 seconds
    factInterval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % funFacts.length)
    }, 7500)

    // Start polling for agent every 5 seconds after initial 10 second delay (N8N needs time to process)
    startPolling = setTimeout(() => {
      console.log('🔍 Starting agent polling (N8N processing takes ~75s)...')
      pollForAgent() // Initial poll
      
      pollInterval = setInterval(() => {
        if (!agentFoundRef.current) { // Only continue polling if not found yet
          pollForAgent()
        } else {
          console.log('🛑 Agent already found, stopping polling')
          if (pollInterval) clearInterval(pollInterval)
        }
      }, 5000) // Poll every 5 seconds (less aggressive but sufficient)
    }, 10000) // Wait 10s before starting to poll (give N8N time to start processing)

    return () => {
      clearInterval(progressInterval)
      clearInterval(factInterval)
      clearTimeout(startPolling)
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [isOpen, onComplete, agentId, pollForAgent])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0F121B]/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-lg w-full bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 rounded-2xl p-8 text-center"
          >
            
            {/* Header */}
            <div className="mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">
                Building Your AI Agent
              </h2>
              <p className="text-[#F5F7FA]/70">
                Hang tight – your agent will be ready in about 75 seconds
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[#F5F7FA]/60 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Fun Facts Carousel */}
            <div className="mb-8 h-16 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentFactIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#F5F7FA]/80 leading-relaxed"
                >
                  {funFacts[currentFactIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Skeleton Placeholders */}
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-3/4 mx-auto"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-1/2 mx-auto"></div>
            </div>

            {/* Bottom Note */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-[#F5F7FA]/40">
                We're personalizing everything based on your business details
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}