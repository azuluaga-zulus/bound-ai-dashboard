export interface BusinessData {
  userName: string
  email?: string
  companyName: string
  industry?: string
  website?: string
  instagram?: string
  linkedin?: string
  businessDescription: string
  mainChallenges?: string[]
  currentGoals?: string[]
  targetAudience?: string
  companySize?: string
  primaryObjective?: string
}

export interface OnboardingStep {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
}

export interface ICPAnalysis {
  demographics: {
    ageRange: string
    location: string
    income: string
    jobTitle: string
  }
  psychographics: {
    interests: string[]
    values: string[]
    painPoints: string[]
    goals: string[]
  }
  behaviorPatterns: {
    buyingBehavior: string
    communicationPreference: string
    decisionFactors: string[]
  }
  recommendations: {
    messagingTone: string
    contentTypes: string[]
    channels: string[]
    keyMessages: string[]
  }
}

export interface GeneratedAgent {
  name: string
  personality: string
  expertise: string[]
  communicationStyle: string
  avatar: string
  greeting: string
  sampleConversation: {
    userMessage: string
    agentResponse: string
  }[]
}