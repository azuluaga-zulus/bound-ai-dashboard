interface N8NConfig {
  baseUrl: string
  webhookEndpoint: string
  chatEndpoint: string
}

interface ChatSession {
  sessionId: string
  status: 'active' | 'completed'
  lastMessageId?: string
}

interface N8NMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: string
  sessionId: string
}

interface N8NResponse {
  success: boolean
  sessionId?: string
  messages?: N8NMessage[]
  error?: string
}

class N8NService {
  private config: N8NConfig

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://localhost:5678',
      webhookEndpoint: '/webhook-test/onboarding-chat',
      chatEndpoint: '/webhook-test/chat-message'
    }
  }

  /**
   * Envía los datos del formulario inicial a N8N para inicializar el chat
   */
  async initializeChat(businessData: any): Promise<ChatSession | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.webhookEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initialize',
          businessData,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: N8NResponse = await response.json()
      
      if (data.success && data.sessionId) {
        return {
          sessionId: data.sessionId,
          status: 'active'
        }
      }
      
      throw new Error(data.error || 'Failed to initialize chat')
    } catch (error) {
      console.error('Error initializing chat with N8N:', error)
      return null
    }
  }

  /**
   * Envía un mensaje del usuario a N8N
   */
  async sendMessage(sessionId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.chatEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'user_message',
          sessionId,
          message,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: N8NResponse = await response.json()
      return data.success || false
    } catch (error) {
      console.error('Error sending message to N8N:', error)
      return false
    }
  }

  /**
   * Obtiene mensajes nuevos desde N8N (polling)
   */
  async getMessages(sessionId: string, lastMessageId?: string): Promise<N8NMessage[]> {
    try {
      const params = new URLSearchParams({
        action: 'get_messages',
        sessionId,
        ...(lastMessageId && { lastMessageId })
      })

      const response = await fetch(`${this.config.baseUrl}${this.config.chatEndpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: N8NResponse = await response.json()
      return data.messages || []
    } catch (error) {
      console.error('Error getting messages from N8N:', error)
      return []
    }
  }

  /**
   * Finaliza la sesión de chat
   */
  async endChat(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.chatEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'end_chat',
          sessionId,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: N8NResponse = await response.json()
      return data.success || false
    } catch (error) {
      console.error('Error ending chat with N8N:', error)
      return false
    }
  }
}

export const n8nService = new N8NService()
export type { ChatSession, N8NMessage, N8NResponse }