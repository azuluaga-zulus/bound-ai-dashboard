'use client'

import DataTable from '@shared/components/templates/DataTable'
import { TableConfig, ActionButton } from '@shared/types/dashboard-template'
import { useDashboard } from '@shared/contexts/DashboardContext'
import { useState } from 'react'

export default function TablesPage() {
  const { addNotification } = useDashboard()

  // Demo data
  const userData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Admin', salary: 75000, joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', role: 'User', salary: 55000, joinDate: '2023-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'inactive', role: 'User', salary: 48000, joinDate: '2023-03-10' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'active', role: 'Manager', salary: 85000, joinDate: '2023-01-05' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', status: 'active', role: 'User', salary: 52000, joinDate: '2023-04-12' }
  ]

  const productData = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 45, sales: 123 },
    { id: 2, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, stock: 200, sales: 456 },
    { id: 3, name: 'Office Chair', category: 'Furniture', price: 299.99, stock: 15, sales: 78 },
    { id: 4, name: 'Desk Lamp', category: 'Furniture', price: 89.99, stock: 32, sales: 234 },
    { id: 5, name: 'Notebook Set', category: 'Stationery', price: 12.99, stock: 150, sales: 321 }
  ]

  const actions: ActionButton[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: '✏️',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      onClick: (row) => {
        addNotification({
          type: 'info',
          title: 'Edit Action',
          message: `Editing ${row.name}`,
          autoClose: true
        })
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: '🗑️',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      condition: (row) => row.status !== 'active',
      onClick: (row) => {
        addNotification({
          type: 'warning',
          title: 'Delete Action',
          message: `Would delete ${row.name}`,
          autoClose: true
        })
      }
    },
    {
      id: 'view',
      label: 'View',
      icon: '👁️',
      color: 'bg-gray-600 hover:bg-gray-700 text-white',
      onClick: (row) => {
        addNotification({
          type: 'success',
          title: 'View Action',
          message: `Viewing details for ${row.name}`,
          autoClose: true
        })
      }
    }
  ]

  const usersTableConfig: TableConfig = {
    id: 'users-table',
    title: 'Users Management',
    columns: [
      { 
        key: 'id', 
        label: 'ID', 
        type: 'number', 
        sortable: true,
        width: '80px'
      },
      { 
        key: 'name', 
        label: 'Name', 
        type: 'text', 
        sortable: true 
      },
      { 
        key: 'email', 
        label: 'Email', 
        type: 'text' 
      },
      { 
        key: 'role', 
        label: 'Role', 
        type: 'text',
        filterable: true
      },
      { 
        key: 'status', 
        label: 'Status', 
        type: 'badge',
        filterable: true
      },
      { 
        key: 'salary', 
        label: 'Salary', 
        type: 'number',
        formatter: (value) => `$${value.toLocaleString()}`,
        align: 'right',
        sortable: true
      },
      { 
        key: 'joinDate', 
        label: 'Join Date', 
        type: 'date',
        sortable: true
      },
      { 
        key: 'actions', 
        label: 'Actions', 
        type: 'actions' 
      }
    ],
    data: userData,
    search: true,
    pagination: true,
    filters: [
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'Admin', label: 'Admin' },
          { value: 'Manager', label: 'Manager' },
          { value: 'User', label: 'User' }
        ]
      }
    ],
    actions,
    responsive: {
      mobile: 'cards',
      tablet: 'condensed'
    }
  }

  const productsTableConfig: TableConfig = {
    id: 'products-table',
    title: 'Products Inventory',
    columns: [
      { 
        key: 'id', 
        label: 'ID', 
        type: 'number', 
        sortable: true,
        width: '80px'
      },
      { 
        key: 'name', 
        label: 'Product Name', 
        type: 'text', 
        sortable: true 
      },
      { 
        key: 'category', 
        label: 'Category', 
        type: 'badge',
        filterable: true
      },
      { 
        key: 'price', 
        label: 'Price', 
        type: 'number',
        formatter: (value) => `$${value.toFixed(2)}`,
        align: 'right',
        sortable: true
      },
      { 
        key: 'stock', 
        label: 'Stock', 
        type: 'number',
        align: 'center',
        sortable: true
      },
      { 
        key: 'sales', 
        label: 'Sales', 
        type: 'number',
        align: 'center',
        sortable: true
      },
      { 
        key: 'actions', 
        label: 'Actions', 
        type: 'actions' 
      }
    ],
    data: productData,
    search: true,
    pagination: false,
    filters: [
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { value: 'Electronics', label: 'Electronics' },
          { value: 'Furniture', label: 'Furniture' },
          { value: 'Stationery', label: 'Stationery' }
        ]
      }
    ],
    actions: actions.slice(0, 2), // Only edit and delete for products
    responsive: {
      mobile: 'cards',
      tablet: 'full'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Advanced Tables
        </h1>
        <p className="text-gray-600 mt-2">
          Explore the powerful DataTable component with advanced features like filtering, sorting, and mobile responsiveness.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-blue-600 text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900">Search</h3>
          <p className="text-sm text-gray-600">Global search across all columns</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-green-600 text-2xl mb-2">🔽</div>
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <p className="text-sm text-gray-600">Column-specific filtering options</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-purple-600 text-2xl mb-2">↕️</div>
          <h3 className="font-semibold text-gray-900">Sorting</h3>
          <p className="text-sm text-gray-600">Sort by any sortable column</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-orange-600 text-2xl mb-2">📱</div>
          <h3 className="font-semibold text-gray-900">Mobile</h3>
          <p className="text-sm text-gray-600">Auto-converts to cards on mobile</p>
        </div>
      </div>

      {/* Users Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Users Table (with Pagination)
        </h2>
        <DataTable config={usersTableConfig} />
      </div>

      {/* Products Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Products Table (without Pagination)
        </h2>
        <DataTable config={productsTableConfig} />
      </div>

      {/* Mobile Responsiveness Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📱 Mobile Responsiveness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Desktop View</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full table with all columns visible</li>
              <li>• Horizontal scrolling for wide tables</li>
              <li>• In-line action buttons</li>
              <li>• Sortable column headers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Mobile View</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Automatic conversion to card layout</li>
              <li>• Essential information highlighted</li>
              <li>• Touch-friendly action buttons</li>
              <li>• Collapsible detailed information</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Resize your browser window or view this page on different devices to see the responsive behavior in action!
          </p>
        </div>
      </div>
    </div>
  )
}