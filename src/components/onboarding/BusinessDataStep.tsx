'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { BusinessData } from '@/types/onboarding'

interface BusinessDataStepProps {
  userName: string
  onNext: (data: BusinessData) => void
  onBack: () => void
}

const industries = [
  'Tecnología', 'E-commerce', 'Salud', 'Educación', 'Finanzas', 'Marketing', 
  'Consultoría', 'Real Estate', 'Restaurantes', 'Fitness', 'Belleza', 'Otro'
]

const companySizes = [
  { value: 'startup', label: 'Startup (1-10 empleados)' },
  { value: 'small', label: 'Pequeña (11-50 empleados)' },
  { value: 'medium', label: 'Mediana (51-200 empleados)' },
  { value: 'large', label: 'Grande (201-1000 empleados)' },
  { value: 'enterprise', label: 'Empresa (1000+ empleados)' }
]

const objectives = [
  { value: 'lead-generation', label: 'Generación de Leads', icon: '🎯' },
  { value: 'sales', label: 'Aumentar Ventas', icon: '💰' },
  { value: 'customer-retention', label: 'Retención de Clientes', icon: '🤝' },
  { value: 'brand-awareness', label: 'Reconocimiento de Marca', icon: '📢' },
  { value: 'growth', label: 'Crecimiento General', icon: '📈' },
  { value: 'other', label: 'Otro', icon: '💡' }
]

export default function BusinessDataStep({ userName, onNext, onBack }: BusinessDataStepProps) {
  const [formData, setFormData] = useState<BusinessData>({
    userName,
    email: '',
    companyName: '',
    industry: '',
    businessDescription: '',
    mainChallenges: [],
    currentGoals: [],
    targetAudience: '',
    companySize: 'small',
    primaryObjective: 'lead-generation'
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    'Información Básica',
    'Sobre tu Negocio', 
    'Objetivos y Desafíos',
    'Tu Audiencia'
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Validación final y envío
      if (isFormValid()) {
        setIsLoading(true)
        setTimeout(() => onNext(formData), 1000)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const isFormValid = () => {
    return formData.companyName && formData.industry && formData.businessDescription && formData.targetAudience
  }

  const addChallenge = (challenge: string) => {
    if (challenge && !formData.mainChallenges.includes(challenge)) {
      setFormData({
        ...formData,
        mainChallenges: [...formData.mainChallenges, challenge]
      })
    }
  }

  const removeChallenge = (challenge: string) => {
    setFormData({
      ...formData,
      mainChallenges: formData.mainChallenges.filter(c => c !== challenge)
    })
  }

  const addGoal = (goal: string) => {
    if (goal && !formData.currentGoals.includes(goal)) {
      setFormData({
        ...formData,
        currentGoals: [...formData.currentGoals, goal]
      })
    }
  }

  const removeGoal = (goal: string) => {
    setFormData({
      ...formData,
      currentGoals: formData.currentGoals.filter(g => g !== goal)
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es el nombre de tu empresa? *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="Ej: Mi Empresa SAS"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿En qué industria operas? *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una industria</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de la empresa
              </label>
              <div className="grid grid-cols-1 gap-2">
                {companySizes.map(size => (
                  <label key={size.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="companySize"
                      value={size.value}
                      checked={formData.companySize === size.value}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value as any})}
                      className="mr-3"
                    />
                    <span className="text-sm">{size.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe brevemente tu negocio *
              </label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                placeholder="Ej: Somos una empresa de marketing digital que ayuda a pequeños negocios a crecer online mediante estrategias de redes sociales y publicidad pagada..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuál es tu objetivo principal?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {objectives.map(obj => (
                  <label key={obj.value} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="primaryObjective"
                      value={obj.value}
                      checked={formData.primaryObjective === obj.value}
                      onChange={(e) => setFormData({...formData, primaryObjective: e.target.value as any})}
                      className="mr-3"
                    />
                    <div>
                      <div className="text-xl mb-1">{obj.icon}</div>
                      <span className="text-sm font-medium">{obj.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuáles son tus principales desafíos actuales?
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.mainChallenges.map(challenge => (
                    <span key={challenge} className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {challenge}
                      <button
                        onClick={() => removeChallenge(challenge)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Agregar desafío..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addChallenge((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">Presiona Enter para agregar cada desafío</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Cuáles son tus metas actuales?
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.currentGoals.map(goal => (
                    <span key={goal} className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {goal}
                      <button
                        onClick={() => removeGoal(goal)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Agregar meta..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addGoal((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">Presiona Enter para agregar cada meta</p>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe a tu cliente ideal *
              </label>
              <textarea
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                placeholder="Ej: Pequeños empresarios entre 30-50 años, con negocios físicos que quieren expandirse online, preocupados por la competencia digital, ubicados principalmente en ciudades medianas..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-yellow-500 text-xl mr-3">🎯</div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">¿Por qué es importante?</h4>
                  <p className="text-sm text-yellow-700">
                    Esta información nos ayudará a crear un agente IA que hable exactamente el lenguaje de tus clientes y entienda sus necesidades específicas.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4"
    >
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">
                ¡Hola {userName}! 👋
              </h1>
              <span className="text-blue-100 text-sm">
                Paso {currentStep + 1} de {steps.length}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2">
              {steps.map((step, index) => (
                <span
                  key={step}
                  className={`text-xs ${
                    index <= currentStep ? 'text-white' : 'text-blue-200'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {steps[currentStep]}
            </h2>

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={handleBack}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                ← Atrás
              </button>

              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : currentStep < steps.length - 1 ? (
                  'Siguiente →'
                ) : (
                  'Crear mi Agente IA →'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}