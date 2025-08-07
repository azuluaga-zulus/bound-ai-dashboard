'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { BusinessData } from '@/types/onboarding'

interface SimpleBusinessDataStepProps {
  userName: string
  onNext: (data: BusinessData) => void
  onBack: () => void
}

export default function SimpleBusinessDataStep({ userName, onNext, onBack }: SimpleBusinessDataStepProps) {
  const [formData, setFormData] = useState<BusinessData>({
    userName,
    companyName: '',
    businessDescription: '',
    website: '',
    instagram: '',
    linkedin: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (isFormValid()) {
      setIsLoading(true)
      setTimeout(() => onNext(formData), 1000)
    }
  }

  const isFormValid = () => {
    return formData.companyName.trim() && formData.businessDescription.trim()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Hola {userName}! 👋
              </h1>
              <p className="text-blue-100">
                Cuéntanos sobre tu negocio para crear tu agente perfecto
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Información Básica */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Información de tu negocio
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Nombre de tu empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Ej: Mi Empresa SAS"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      ¿A qué se dedica tu empresa? *
                    </label>
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                      placeholder="Ej: Ayudamos a pequeños restaurantes a aumentar sus ventas mediante marketing digital y estrategias de redes sociales..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Enlaces de tu negocio <span className="text-sm text-gray-500">(opcional pero recomendado)</span>
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Estos enlaces nos ayudan a entender mejor tu negocio y crear un agente más preciso
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">🌐</span>
                      Sitio web
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://tuempresa.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <span className="text-lg mr-2">📸</span>
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        placeholder="@tuempresa"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center">
                        <span className="text-lg mr-2">💼</span>
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="company/tuempresa"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="text-green-600 text-xl mr-3">🎯</div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">¿Qué haremos con esta información?</h4>
                    <p className="text-sm text-green-700">
                      Nuestro sistema analizará tu negocio y creará un agente IA especializado en generar leads para tu industria específica. Entre más información nos des, más preciso será tu agente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={onBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Atrás
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || isLoading}
                className={`px-8 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  isFormValid() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creando tu agente...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Generar mi Agente IA
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}