'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { BusinessData } from '@/types/onboarding'
import { useN8NChat } from '@/hooks/useN8NChat'

interface N8NChatStepProps {
  businessData: BusinessData
  onComplete: (icpData: any) => void
}

export default function N8NChatStep({ businessData, onComplete }: N8NChatStepProps) {
  const [currentInput, setCurrentInput] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    initializeChat,
    endChat
  } = useN8NChat()

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Inicializar chat con N8N
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      const init = async () => {
        const success = await initializeChat(businessData)
        if (!success) {
          // Fallback al chat simulado si N8N no responde
          console.warn('N8N no disponible, usando modo simulado')
        }
      }
      init()
    }
  }, [isInitialized, initializeChat, businessData])

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return

    const message = currentInput.trim()
    setCurrentInput('')
    
    const success = await sendMessage(message)
    if (!success && error) {
      console.error('Error enviando mensaje:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Detectar cuando el chat está completo (puedes ajustar esta lógica)
  useEffect(() => {
    // Ejemplo: si el último mensaje del AI contiene "¿Quieres ver cómo funciona tu agente?"
    const lastAIMessage = messages
      .filter(m => m.type === 'ai')
      .pop()

    if (lastAIMessage?.content.includes('¿Quieres ver cómo funciona tu agente?')) {
      setTimeout(() => {
        endChat()
        onComplete({
          messages: messages.filter(m => m.type !== 'thinking' && m.type !== 'error'),
          businessData
        })
      }, 2000)
    }
  }, [messages, endChat, onComplete, businessData])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
              AI
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Creando tu Perfil de Cliente Ideal
              </h1>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Conectado con tu Agente IA Especialista' : 'Conectando...'}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : error ? 'Error' : 'Conectando...'}
            </span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Preparando tu agente IA...</p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-2xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                    {message.type === 'user' ? (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold">
                        {businessData.userName.charAt(0).toUpperCase()}
                      </div>
                    ) : message.type === 'thinking' ? (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : message.type === 'error' ? (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        !
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        AI
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-2 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'thinking'
                      ? 'bg-gray-200 text-gray-600 italic'
                      : message.type === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-white text-gray-900 shadow-sm border'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {isConnected && (
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
                rows={1}
                style={{
                  minHeight: '40px',
                  maxHeight: '120px',
                  resize: 'none'
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Enviar'
                )}
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Presiona Enter para enviar, Shift+Enter para nueva línea
            </div>
          </div>
        </div>
      )}

      {/* Reconnect Button */}
      {!isConnected && error && (
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-4xl mx-auto text-center">
            <button
              onClick={() => initializeChat(businessData)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reconectar con N8N
            </button>
          </div>
        </div>
      )}
    </div>
  )
}