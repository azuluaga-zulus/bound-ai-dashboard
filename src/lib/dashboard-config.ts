import { DashboardConfig } from '@shared/types/dashboard-template'

export const TEMPLATE_DEMO_CONFIG: DashboardConfig = {
  id: 'template-demo',
  name: 'Dashboard Template',
  description: 'Reusable dashboard template with advanced features',
  logo: {
    text: 'Bound',
    subtitle: 'Dashboard Template',
    icon: 'BT',
    colors: {
      primary: '#3B82F6',
      secondary: '#FFFFFF'
    }
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF', 
    accentColor: '#60A5FA',
    gradients: {
      primary: 'from-blue-50 to-indigo-50',
      secondary: 'from-blue-600 to-indigo-600'
    }
  },
  navigation: [
    {
      id: 'home',
      name: 'Overview',
      path: '/template-demo',
      icon: '🏠'
    },
    {
      id: 'components',
      name: 'Components',
      path: '/template-demo/components',
      icon: '🧩'
    },
    {
      id: 'tables',
      name: 'Tables',
      path: '/template-demo/tables',
      icon: '📊'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      path: '/template-demo/analytics',
      icon: '📈'
    },
    {
      id: 'settings',
      name: 'Settings',
      path: '/template-demo/settings',
      icon: '⚙️'
    }
  ],
  progressTracker: {
    title: 'Template Setup Progress',
    items: [
      { id: '1', name: 'Template Installation', completed: true },
      { id: '2', name: 'Configuration Setup', completed: true },
      { id: '3', name: 'Component Integration', completed: true },
      { id: '4', name: 'Theme Customization', completed: true },
      { id: '5', name: 'Demo Pages Created', completed: true }
    ],
    showPercentage: true,
    completionMessage: 'Template ready to use! 🚀'
  },
  features: {
    mobileResponsive: true,
    darkMode: false,
    notifications: true,
    search: true,
    filters: true,
    export: true,
    realtime: false,
    analytics: true,
    customization: true,
    multiTenant: true,
    roles: ['admin', 'user', 'viewer']
  }
}

// Registry of all dashboard configurations
export const DASHBOARD_REGISTRY = new Map<string, DashboardConfig>([
  [TEMPLATE_DEMO_CONFIG.id, TEMPLATE_DEMO_CONFIG]
])

export function getDashboardConfig(id: string): DashboardConfig | null {
  return DASHBOARD_REGISTRY.get(id) || null
}

export function getAllDashboards(): DashboardConfig[] {
  return Array.from(DASHBOARD_REGISTRY.values())
}

export function registerDashboard(config: DashboardConfig): void {
  DASHBOARD_REGISTRY.set(config.id, config)
}