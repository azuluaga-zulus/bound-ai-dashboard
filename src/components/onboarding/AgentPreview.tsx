'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { AgentPreview } from '@/types/onboarding-v2'

interface AgentPreviewProps {
  preview: AgentPreview
  isLoading?: boolean
}

export default function AgentPreview({ preview, isLoading = false }: AgentPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-8"
    >
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-xl p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#F5F7FA]">Agent Greeting Preview</h3>
            <p className="text-sm text-[#F5F7FA]/50">Live preview of your AI agent</p>
          </div>
        </div>

        {/* Chat Bubble */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="h-4 bg-white/5 rounded animate-pulse"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/5 rounded animate-pulse w-1/2"></div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Greeting */}
              <div className="bg-gradient-to-r from-[#6D4CFF]/10 to-[#4B75FF]/10 border border-[#6D4CFF]/20 rounded-lg p-4">
                <p className="text-sm text-[#F5F7FA]/90 leading-relaxed">
                  {preview.greeting}
                </p>
              </div>

              {/* Agent Traits */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#6D4CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.586l-4 4z" />
                  </svg>
                  <span className="text-sm font-medium text-[#F5F7FA]/70">Tone:</span>
                  <span className="text-sm text-[#F5F7FA]/90">{preview.tone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#6D4CFF] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <span className="text-sm font-medium text-[#F5F7FA]/70">Expertise:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {preview.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-[#6D4CFF]/20 text-[#F5F7FA]/80 rounded-md border border-[#6D4CFF]/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <p className="text-xs text-[#F5F7FA]/40 text-center">
            This preview updates as you fill out the form
          </p>
        </div>
      </div>
    </motion.div>
  )
}