'use client'

import React, { useState } from 'react'
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
  Bars3Icon,
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
      { name: 'Blogs', href: '/blogs', icon: DocumentTextIcon },
      { name: 'Website Edit', href: '/website-edit', icon: DocumentTextIcon },
      { name: 'Packages', href: '/packages', icon: ClipboardDocumentListIcon }
    ]
  },
  {
    items: [
      { name: 'Settings', href: '/settings', icon: CogIcon }
    ]
  }
]

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Link to="/" className="relative inline-flex items-center px-2 py-1 rounded-md">
              <div className="absolute inset-0 rounded-md bg-primary" />
              <Image src={logo} alt="Travloger.in" width={140} height={28} priority className="relative z-10" />
            </Link>
          </div>
          <button
            className="lg:hidden absolute right-4"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-5">
            {navigationSections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-gray-400">
                    {section.title}
                  </div>
                )}
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center">
                          <item.icon className={`mr-2 h-4 w-4 ${
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                          }`} />
                          {item.name}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Welcome, Admin</p>
              <p className="text-[11px] text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center justify-between h-14 px-5">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-gray-400" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-56 pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.343 7.757A9.962 9.962 0 0012 5c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12c0-1.44.306-2.813.857-4.05" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* User Avatar */}
                <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
