'use client'

import { useState } from 'react'
import { BusinessData } from '@/types/onboarding'
import DirectFormStep from './DirectFormStep'
import N8NChatStep from './N8NChatStep'

type OnboardingStep = 'form' | 'chat' | 'confirmation'

interface OnboardingFlowProps {
  onComplete: (data: any) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('form')
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)

  const handleFormNext = (data: BusinessData) => {
    setBusinessData(data)
    setCurrentStep('chat')
  }

  const handleChatComplete = (icpData: any) => {
    setCurrentStep('confirmation')
    onComplete(icpData)
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'form':
        return <DirectFormStep onNext={handleFormNext} />
      
      case 'chat':
        return businessData ? (
          <N8NChatStep 
            businessData={businessData} 
            onComplete={handleChatComplete}
          />
        ) : null
      
      case 'confirmation':
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Tu Agente IA está Listo!
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Hemos creado tu agente personalizado para generar leads basado en tu perfil de cliente ideal.
              </p>
              <button
                onClick={() => window.location.href = '/template-demo'}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Ver mi Agente en Acción
              </button>
            </div>
          </div>
        )
      
      default:
        return <DirectFormStep onNext={handleFormNext} />
    }
  }

  return renderCurrentStep()
}