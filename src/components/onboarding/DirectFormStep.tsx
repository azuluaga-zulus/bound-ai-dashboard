'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { BusinessData } from '@/types/onboarding'

interface DirectFormStepProps {
  onNext: (data: BusinessData) => void
}

export default function DirectFormStep({ onNext }: DirectFormStepProps) {
  const [formData, setFormData] = useState<BusinessData>({
    userName: 'Carlos Martinez',
    email: 'carlos@miempresa.com',
    companyName: 'RestaurantePro SAS',
    website: 'https://restaurantepro.com',
    instagram: '@restaurantepro',
    linkedin: 'company/restaurantepro',
    businessDescription: 'Somos un restaurante de comida mediterránea en Bogotá que necesita atraer más clientes para nuestras cenas especiales y eventos corporativos. Nuestro cliente ideal son ejecutivos y familias de clase media-alta entre 30-50 años que valoran la calidad gastronómica y buscan experiencias culinarias auténticas. Queremos generar más reservas para fines de semana y aumentar nuestro catering empresarial.'
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      setIsLoading(true)
      console.log('📤 Enviando datos al webhook:', formData)
      setTimeout(() => onNext(formData), 1000)
    }
  }

  const handleQuickTest = () => {
    console.log('🚀 Prueba rápida - Enviando datos dummy:', formData)
    setIsLoading(true)
    onNext(formData)
  }

  const isFormValid = () => {
    return (
      formData.userName.trim() &&
      (formData.email || '').trim() &&
      formData.companyName.trim() &&
      formData.businessDescription.trim()
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-3">
                Crear Agente IA para Generar Leads
              </h1>
              <p className="text-blue-100 text-lg">
                Cuéntanos sobre tu negocio para crear tu agente personalizado
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    placeholder="Nombre completo"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Información de la Empresa */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre de tu empresa *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Mi Empresa SAS"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                  required
                />
              </div>

              {/* Enlaces Sociales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enlaces de tu negocio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://tuempresa.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                      placeholder="@tuempresa"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      placeholder="company/tuempresa"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Descripción del Negocio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Describe tu negocio, tu necesidad y tu cliente ideal *
                </label>
                <textarea
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                  placeholder="Explica qué hace tu empresa, qué tipo de leads necesitas generar, y cómo es tu cliente perfecto. Por ejemplo: 'Somos una clínica dental en Bogotá, necesitamos atraer pacientes para tratamientos estéticos como blanqueamiento e implantes. Nuestro cliente ideal son personas de 25-45 años, clase media-alta, que valoran su imagen personal y buscan tratamientos de calidad...'"
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-500 bg-white transition-colors"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Entre más detalles nos proporciones, más preciso será tu agente IA
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 space-y-3">
                {/* Botón de Prueba Rápida */}
                <button
                  type="button"
                  onClick={handleQuickTest}
                  disabled={isLoading}
                  className="w-full py-3 px-6 font-semibold text-sm rounded-lg transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg"
                >
                  🚀 PRUEBA RÁPIDA - Usar datos dummy
                </button>
                
                {/* Separador */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">o completa el formulario</span>
                  </div>
                </div>

                {/* Botón Principal */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full py-4 px-8 font-bold text-lg rounded-lg transition-all duration-300 ${
                    isFormValid() && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creando tu agente IA...
                    </div>
                  ) : (
                    'Generar mi Agente IA'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            Tu agente estará listo en menos de 2 minutos
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}