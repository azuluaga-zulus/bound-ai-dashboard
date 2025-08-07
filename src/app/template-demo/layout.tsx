'use client'

import { DashboardProvider } from '@shared/contexts/DashboardContext'
import DashboardTemplate from '@shared/components/templates/DashboardTemplate'
import { getDashboardConfig } from '@/lib/dashboard-config'

export default function TemplateDemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardProvider dashboardId="template-demo" getDashboardConfig={getDashboardConfig}>
      <DashboardTemplate>
        {children}
      </DashboardTemplate>
    </DashboardProvider>
  )
}