import React, { useEffect, useState } from 'react'

const Employeedashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [citySlug, setCitySlug] = useState<string>('all')
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
  
  // All static demo data removed. Only live packages are shown below.

  useEffect(() => {
    const fetchPackages = async (): Promise<void> => {
      try {
        setLoading(true)
        const url = citySlug && citySlug !== 'all' ? `/api/packages/${citySlug}` : '/api/packages'
        const res = await fetch(url)
        const data = await res.json()
        if (res.ok) {
          setPackages(data.packages || [])
          setError(null)
        } else {
          setError(data.error || 'Failed to load packages')
        }
      } catch (_) {
        setError('Failed to load packages')
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [citySlug])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-56 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="h-14 border-b border-gray-100 flex items-center px-4">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">E</div>
          <div className="ml-3">
            <div className="text-xs text-gray-500">Employee</div>
            <div className="text-sm font-semibold text-gray-900">Dashboard</div>
          </div>
        </div>
        {/* Navigation removed (no static items) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center text-white text-xs">E</div>
            <div>
              <p className="text-sm font-medium text-gray-900">Employee</p>
              <p className="text-[11px] text-gray-500">Logged in</p>
            </div>
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
              <select
                value={citySlug}
                onChange={(e) => setCitySlug(e.target.value)}
                className="border border-gray-300 rounded-lg text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Cities</option>
                <option value="kashmir">Kashmir</option>
                <option value="kerala">Kerala</option>
                <option value="ladakh">Ladakh</option>
              </select>
              <div className="relative">
                <input 
                  className="pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Search" 
                />
              </div>
              <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center text-white text-xs">E</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4">
          <div className="mx-auto w-[92%] lg:w-4/5 space-y-4">
            {/* Removed static KPI cards */}

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Available Packages</h2>
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
    </div>
  )
}

export default Employeedashboard
