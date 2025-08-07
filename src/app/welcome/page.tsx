'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  const handleCreateAgent = () => {
    router.push('/onboarding')
  }

  return (
    <main className="min-h-screen bg-[#0F121B] text-[#F5F7FA] flex items-center justify-center px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <div className="border border-white/5 rounded-xl p-8 md:p-12 lg:p-16 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex flex-col gap-y-10 items-center text-center">
            
            {/* Brand Logo */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6D4CFF] to-[#4B75FF] flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">B</span>
            </div>

            {/* Hero Content */}
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Welcome to Bound
              </h1>
              <p className="text-base md:text-lg text-[#F5F7FA]/70 leading-relaxed max-w-2xl mx-auto">
                Great – you now have full access. Let's create your personalized AI agent that understands your business and turns visitors into customers.
              </p>
            </div>

            {/* Mini Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              
              {/* Quick Setup */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#6D4CFF]/10 flex items-center justify-center mb-4">
                  <svg 
                    className="w-6 h-6 text-[#6D4CFF]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
                <p className="text-sm text-[#F5F7FA]/60 leading-relaxed">
                  Your agent is live in under 2 minutes.
                </p>
              </div>

              {/* Intelligent AI */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#6D4CFF]/10 flex items-center justify-center mb-4">
                  <svg 
                    className="w-6 h-6 text-[#6D4CFF]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Intelligent AI</h3>
                <p className="text-sm text-[#F5F7FA]/60 leading-relaxed">
                  Trained to grasp your unique business.
                </p>
              </div>

              {/* More Leads */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#6D4CFF]/10 flex items-center justify-center mb-4">
                  <svg 
                    className="w-6 h-6 text-[#6D4CFF]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">More Leads</h3>
                <p className="text-sm text-[#F5F7FA]/60 leading-relaxed">
                  Converts 24/7 with zero extra effort.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={handleCreateAgent}
              className="bg-gradient-to-r from-[#6D4CFF] to-[#4B75FF] rounded-lg px-8 py-4 font-semibold text-white text-lg flex items-center gap-3 shadow-lg"
              whileHover={{ 
                y: -2, 
                boxShadow: '0 4px 20px rgba(77,84,255,0.45)' 
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Start onboarding and tell us about your business"
            >
              <span>Create My AI Agent</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>

          </div>
        </div>
      </section>
    </main>
  )
}