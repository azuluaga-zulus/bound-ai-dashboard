'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { n8nService, ChatSession, N8NMessage } from '@/services/n8nService'
import { BusinessData } from '@/types/onboarding'

interface ChatMessage {
  id: string
  type: 'ai' | 'user' | 'thinking' | 'error'
  content: string
  timestamp: Date
}

interface UseN8NChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  isConnected: boolean
  error: string | null
  sendMessage: (message: string) => Promise<boolean>
  initializeChat: (businessData: BusinessData) => Promise<boolean>
  endChat: () => Promise<void>
}

export function useN8NChat(): UseN8NChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<ChatSession | null>(null)
  
  const pollingInterval = useRef<NodeJS.Timeout | null>(null)
  const lastMessageId = useRef<string | undefined>(undefined)

  // Función para convertir mensajes de N8N al formato local
  const convertN8NMessage = (n8nMsg: N8NMessage): ChatMessage => ({
    id: n8nMsg.id,
    type: n8nMsg.type,
    content: n8nMsg.content,
    timestamp: new Date(n8nMsg.timestamp)
  })

  // Función para agregar mensajes locales (thinking, error, etc.)
  const addLocalMessage = useCallback((type: 'thinking' | 'error', content: string) => {
    const message: ChatMessage = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, message])
    return message.id
  }, [])

  // Función para remover mensajes por ID
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }, [])

  // Polling para obtener nuevos mensajes de N8N
  const startPolling = useCallback(() => {
    if (!session?.sessionId) return

    pollingInterval.current = setInterval(async () => {
      try {
        const newMessages = await n8nService.getMessages(
          session.sessionId, 
          lastMessageId.current
        )

        if (newMessages.length > 0) {
          const convertedMessages = newMessages.map(convertN8NMessage)
          setMessages(prev => [...prev, ...convertedMessages])
          
          // Actualizar el último ID de mensaje
          lastMessageId.current = newMessages[newMessages.length - 1].id
        }
      } catch (err) {
        console.error('Error polling messages:', err)
        setError('Error al obtener mensajes del servidor')
      }
    }, 2000) // Poll cada 2 segundos
  }, [session?.sessionId])

  // Detener polling
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
      pollingInterval.current = null
    }
  }, [])

  // Inicializar chat con N8N
  const initializeChat = useCallback(async (businessData: BusinessData): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Iniciando chat con N8N...')
      console.log('📋 Datos del negocio:', businessData)
      console.log('🌐 URL N8N:', process.env.NEXT_PUBLIC_N8N_BASE_URL)
      
      // Mostrar mensaje de "thinking"
      const thinkingId = addLocalMessage('thinking', 'Conectando con tu agente IA...')
      
      const chatSession = await n8nService.initializeChat(businessData)
      
      if (chatSession) {
        setSession(chatSession)
        setIsConnected(true)
        
        // Remover mensaje de thinking
        removeMessage(thinkingId)
        
        // Iniciar polling para mensajes
        setTimeout(startPolling, 1000)
        
        return true
      } else {
        removeMessage(thinkingId)
        setError('No se pudo conectar con el agente IA')
        return false
      }
    } catch (err) {
      setError('Error al inicializar el chat')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [addLocalMessage, removeMessage, startPolling])

  // Enviar mensaje a N8N
  const sendMessage = useCallback(async (message: string): Promise<boolean> => {
    if (!session?.sessionId || !isConnected) {
      setError('Chat no conectado')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      // Agregar mensaje del usuario inmediatamente
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'user',
        content: message,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])

      // Mostrar indicador de que el AI está pensando
      const thinkingId = addLocalMessage('thinking', 'El agente está analizando tu respuesta...')

      const success = await n8nService.sendMessage(session.sessionId, message)

      if (success) {
        // Remover thinking - la respuesta llegará por polling
        setTimeout(() => removeMessage(thinkingId), 1000)
        return true
      } else {
        removeMessage(thinkingId)
        addLocalMessage('error', 'Error al enviar mensaje. Intenta de nuevo.')
        return false
      }
    } catch (err) {
      setError('Error al enviar mensaje')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [session, isConnected, addLocalMessage, removeMessage])

  // Finalizar chat
  const endChat = useCallback(async () => {
    if (session?.sessionId) {
      await n8nService.endChat(session.sessionId)
    }
    
    stopPolling()
    setSession(null)
    setIsConnected(false)
    setMessages([])
    setError(null)
  }, [session, stopPolling])

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    messages,
    isLoading,
    isConnected,
    error,
    sendMessage,
    initializeChat,
    endChat
  }
}