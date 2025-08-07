'use client'

import StatsGrid from '@shared/components/templates/StatsGrid'
import { StatCard } from '@shared/types/dashboard-template'
import { useDashboard } from '@shared/contexts/DashboardContext'

export default function TemplateDemoPage() {
  const { addNotification } = useDashboard()

  // Demo statistics data
  const stats: StatCard[] = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: 12456,
      subtitle: 'Registered users',
      icon: '👥',
      color: '#10B981',
      trend: {
        value: 12.5,
        direction: 'up',
        label: 'vs last month'
      }
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: '$89,432',
      subtitle: 'Monthly revenue',
      icon: '💰',
      color: '#3B82F6'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '24.8%',
      subtitle: 'Sales conversion',
      icon: '📈',
      color: '#F59E0B',
      trend: {
        value: -2.3,
        direction: 'down',
        label: 'vs last month'
      }
    },
    {
      id: 'growth',
      title: 'Growth',
      value: '23.5%',
      subtitle: 'Monthly growth',
      icon: '🚀',
      color: '#8B5CF6',
      trend: {
        value: 5.2,
        direction: 'up',
        label: 'vs last month'
      }
    }
  ]

  const handleTestNotification = () => {
    addNotification({
      type: 'success',
      title: 'Template Working!',
      message: 'The notification system is working correctly.',
      autoClose: true
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Template Demo
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Bound Dashboard Template. This is a comprehensive, reusable template for building enterprise dashboards.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} columns={4} />

      {/* Demo Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Template Features
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Responsive design with mobile-first approach
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Advanced data tables with filtering
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Real-time notification system
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Customizable themes and colors
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Progress tracking components
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Multi-tenant support
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🧪 Test Components
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleTestNotification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Test Notification System
            </button>
            <div className="text-sm text-gray-600">
              Click the button above to test the notification system.
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Navigation Menu</h3>
              <p className="text-sm text-gray-600">
                Use the sidebar to explore different sections:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Components - UI component showcase</li>
                <li>• Tables - Advanced table examples</li>
                <li>• Analytics - Sample analytics page</li>
                <li>• Settings - Configuration options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 Quick Start Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">1</span>
            </div>
            <h3 className="font-semibold text-gray-900">Configure</h3>
            <p className="text-sm text-gray-600 mt-1">
              Set up your dashboard config with branding, navigation, and features
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">2</span>
            </div>
            <h3 className="font-semibold text-gray-900">Customize</h3>
            <p className="text-sm text-gray-600 mt-1">
              Add your own components, pages, and styling to match your needs
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 text-xl">3</span>
            </div>
            <h3 className="font-semibold text-gray-900">Deploy</h3>
            <p className="text-sm text-gray-600 mt-1">
              Build and deploy your custom dashboard to production
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}