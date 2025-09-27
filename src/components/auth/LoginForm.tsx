'use client'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Image from 'next/image'
import { EyeIcon, EyeSlashIcon } from '../ui/Icons'

interface LoginFormProps {
  onSwitchToSignup?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store auth token
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding and Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 relative overflow-hidden">
        <div className="flex flex-col justify-center items-center w-full px-12 text-white">
          {/* Branding */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <Image 
                src="/logo.png" 
                alt="Travloger" 
                width={200} 
                height={40} 
                className="mx-auto"
              />
            </div>
            <p className="text-lg opacity-90 flex items-center justify-center">
              You travel, We capture
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </p>
          </div>
          
          {/* Travel Illustration */}
          <div className="w-full max-w-md">
            <svg viewBox="0 0 400 300" className="w-full h-auto">
              {/* Background elements */}
              <circle cx="80" cy="60" r="3" fill="white" opacity="0.6" />
              <circle cx="320" cy="80" r="2" fill="white" opacity="0.4" />
              <circle cx="350" cy="120" r="2.5" fill="white" opacity="0.5" />
              
              {/* Clouds */}
              <path d="M50 50 Q60 40 70 50 Q80 40 90 50 Q80 60 70 50 Q60 60 50 50" fill="white" opacity="0.3" />
              <path d="M300 40 Q310 30 320 40 Q330 30 340 40 Q330 50 320 40 Q310 50 300 40" fill="white" opacity="0.3" />
              
              {/* Location pins */}
              <g fill="white" opacity="0.7">
                <path d="M100 200 L105 190 L110 200 Z" />
                <path d="M280 180 L285 170 L290 180 Z" />
                <path d="M150 220 L155 210 L160 220 Z" />
              </g>
              
              {/* Grass/foliage */}
              <path d="M0 280 L50 270 L100 280 L150 270 L200 280 L250 270 L300 280 L350 270 L400 280 L400 300 L0 300 Z" fill="white" opacity="0.2" />
              
              {/* Main travel scene */}
              <g stroke="white" strokeWidth="2" fill="none">
                {/* Person */}
                <circle cx="200" cy="180" r="8" />
                <path d="M200 188 L200 220" />
                <path d="M200 200 L185 210" />
                <path d="M200 200 L215 210" />
                <path d="M200 220 L185 240" />
                <path d="M200 220 L215 240" />
                
                {/* Document/Map */}
                <rect x="185" y="160" width="15" height="20" rx="2" />
                <path d="M190 165 L195 165" />
                <path d="M190 170 L195 170" />
                <path d="M190 175 L195 175" />
                
                {/* Suitcase 1 */}
                <rect x="150" y="200" width="25" height="15" rx="2" />
                <rect x="152" y="202" width="21" height="11" rx="1" />
                <circle cx="160" cy="210" r="1" />
                <circle cx="165" cy="210" r="1" />
                
                {/* Suitcase 2 */}
                <rect x="225" y="205" width="20" height="12" rx="2" />
                <rect x="227" y="207" width="16" height="8" rx="1" />
                
                {/* Map/Route background */}
                <rect x="120" y="120" width="160" height="100" rx="5" strokeDasharray="5,5" />
                <path d="M140 140 L180 160 L220 150 L260 170 L300 160" strokeDasharray="3,3" />
                <circle cx="220" cy="150" r="3" fill="white" />
                <text x="225" y="155" fontSize="8" fill="white">X</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 bg-black flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-8">Log In</h2>
        
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-600 rounded bg-gray-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                Remember me
              </label>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="font-medium text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
