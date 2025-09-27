import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Employeedashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [employeeDestination, setEmployeeDestination] = useState<string>('')
  const [packages, setPackages] = useState<Array<{
    id: number
    name: string
    destination: string
    duration: string
    price: number
    original_price: number
    category: string
    status: 'Active' | 'Inactive' | 'Draft'
    featured: boolean
    image?: string
  }>>([])
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [selected, setSelected] = useState<{
    id: number
    name: string
    destination: string
    duration: string
    price: number
    original_price: number
    category: string
    status: 'Active' | 'Inactive' | 'Draft'
    featured: boolean
    image?: string
  } | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)
  
  // Fetch employee destination and packages
  useEffect(() => {
    const fetchEmployeeData = async (): Promise<void> => {
      try {
        setLoading(true)
        
        // Fetch employee destination
        if (user?.email) {
          const employeeRes = await fetch(`/api/employees/by-email/${user.email}`)
          if (employeeRes.ok) {
            const employeeData = await employeeRes.json()
            const destination = employeeData.destination || ''
            setEmployeeDestination(destination)
            
            // Fetch packages based on destination
            const url = destination && destination !== 'all' ? `/api/packages/city/${destination}` : '/api/packages'
            const res = await fetch(url)
            const data = await res.json()
            if (res.ok) {
              setPackages(data.packages || [])
              setError(null)
            } else {
              setError(data.error || 'Failed to load packages')
            }
          }
        }
      } catch (_) {
        setError('Failed to load packages')
      } finally {
        setLoading(false)
      }
    }
    fetchEmployeeData()
  }, [user?.email])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-56 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="h-14 border-b border-gray-100 flex items-center px-4">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'E'}
          </div>
          <div className="ml-3">
            <div className="text-xs text-gray-500">Employee</div>
            <div className="text-sm font-semibold text-gray-900">{user?.name || 'Dashboard'}</div>
          </div>
        </div>
        {/* Navigation removed (no static items) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'E'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Employee'}</p>
                <p className="text-[11px] text-gray-500">{employeeDestination || 'No destination'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-56">
        {/* Header */}
        <header className="bg-white border-b border-gray-100">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                className="md:hidden text-gray-500" 
                onClick={() => setSidebarOpen(s => !s)}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base font-semibold text-gray-900">Employee Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Destination: <span className="font-medium">{employeeDestination || 'All'}</span>
              </div>
              <div className="relative">
                <input 
                  className="pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Search packages..." 
                />
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="h-7 w-7 bg-primary rounded-full flex items-center justify-center text-white text-xs hover:opacity-80 transition-opacity"
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'E'}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4">
          <div className="mx-auto w-[92%] lg:w-4/5 space-y-4">
            {/* Removed static KPI cards */}

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  {employeeDestination ? `Packages for ${employeeDestination}` : 'Available Packages'}
                </h2>
                {loading && <span className="text-xs text-gray-500">Loading...</span>}
              </div>
              {error ? (
                <div className="p-4 text-sm text-red-600">{error}</div>
              ) : (
                <div className="p-4">
                  {packages.length === 0 ? (
                    <div className="text-sm text-gray-500">No packages found.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {packages.map((pkg) => (
                        <div key={pkg.id} className="border rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                          <div className="h-36 bg-gray-100 flex items-center justify-center">
                            {pkg.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-gray-400 text-sm">Package Image</span>
                            )}
                          </div>
                          <div className="p-3 space-y-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{pkg.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                pkg.status === 'Active' ? 'bg-primary/10 text-primary' : pkg.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {pkg.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">{pkg.destination} • {pkg.duration}</div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-bold text-primary">${pkg.price.toLocaleString()}</div>
                              <span className="text-[11px] text-gray-500">{pkg.category}</span>
                            </div>
                            <button
                              onClick={() => { setSelected(pkg); setShowDetails(true) }}
                              className="mt-2 w-full text-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 rounded"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {showDetails && selected && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-md bg-white">
                  <div className="mt-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{selected.name}</h3>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="h-40 bg-gray-100 mb-3 flex items-center justify-center">
                      {selected.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div><span className="font-medium">Destination:</span> {selected.destination}</div>
                      <div><span className="font-medium">Duration:</span> {selected.duration}</div>
                      <div><span className="font-medium">Category:</span> {selected.category}</div>
                      <div><span className="font-medium">Price:</span> ${selected.price.toLocaleString()}</div>
                      {selected.original_price > selected.price && (
                        <div className="text-gray-500 text-xs">Original: ${selected.original_price.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setShowDetails(false)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Removed static "Assigned To You" list */}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to logout? You will need to sign in again to access your dashboard.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employeedashboard
