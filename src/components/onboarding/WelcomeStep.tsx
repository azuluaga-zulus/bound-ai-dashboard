'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface WelcomeStepProps {
  onNext: (userName: string) => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  const [userName, setUserName] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (userName.trim()) {
      setIsAnimating(true)
      setTimeout(() => onNext(userName.trim()), 300)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400 to-blue-400 rounded-full opacity-10 translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-3xl font-bold mb-6 shadow-lg">
                🚀
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                ¡Bienvenido a Bound!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Estamos emocionados por crear tu agente inteligente que hará crecer tu negocio.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-1">Agente Personalizado</h3>
                <p className="text-sm text-gray-600">Tu agente IA adaptado a tu negocio específico</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold text-gray-900 mb-1">Entiende tu Industria</h3>
                <p className="text-sm text-gray-600">Habla el lenguaje de tus clientes perfectamente</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Listo en Minutos</h3>
                <p className="text-sm text-gray-600">Tu agente funcionando en menos de 5 minutos</p>
              </div>
            </motion.div>

            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  Para comenzar, ¿cómo te gustaría que te llamemos? ✨
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="text-blue-500 text-xl mr-3 mt-1">💡</div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">¿Qué haremos juntos?</h4>
                    <p className="text-sm text-blue-700">
                      Te haremos algunas preguntas sobre tu negocio para crear tu agente IA personalizado que entienda perfectamente tu industria, tus clientes y cómo ayudarte a vender más.
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleNext}
                disabled={!userName.trim() || isAnimating}
                whileHover={{ scale: userName.trim() ? 1.02 : 1 }}
                whileTap={{ scale: userName.trim() ? 0.98 : 1 }}
                className={`w-full py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  userName.trim()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAnimating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Preparando tu experiencia...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Crear mi agente IA
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-center mt-8 pt-6 border-t border-gray-100"
            >
              <p className="text-sm text-gray-500">
                ⏱️ El proceso completo toma aproximadamente 3-5 minutos
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}