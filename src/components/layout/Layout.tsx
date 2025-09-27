'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import logo from '../../assets/images/logo.png'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '../ui/Icons'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavigationSection {
  title?: string
  items: NavigationItem[]
}

interface LayoutProps {
  children: React.ReactNode
}

const navigationSections: NavigationSection[] = [
  {
    items: [
      { name: 'Dashboard', href: '/', icon: HomeIcon },
      { name: 'Employees', href: '/employees', icon: UserGroupIcon }
    ]
  },
  {
    title: 'CRM',
    items: [
      { name: 'Leads', href: '/leads', icon: UserGroupIcon },
      { name: 'Bookings', href: '/bookings', icon: ClipboardDocumentListIcon },
      { name: 'Payments', href: '/payments', icon: CurrencyDollarIcon },
      { name: 'Reports', href: '/reports', icon: ChartBarIcon }
    ]
  },
  {
    title: 'CMS',
    items: [
      { name: 'Website Edit', href: '/website-edit', icon: DocumentTextIcon },
      { name: 'Packages', href: '/packages', icon: ClipboardDocumentListIcon },
      { name: 'Settings', href: '/settings', icon: CogIcon }
    ]
  }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const location = useLocation()

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Pass search query to children components
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('searchQuery', { detail: query }))
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarCollapsed ? 'w-16' : 'w-56'}`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-12 px-3 border-b border-gray-100">
          {!sidebarCollapsed && (
            <Link to="/" className="relative inline-flex items-center px-2 py-1 rounded-md">
              <div className="absolute inset-0 rounded-md bg-primary" />
              <Image src={logo} alt="Travloger.in" width={120} height={24} priority className="relative z-10" />
            </Link>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <button
              className="hidden lg:block p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon className="h-4 w-4" />
              ) : (
                <ChevronLeftIcon className="h-4 w-4" />
              )}
            </button>
            <button
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-2 overflow-y-auto">
          <div className="space-y-3">
            {navigationSections.map((section, idx) => (
              <div key={idx}>
                {section.title && !sidebarCollapsed && (
                  <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    {section.title}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <item.icon className={`h-4 w-4 ${
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                        } ${sidebarCollapsed ? '' : 'mr-3'}`} />
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="flex-shrink-0 p-2 border-t border-gray-100">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2'}`}>
            <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">A</span>
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">Admin</p>
                <p className="text-[10px] text-gray-500 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between h-12 px-4">
            <button
              className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            
            <div className="flex items-center justify-between w-full">
              {/* Left side - empty for now */}
              <div className="flex-1"></div>
              
              {/* Center - Search Bar */}
              <div className="relative flex-1 max-w-md mx-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search sections, content, and more..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm"
                />
              </div>
              
              {/* Right side */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <button className="relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 7.757A9.962 9.962 0 0012 5c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.44.306-2.813.857-4.05" />
                  </svg>
                  <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Avatar */}
                <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="w-full max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
