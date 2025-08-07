'use client'

import StatsGrid from '@shared/components/templates/StatsGrid'
import { StatCard } from '@shared/types/dashboard-template'
import { useDashboard } from '@shared/contexts/DashboardContext'
import { useState } from 'react'

export default function ComponentsPage() {
  const { addNotification } = useDashboard()
  const [notificationCount, setNotificationCount] = useState(0)

  // Different stat configurations for demo
  const basicStats: StatCard[] = [
    {
      id: 'metric-1',
      title: 'Active Users',
      value: 2847,
      subtitle: 'Currently online',
      icon: '👤',
      color: '#10B981'
    },
    {
      id: 'metric-2',
      title: 'Sales Today',
      value: '$12,458',
      subtitle: 'Revenue generated',
      icon: '💰',
      color: '#3B82F6'
    }
  ]

  const trendStats: StatCard[] = [
    {
      id: 'trend-1',
      title: 'Conversion Rate',
      value: '3.2%',
      subtitle: 'Website conversions',
      icon: '📈',
      color: '#F59E0B',
      trend: {
        value: 15.3,
        direction: 'up',
        label: 'vs last week'
      }
    },
    {
      id: 'trend-2',
      title: 'Bounce Rate',
      value: '42.1%',
      subtitle: 'Page bounce rate',
      icon: '📉',
      color: '#EF4444',
      trend: {
        value: -8.2,
        direction: 'down',
        label: 'vs last week'
      }
    },
    {
      id: 'trend-3',
      title: 'Page Views',
      value: '89.2K',
      subtitle: 'Total page views',
      icon: '👁️',
      color: '#8B5CF6',
      trend: {
        value: 23.1,
        direction: 'up',
        label: 'vs last week'
      }
    }
  ]

  const allStats: StatCard[] = [
    {
      id: 'all-1',
      title: 'Total Revenue',
      value: '$432,891',
      subtitle: 'All time earnings',
      icon: '💎',
      color: '#10B981',
      trend: {
        value: 12.5,
        direction: 'up',
        label: 'vs last month'
      }
    },
    {
      id: 'all-2',
      title: 'Active Projects',
      value: 24,
      subtitle: 'Currently active',
      icon: '📋',
      color: '#3B82F6'
    },
    {
      id: 'all-3',
      title: 'Team Members',
      value: 156,
      subtitle: 'Across all departments',
      icon: '👥',
      color: '#F59E0B'
    },
    {
      id: 'all-4',
      title: 'Satisfaction',
      value: '98.5%',
      subtitle: 'Customer rating',
      icon: '⭐',
      color: '#8B5CF6',
      trend: {
        value: 2.3,
        direction: 'up',
        label: 'vs last quarter'
      }
    }
  ]

  const notificationTypes = [
    { type: 'success' as const, title: 'Success!', message: 'Operation completed successfully', color: 'green' },
    { type: 'error' as const, title: 'Error!', message: 'Something went wrong', color: 'red' },
    { type: 'warning' as const, title: 'Warning!', message: 'Please check your settings', color: 'yellow' },
    { type: 'info' as const, title: 'Info', message: 'Here is some useful information', color: 'blue' }
  ]

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const notification = notificationTypes.find(n => n.type === type)
    if (notification) {
      addNotification({
        type: notification.type,
        title: notification.title,
        message: `${notification.message} (${notificationCount + 1})`,
        autoClose: true
      })
      setNotificationCount(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Component Showcase
        </h1>
        <p className="text-gray-600 mt-2">
          Explore the different components available in the dashboard template.
        </p>
      </div>

      {/* Stats Grid Examples */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Statistics Grids
          </h2>
          
          {/* 2 Column Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">2 Column Layout</h3>
            <StatsGrid stats={basicStats} columns={2} />
          </div>

          {/* 3 Column Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">3 Column Layout with Trends</h3>
            <StatsGrid stats={trendStats} columns={3} />
          </div>

          {/* 4 Column Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">4 Column Layout</h3>
            <StatsGrid stats={allStats} columns={4} />
          </div>
        </div>
      </div>

      {/* Notifications Demo */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔔 Notification System
        </h2>
        <p className="text-gray-600 mb-4">
          Test different notification types. Each notification will auto-dismiss after 5 seconds.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => showNotification('success')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Success
          </button>
          <button
            onClick={() => showNotification('error')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Error
          </button>
          <button
            onClick={() => showNotification('warning')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Warning
          </button>
          <button
            onClick={() => showNotification('info')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Info
          </button>
        </div>
        
        {notificationCount > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Notifications sent: <span className="font-medium">{notificationCount}</span>
            </p>
          </div>
        )}
      </div>

      {/* Component Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎨 Styling Features
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              Custom color themes for each stat card
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              Trend indicators with up/down arrows
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              Responsive grid layouts (1-4 columns)
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              Hover effects and smooth transitions
            </li>
            <li className="flex items-center">
              <span className="text-blue-500 mr-2">•</span>
              Consistent spacing and typography
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📱 Responsive Design
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Mobile-first responsive breakpoints
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Automatic column adjustments on smaller screens
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Touch-friendly interface elements
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Optimized typography for all devices
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">•</span>
              Consistent spacing across screen sizes
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}