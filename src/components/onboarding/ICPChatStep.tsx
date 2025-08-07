'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { BusinessData } from '@/types/onboarding'

interface Message {
  id: string
  type: 'ai' | 'user' | 'thinking'
  content: string
  timestamp: Date
}

interface ICPChatStepProps {
  businessData: BusinessData
  onComplete: (icpData: any) => void
}

export default function ICPChatStep({ businessData, onComplete }: ICPChatStepProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [chatPhase, setChatPhase] = useState<'analyzing' | 'conversing' | 'finalizing'>('analyzing')
  const hasInitialized = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate AI analysis and conversation
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      const initChat = async () => {
        // Initial thinking message
        addMessage('thinking', 'Analizando la información de tu negocio...')
        
        await delay(2000)
        
        // Remove thinking and add first AI message
        setMessages(prev => prev.filter(m => m.type !== 'thinking'))
        
        await typeMessage('ai', `¡Hola ${businessData.userName}! He analizado la información de ${businessData.companyName} y tengo algunas ideas sobre tu cliente ideal.`)
        
        await delay(1500)
        
        await typeMessage('ai', `Basándome en tu descripción del negocio, veo que necesitas generar leads de calidad. Permíteme hacer algunas preguntas para crear un perfil más preciso de tu cliente ideal.`)
        
        await delay(1000)
        
        await typeMessage('ai', `Primera pregunta: ¿Cuál es el rango de edad promedio de tus mejores clientes actuales? Por ejemplo: 25-35 años, 35-50 años, etc.`)
        
        setChatPhase('conversing')
      }
      
      initChat()
    }
  }, [businessData.userName, businessData.companyName])


  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const addMessage = (type: 'ai' | 'user' | 'thinking', content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const typeMessage = async (type: 'ai' | 'user', content: string) => {
    setIsTyping(true)
    await delay(800) // Simulate thinking time
    
    addMessage(type, content)
    setIsTyping(false)
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim() || chatPhase === 'analyzing') return

    const userMessage = currentInput.trim()
    setCurrentInput('')
    
    // Add user message
    addMessage('user', userMessage)
    
    // Simulate AI response based on current conversation phase
    await delay(1000)
    await generateAIResponse(userMessage)
  }

  const generateAIResponse = async (userInput: string) => {
    // Simulate different responses based on conversation progress
    const responseIndex = messages.filter(m => m.type === 'user').length

    switch (responseIndex) {
      case 1: // After first user response (age range)
        await typeMessage('ai', `Perfect! Entiendo que tu cliente típico está en ese rango de edad. Ahora, ¿cuál es el nivel socioeconómico de tus clientes ideales? ¿Clase media, media-alta, o hay variación?`)
        break
      
      case 2: // After second user response (socioeconomic level)
        await typeMessage('ai', `Excelente información. Una pregunta más: ¿Dónde suelen estar ubicados geográficamente tus mejores clientes? ¿Es local, nacional, o hay algún patrón específico?`)
        break
      
      case 3: // After third user response (location)
        await typeMessage('ai', `Perfecto! Con esta información estoy creando tu perfil de cliente ideal. Dame un momento para generar el análisis completo...`)
        
        await delay(2000)
        addMessage('thinking', 'Creando tu perfil de cliente ideal (ICP)...')
        
        await delay(3000)
        setMessages(prev => prev.filter(m => m.type !== 'thinking'))
        
        await typeMessage('ai', `¡Listo! He creado tu Perfil de Cliente Ideal completo. Aquí está el resumen:

**Tu Cliente Ideal:**
- Edad: ${getAgeFromResponse(messages[1]?.content)}
- Nivel socioeconómico: ${getSocioFromResponse(messages[3]?.content)}  
- Ubicación: ${getLocationFromResponse(messages[5]?.content)}
- Necesidad principal: Generar leads para ${businessData.companyName}

**Estrategia recomendada:**
- Enfoque en canales digitales relevantes para este perfil
- Mensajes personalizados que resuenen con sus características
- Llamadas a la acción específicas para su contexto

¿Te parece correcto este perfil o quieres ajustar algo?`)
        
        setChatPhase('finalizing')
        break
      
      case 4: // Final confirmation
        await typeMessage('ai', `¡Excelente! Tu agente IA está listo. He configurado todo basándome en tu perfil de cliente ideal. ¿Quieres ver cómo funciona tu agente personalizado?`)
        
        setTimeout(() => {
          onComplete({
            clientProfile: {
              age: getAgeFromResponse(messages[1]?.content),
              socioeconomic: getSocioFromResponse(messages[3]?.content),
              location: getLocationFromResponse(messages[5]?.content)
            },
            businessData
          })
        }, 2000)
        break
      
      default:
        await typeMessage('ai', `Interesante. Déjame procesar esa información adicional para mejorar tu perfil de cliente ideal.`)
    }
  }

  // Helper functions to extract info from user responses
  const getAgeFromResponse = (content: string = '') => content || "25-45 años"
  const getSocioFromResponse = (content: string = '') => content || "Clase media-alta"
  const getLocationFromResponse = (content: string = '') => content || "Nacional"

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
            AI
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Creando tu Perfil de Cliente Ideal
            </h1>
            <p className="text-sm text-gray-600">
              Conversando con tu Agente IA Especialista
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
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
                      : 'bg-white text-gray-900 shadow-sm border'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                  AI
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {chatPhase === 'conversing' && (
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}