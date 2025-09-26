import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface Package {
  id: number
  name: string
  destination: string
  duration: string
  price: number
  original_price: number
  description: string
  highlights: string[]
  includes: string[]
  category: string
  status: 'Active' | 'Inactive' | 'Draft'
  featured: boolean
  image: string
  created_at: string
  bookings: number
  route?: string
  nights?: number
  days?: number
  trip_type?: 'custom' | 'group'
}

interface NewPackage {
  destination: string
  plan: 'Custom Plan' | 'Fixed Plan' | 'Both'
  serviceType?: 'Hotels' | 'Vehicles' | 'Both'
  hotelLocation?: string
  vehicleLocation?: string
  selectedHotel?: string
  selectedVehicle?: string
  fixedDaysId?: string
  fixedLocationId?: string
  fixedPlanId?: string
  fixedAdults?: number
  fixedPricePerPerson?: number
  fixedRoomsVehicle?: string
}

interface NewPackagePayload {
  destination: string
  plan: 'Custom Plan' | 'Fixed Plan' | 'Both'
  serviceType?: 'Hotels' | 'Vehicles' | 'Both'
  hotelLocation?: string
  vehicleLocation?: string
  selectedHotel?: string
  selectedVehicle?: string
  fixedDaysId?: string
  fixedLocationId?: string
  fixedPlanId?: string
  fixedAdults?: number
  fixedPricePerPerson?: number
  fixedRoomsVehicle?: string
  status: 'Active' | 'Inactive' | 'Draft'
}

type FilterType = 'all' | 'active' | 'inactive' | 'draft'

interface HotelLocation {
  id: string
  name: string
  city: string
}

interface VehicleLocation {
  id: string
  name: string
  city: string
  rates: any
}

interface Hotel {
  id: string
  name: string
  map_rate: number
  eb: number
  category: string
  location_id: string
}

const Packages: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Get city from URL query parameter, default to 'all' if not provided
  const citySlug = searchParams.get('city') || 'all'
  
  // Location management state
  const [hotelLocations, setHotelLocations] = useState<HotelLocation[]>([])
  const [vehicleLocations, setVehicleLocations] = useState<VehicleLocation[]>([])
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [newLocationName, setNewLocationName] = useState('')
  const [newLocationType, setNewLocationType] = useState<'hotel' | 'vehicle' | 'fixed'>('hotel')
  
  // Hotels management state
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [showAddHotelModal, setShowAddHotelModal] = useState(false)
  const [newHotel, setNewHotel] = useState({
    name: '',
    mapRate: 0,
    eb: 0,
    category: ''
  })

  // Vehicles management state
  interface Vehicle { id: string; vehicle_type: string; rate: number; ac_extra: number; location_id: string }
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ vehicleType: '', rate: 0, acExtra: 0 })

  // Fixed plan days state
  const [fixedDaysOptions, setFixedDaysOptions] = useState<Array<{ id: string; days: number; label: string }>>([])
  const [fixedLocations, setFixedLocations] = useState<HotelLocation[]>([])
  const [fixedPlans, setFixedPlans] = useState<Array<{ id: string; name: string }>>([])
  const [showAddFixedPlanModal, setShowAddFixedPlanModal] = useState(false)
  const [newFixedPlanName, setNewFixedPlanName] = useState('')
  const [fixedPlanVariants, setFixedPlanVariants] = useState<Array<{ id: string; adults: number; price_per_person: number; rooms_vehicle: string }>>([])
  const [showAddVariantModal, setShowAddVariantModal] = useState(false)
  const [newVariant, setNewVariant] = useState({ adults: 2, pricePerPerson: 0, roomsVehicle: '' })
  const [showAddFixedDaysModal, setShowAddFixedDaysModal] = useState(false)
  const [newFixedDays, setNewFixedDays] = useState({ days: 1, label: '' })

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [newPackage, setNewPackage] = useState<NewPackage>({
    destination: '',
    plan: 'Custom Plan',
    serviceType: 'Hotels',
    hotelLocation: '',
    vehicleLocation: ''
  })


  // Fetch packages from API
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      const url = citySlug && citySlug !== 'all' ? `/api/packages/city/${citySlug}` : '/api/packages'
      const response = await fetch(url)
      const data = await response.json()
      
      if (response.ok) {
        setPackages(data.packages || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch packages')
      }
    } catch (err) {
      setError('Failed to fetch packages')
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }, [citySlug])

  // Fetch hotel and vehicle locations
  const fetchLocations = useCallback(async () => {
    try {
      console.log('Fetching locations...')
      
      // Use real Supabase endpoints
      const [hotelsRes, vehiclesRes] = await Promise.all([
        fetch('/api/locations/hotels'),
        fetch('/api/locations/vehicles')
      ])
      
      console.log('Hotels response status:', hotelsRes.status)
      console.log('Vehicles response status:', vehiclesRes.status)
      
      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json()
        console.log('Hotels data:', hotelsData)
        setHotelLocations(hotelsData.locations || [])
      } else {
        console.error('Failed to fetch hotel locations:', await hotelsRes.text())
        setHotelLocations([])
      }
      
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        console.log('Vehicles data:', vehiclesData)
        setVehicleLocations(vehiclesData.locations || [])
      } else {
        console.error('Failed to fetch vehicle locations:', await vehiclesRes.text())
        setVehicleLocations([])
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error)
    }
  }, [])

  // Add new location
  const addNewLocation = async () => {
    console.log('addNewLocation called:', { newLocationName, citySlug, newLocationType })
    
    if (!newLocationName.trim()) {
      console.log('Validation failed: No location name')
      alert('Please enter a location name')
      return
    }
    
    if (!citySlug || citySlug === 'all') {
      console.log('Validation failed: No city selected', { citySlug })
      alert('Please navigate to Packages from a specific location in WebsiteEdit to add locations')
      return
    }
    
    try {
      // Use real Supabase endpoint
      const endpoint = newLocationType === 'hotel' ? '/api/locations/hotels' : (newLocationType === 'vehicle' ? '/api/locations/vehicles' : '/api/locations/fixed')
      const payload = {
        name: newLocationName.trim(),
        city: citySlug
      }
      
      console.log('Sending request to:', endpoint, 'with payload:', payload)
      
      const res = await fetch(endpoint, {
          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('Response status:', res.status)
      
      if (res.ok) {
        let data: any = null
        try { data = await res.json() } catch (_) { data = null }
        console.log('Success response:', data)
        
        // Refresh the locations list
        await fetchLocations()
        
        if (newLocationType === 'hotel') {
          // Add to custom hotel locations list
          setHotelLocations((prev) => [{ id: data.location.id, name: data.location.name, city: data.location.city }, ...prev])
          setNewPackage(prev => ({ ...prev, hotelLocation: data.location.id }))
        } else if (newLocationType === 'vehicle') {
          setNewPackage(prev => ({ ...prev, vehicleLocation: data.location.id }))
        } else if ((newLocationType as any) === 'fixed') {
          // For Fixed Plan separate locations
          setFixedLocations((prev) => [{ id: data.location.id, name: data.location.name, city: data.location.city } as any, ...prev])
          setNewPackage(prev => ({ ...(prev as any), fixedLocationId: data.location.id }))
        }
        setNewLocationName('')
        setShowAddLocationModal(false)
        alert('Location added successfully!')
      } else {
        let error: any = {}
        try { error = await res.json() } catch (_) { error = { message: await res.text() } }
        console.error('Error response:', error)
        alert(error.error || error.message || `Failed to add location (status ${res.status})`)
      }
    } catch (error: any) {
      console.error('Exception in addNewLocation:', error)
      alert('Failed to add location: ' + error.message)
    }
  }

  // Fetch hotels for selected location
  const fetchHotels = useCallback(async (locationId: string) => {
    if (!locationId) {
      setHotels([])
      return
    }
    
    try {
      console.log('Fetching hotels for location:', locationId)
      // Use real Supabase endpoint
      const res = await fetch(`/api/hotels?locationId=${locationId}`)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Hotels data:', data)
        setHotels(data.hotels || [])
      } else {
        console.error('Failed to fetch hotels:', await res.text())
        setHotels([])
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
      setHotels([])
    }
  }, [])

  // Add new hotel
  const addNewHotel = async () => {
    if (!newHotel.name.trim() || !newPackage.hotelLocation) {
      alert('Please enter hotel name and ensure a hotel location is selected')
      return
    }
    
    try {
      const payload = {
        name: newHotel.name.trim(),
        mapRate: newHotel.mapRate,
        eb: newHotel.eb,
        category: newHotel.category.trim(),
        locationId: newPackage.hotelLocation
      }
      
      console.log('Adding new hotel:', payload)
      
      // Use real Supabase endpoint
      const res = await fetch('/api/hotels', {
          method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        const data = await res.json()
        console.log('Hotel added:', data)
        
        // Refresh hotels list
        await fetchHotels(newPackage.hotelLocation)
        
        // Automatically select the newly added hotel
        setNewPackage(prev => ({ ...prev, selectedHotel: data.hotel.id }))
        
        setNewHotel({ name: '', mapRate: 0, eb: 0, category: '' })
        setShowAddHotelModal(false)
        alert('Hotel added successfully and selected!')
      } else {
        const error = await res.json()
        console.error('Error adding hotel:', error)
        alert(error.error || 'Failed to add hotel')
      }
    } catch (error: any) {
      console.error('Exception in addNewHotel:', error)
      alert('Failed to add hotel: ' + error.message)
    }
  }

  // Add new vehicle
  const addNewVehicle = async () => {
    if (!newVehicle.vehicleType.trim() || !newPackage.vehicleLocation) {
      alert('Please enter vehicle type and ensure a vehicle location is selected')
      return
    }
    try {
      const payload = {
        vehicleType: newVehicle.vehicleType.trim(),
        rate: newVehicle.rate,
        acExtra: newVehicle.acExtra,
        locationId: newPackage.vehicleLocation
      }
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        // Refresh list
        const fres = await fetch(`/api/vehicles?locationId=${newPackage.vehicleLocation}`)
        const fdata = fres.ok ? await fres.json() : { vehicles: [] }
        setVehicles(fdata.vehicles || [])
        // Select new vehicle
        setNewPackage(prev => ({ ...prev, selectedVehicle: data.vehicle.id }))
        setNewVehicle({ vehicleType: '', rate: 0, acExtra: 0 })
        setShowAddVehicleModal(false)
        alert('Vehicle added successfully and selected!')
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to add vehicle')
      }
    } catch (e: any) {
      alert('Failed to add vehicle: ' + e.message)
    }
  }

  // Create new package
  const createPackage = async (packageData: NewPackagePayload, city: string) => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ ...packageData, citySlug: city }),
        })
      
      const data = await response.json()
      
      if (response.ok) {
        await fetchPackages() // Refresh the list
        return { success: true, package: data.package }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      return { success: false, error: 'Failed to create package' }
    }
  }


  // Delete package
  const deletePackage = async (id: number) => {
    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchPackages() // Refresh the list
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error }
      }
    } catch (err) {
      return { success: false, error: 'Failed to delete package' }
    }
  }

  // Load packages on component mount and when city changes
  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // Load locations on component mount
  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  // Fetch hotels when hotel location changes
  useEffect(() => {
    if (newPackage.hotelLocation) {
      fetchHotels(newPackage.hotelLocation)
    } else {
      setHotels([])
    }
  }, [newPackage.hotelLocation, fetchHotels])

  // Load fixed-days when plan changes to Fixed or city changes
  useEffect(() => {
    const fetchFixedDays = async () => {
      try {
        const res = await fetch(`/api/fixed-days?city=${citySlug}`)
        if (res.ok) {
          const data = await res.json()
          setFixedDaysOptions((data.options || []).map((o: any) => ({ id: o.id, days: o.days, label: o.label || '' })))
        } else {
          setFixedDaysOptions([])
        }
      } catch (_) {
        setFixedDaysOptions([])
      }
    }
    if (newPackage.plan === 'Fixed Plan') fetchFixedDays()
  }, [newPackage.plan, citySlug])

  // Load fixed locations when plan is Fixed or city changes
  useEffect(() => {
    const fetchFixedLocations = async () => {
      try {
        const res = await fetch(`/api/locations/fixed?city=${citySlug}`)
        if (res.ok) {
          const data = await res.json()
          setFixedLocations(data.locations || [])
        } else {
          setFixedLocations([])
        }
      } catch (_) {
        setFixedLocations([])
      }
    }
    if (newPackage.plan === 'Fixed Plan') fetchFixedLocations()
  }, [newPackage.plan, citySlug])

  // Extract primitive dependency for stable effect deps
  const fixedLocationId: string = (newPackage as any).fixedLocationId || ''
  const fixedPlanId: string = (newPackage as any).fixedPlanId || ''

  // Load fixed plans when fixed location changes
  useEffect(() => {
    const fetchFixedPlans = async () => {
      try {
        const res = await fetch(`/api/fixed-plans?city=${citySlug}&locationId=${fixedLocationId}`)
        if (res.ok) {
          const data = await res.json()
          setFixedPlans((data.plans || []).map((p: any) => ({ id: p.id, name: p.name })))
        } else {
          setFixedPlans([])
        }
      } catch (_) {
        setFixedPlans([])
      }
    }
    if (fixedLocationId) fetchFixedPlans()
    else setFixedPlans([])
  }, [citySlug, fixedLocationId])

  // Load fixed plan variants when plan changes
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch(`/api/fixed-plan-options?city=${citySlug}&locationId=${fixedLocationId}&planId=${fixedPlanId}`)
        if (res.ok) {
          const data = await res.json()
          setFixedPlanVariants(data.options || [])
        } else {
          setFixedPlanVariants([])
        }
      } catch (_) {
        setFixedPlanVariants([])
      }
    }
    if (fixedPlanId) fetchVariants()
    else setFixedPlanVariants([])
  }, [citySlug, fixedLocationId, fixedPlanId])

  // Fetch vehicles when vehicle location changes
  useEffect(() => {
    const fetchVehicles = async (locationId: string) => {
      try {
        const res = await fetch(`/api/vehicles?locationId=${locationId}`)
        if (res.ok) {
          const data = await res.json()
          setVehicles(data.vehicles || [])
        } else {
          setVehicles([])
        }
      } catch (_) {
        setVehicles([])
      }
    }
    if (newPackage.vehicleLocation) fetchVehicles(newPackage.vehicleLocation)
    else setVehicles([])
  }, [newPackage.vehicleLocation])

  // Publish/Unpublish
  const updatePackageStatus = async (id: number, nextStatus: 'Active' | 'Draft' | 'Inactive') => {
    try {
      const response = await fetch(`/api/packages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      })
      if (response.ok) {
        await fetchPackages()
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error }
      }
    } catch (_) {
      return { success: false, error: 'Failed to update status' }
    }
  }

  const filteredPackages = packages.filter((pkg: Package) => {
    if (filter === 'all') return true
    return pkg.status.toLowerCase() === filter.toLowerCase()
  })

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Active': return 'bg-primary/10 text-primary'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Adventure': return 'bg-green-100 text-green-800'
      case 'Cultural': return 'bg-blue-100 text-blue-800'
      case 'Luxury': return 'bg-purple-100 text-purple-800'
      case 'Beach': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const openPackageDetails = (pkg: Package): void => {
    setSelectedPackage(pkg)
    setShowModal(true)
  }


  const handleCreatePackage = async (): Promise<void> => {
    const packageData = {
      ...newPackage,
      status: 'Active' as const
    }
    
    const result = await createPackage(packageData, citySlug)
    
    if (result.success) {
      setShowCreateModal(false)
      setNewPackage({
        destination: '',
        plan: 'Custom Plan',
        serviceType: 'Hotels',
        hotelLocation: '',
        vehicleLocation: ''
      })
    } else {
      alert(`Failed to create package: ${result.error}`)
    }
  }

  const totalRevenue = packages
    .filter(p => p.status === 'Active')
    .reduce((sum, pkg) => sum + (pkg.price * pkg.bookings), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Packages</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchPackages}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Itineraries Management
            {citySlug !== 'all' && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                · {citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            {citySlug === 'all' 
              ? 'Create and manage travel itineraries for all cities' 
              : `Create and manage travel itineraries for ${citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}`
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/website-edit')}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back to WebsiteEdit
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Itinerary
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Packages</dt>
                  <dd className="text-lg font-medium text-gray-900">{packages.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                  <dd className="text-lg font-medium text-gray-900">{packages.filter((p: Package) => p.status === 'Active').length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">⭐</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Featured</dt>
                  <dd className="text-lg font-medium text-gray-900">{packages.filter((p: Package) => p.featured).length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${totalRevenue.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({packages.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'active' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({packages.filter((p: Package) => p.status === 'Active').length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'inactive' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive ({packages.filter((p: Package) => p.status === 'Inactive').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'draft' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Drafts ({packages.filter((p: Package) => p.status === 'Draft').length})
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center relative">
              <span className="text-gray-500">Package Image</span>
              {pkg.featured && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.status)}`}>
                  {pkg.status}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(pkg.category)}`}>
                  {pkg.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{pkg.destination}</p>
              <p className="text-gray-500 text-xs mb-4">{pkg.duration}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-primary">${pkg.price.toLocaleString()}</span>
                  {pkg.original_price > pkg.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">${pkg.original_price.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{pkg.bookings} bookings</span>
                  <button
                    onClick={async () => {
                      const next = pkg.status === 'Active' ? 'Draft' : 'Active'
                      const res = await updatePackageStatus(pkg.id, next)
                      if (!res.success) alert(`Failed to update status: ${res.error}`)
                    }}
                    className={`px-2 py-1 text-xs rounded ${pkg.status === 'Active' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                    title={pkg.status === 'Active' ? 'Unpublish' : 'Publish'}
                  >
                    {pkg.status === 'Active' ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openPackageDetails(pkg)}
                  className="flex-1 bg-primary text-white px-3 py-2 rounded text-sm hover:opacity-90"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Package Details Modal */}
      {showModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Package Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedPackage.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <p className="text-sm text-gray-900">{selectedPackage.destination}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900">{selectedPackage.duration}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <p className="text-sm text-gray-900">
                    ${selectedPackage.price.toLocaleString()}
                    {selectedPackage.original_price > selectedPackage.price && (
                      <span className="text-gray-500 line-through ml-2">${selectedPackage.original_price.toLocaleString()}</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedPackage.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedPackage.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Highlights</label>
                  <ul className="text-sm text-gray-900 list-disc list-inside">
                    {selectedPackage.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Includes</label>
                  <ul className="text-sm text-gray-900 list-disc list-inside">
                    {selectedPackage.includes.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stats</label>
                  <p className="text-sm text-gray-900">Bookings: {selectedPackage.bookings} • Created: {selectedPackage.created_at}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Package Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Itinerary</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
                      value={newPackage.destination}
                      onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter destination"
                    required
                    />
                  </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    value={newPackage.plan}
                    onChange={(e) => setNewPackage({ 
                      ...newPackage, 
                      plan: e.target.value as 'Custom Plan' | 'Fixed Plan' | 'Both',
                      serviceType: e.target.value === 'Custom Plan' ? 'Hotels' : undefined,
                      hotelLocation: '',
                      vehicleLocation: '',
                      selectedHotel: '',
                      selectedVehicle: ''
                    })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Custom Plan">Custom Plan</option>
                    <option value="Fixed Plan">Fixed Plan</option>
                    <option value="Both">Both</option>
                  </select>
                  </div>

                {/* Service Type - only show if Custom Plan is selected */}
                {newPackage.plan === 'Custom Plan' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select
                      value={newPackage.serviceType}
                      onChange={(e) => setNewPackage({ 
                        ...newPackage, 
                        serviceType: e.target.value as 'Hotels' | 'Vehicles' | 'Both',
                        hotelLocation: '',
                        vehicleLocation: ''
                      })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Hotels">Hotels</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                )}

                {/* Fixed Plan: Number of Days */}
                {newPackage.plan === 'Fixed Plan' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Number of Days (Fixed Plan)</label>
                      <button
                        onClick={() => setShowAddFixedDaysModal(true)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Add New
                      </button>
                  </div>
                    <select
                      value={(newPackage as any).fixedDaysId || ''}
                      onChange={(e) => setNewPackage({ ...(newPackage as any), fixedDaysId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select number of days</option>
                      {fixedDaysOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.days} Days{opt.label ? ` - ${opt.label}` : ''}</option>
                      ))}
                    </select>
                    {/* Fixed Plan: Location */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <button
                          onClick={() => { setNewLocationType('fixed' as any); setShowAddLocationModal(true) }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Add New
                        </button>
                  </div>
                    <select
                        value={(newPackage as any).fixedLocationId || ''}
                        onChange={(e) => setNewPackage({ ...(newPackage as any), fixedLocationId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select Location</option>
                        {fixedLocations.filter((loc: any) => loc.city === citySlug).map((loc: any) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                  </div>

                    {/* Fixed Plan: Plan Selection */}
                    {(newPackage as any).fixedLocationId && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Plan</label>
                          <button
                            onClick={() => setShowAddFixedPlanModal(true)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                          >Add New</button>
                </div>
                        <select
                          value={(newPackage as any).fixedPlanId || ''}
                          onChange={(e) => setNewPackage({ ...(newPackage as any), fixedPlanId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Plan</option>
                          {fixedPlans.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                </div>
                    )}

                    {/* Fixed Plan: Variant (Adults/Price/Rooms) */}
                    {(newPackage as any).fixedPlanId && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Variant</label>
                          <button onClick={() => setShowAddVariantModal(true)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">Add New</button>
                        </div>
                        <select
                          value={(newPackage as any).fixedVariantId || ''}
                          onChange={(e) => setNewPackage({ ...(newPackage as any), fixedVariantId: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select Variant</option>
                          {fixedPlanVariants.map(v => (
                            <option key={v.id} value={v.id}>{v.adults} Adults · ₹{v.price_per_person} · {v.rooms_vehicle || '—'}</option>
                          ))}
                        </select>
                        {fixedPlanVariants.length === 0 && (
                          <div className="mt-2 text-sm text-gray-500">No variants yet. Click Add New to create.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Hotel Location - show if Hotels or Both is selected */}
                {(newPackage.serviceType === 'Hotels' || newPackage.serviceType === 'Both') && newPackage.plan === 'Custom Plan' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Location</label>
                    <div className="flex gap-2">
                      <select
                        value={newPackage.hotelLocation}
                        onChange={(e) => setNewPackage({ ...newPackage, hotelLocation: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Hotel Location</option>
        {hotelLocations.filter((loc: HotelLocation) => loc.city === citySlug).map((loc: HotelLocation) => (
          <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
                      </select>
                      <button
                        onClick={() => {
                          setNewLocationType('hotel')
                          setShowAddLocationModal(true)
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Add New
                      </button>
                  </div>
                  </div>
                )}

                {/* Hotels Field - show if Hotels or Both is selected and hotel location is chosen */}
                {(newPackage.serviceType === 'Hotels' || newPackage.serviceType === 'Both') && newPackage.plan === 'Custom Plan' && newPackage.hotelLocation && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Select Hotel</label>
                      <button
                        onClick={() => setShowAddHotelModal(true)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Add New Hotel
                      </button>
                  </div>
                    
                    {hotels.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm border border-gray-200 rounded-md">
                        No hotels found for this location. Click &quot;Add New Hotel&quot; to add hotels.
                </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Hotel Selection Dropdown */}
                <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Choose Hotel</label>
                          <select
                            value={newPackage.selectedHotel || ''}
                            onChange={(e) => setNewPackage({ ...newPackage, selectedHotel: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select a hotel</option>
                            {hotels.map((hotel) => (
                              <option key={hotel.id} value={hotel.id}>
                                {hotel.name} ({hotel.category}) - MAP: ₹{hotel.map_rate}, EB: ₹{hotel.eb}
                              </option>
                            ))}
                          </select>
                </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Vehicle Location - show if Vehicles or Both is selected */}
                {(newPackage.serviceType === 'Vehicles' || newPackage.serviceType === 'Both') && newPackage.plan === 'Custom Plan' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Location</label>
                    <div className="flex gap-2">
                      <select
                        value={newPackage.vehicleLocation}
                        onChange={(e) => setNewPackage({ ...newPackage, vehicleLocation: e.target.value })}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Vehicle Location</option>
                        {vehicleLocations.filter((loc: VehicleLocation) => loc.city === citySlug).map((loc: VehicleLocation) => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setNewLocationType('vehicle')
                          setShowAddLocationModal(true)
                        }}
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Add New
                      </button>
                </div>
                  </div>
                )}

                {/* Vehicles Field - show when vehicle location selected */}
                {(newPackage.serviceType === 'Vehicles' || newPackage.serviceType === 'Both') && newPackage.plan === 'Custom Plan' && newPackage.vehicleLocation && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Select Vehicle</label>
                      <button
                        onClick={() => setShowAddVehicleModal(true)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                      >
                        Add New Vehicle
                      </button>
                    </div>

                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                      <select
                        value={newPackage.selectedVehicle || ''}
                        onChange={(e) => setNewPackage({ ...newPackage, selectedVehicle: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a vehicle</option>
                        {vehicles.map(v => (
                          <option key={v.id} value={v.id}>
                            {v.vehicle_type} - Rate: ₹{v.rate}, AC Extra: ₹{v.ac_extra}
                          </option>
                        ))}
                      </select>
                </div>
                </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePackage}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
                >
                  Create Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Location Modal */}
      {showAddLocationModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New {newLocationType === 'hotel' ? 'Hotel' : newLocationType === 'vehicle' ? 'Vehicle' : 'Fixed Plan'} Location</h3>
                <button onClick={() => setShowAddLocationModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                    <input
                      type="text"
                    value={newLocationName} 
                    onChange={(e) => setNewLocationName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Enter ${newLocationType} location name`}
                    />
                  </div>
                <div className="text-sm text-gray-600">
                  {citySlug === 'all' ? (
                    <span className="text-red-600">⚠️ Please navigate to Packages from a specific location in WebsiteEdit</span>
                  ) : (
                    <span>This will be added to <strong>{citySlug}</strong> locations.</span>
                  )}
                  </div>
                </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddLocationModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button 
                  onClick={addNewLocation} 
                  disabled={citySlug === 'all'}
                  className={`px-4 py-2 rounded ${
                    citySlug === 'all' 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                >
                  Add Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Add New Hotel Modal */}
      {showAddHotelModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Hotel for {hotelLocations.find(loc => loc.id === newPackage.hotelLocation)?.name || 'Selected Location'}
                </h3>
                <button onClick={() => setShowAddHotelModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                    <input
                      type="text"
                    value={newHotel.name} 
                    onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter hotel name"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MAP Rate</label>
                    <input
                      type="number"
                    value={newHotel.mapRate} 
                    onChange={(e) => setNewHotel({ ...newHotel, mapRate: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter MAP rate"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EB</label>
                    <input
                      type="number"
                    value={newHotel.eb} 
                    onChange={(e) => setNewHotel({ ...newHotel, eb: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter EB rate"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    type="text" 
                    value={newHotel.category} 
                    onChange={(e) => setNewHotel({ ...newHotel, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 3 star Premier, 4 star, 3 star Dlx"
                  />
                  </div>
                </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddHotelModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={addNewHotel} className="px-4 py-2 bg-primary text-white rounded">Add Hotel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vehicle Modal */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Vehicle
                </h3>
                <button onClick={() => setShowAddVehicleModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={newVehicle.vehicleType}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Sedan, SUV, Tempo Traveller"
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                    <input
                      type="number"
                    value={newVehicle.rate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, rate: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter base rate"
                    />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra for AC (₹)</label>
                    <input
                      type="number"
                    value={newVehicle.acExtra}
                    onChange={(e) => setNewVehicle({ ...newVehicle, acExtra: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter AC extra"
                    />
                  </div>
                </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddVehicleModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={addNewVehicle} className="px-4 py-2 bg-primary text-white rounded">Add Vehicle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Fixed Days Modal */}
      {showAddFixedDaysModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Fixed Plan Days</h3>
                <button onClick={() => setShowAddFixedDaysModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <input
                    type="number"
                    min={1}
                    value={newFixedDays.days}
                    onChange={(e) => setNewFixedDays({ ...newFixedDays, days: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label (optional)</label>
                  <input
                    type="text"
                    value={newFixedDays.label}
                    onChange={(e) => setNewFixedDays({ ...newFixedDays, label: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Family Special"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddFixedDaysModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button
                  onClick={async () => {
                    if (citySlug === 'all') { alert('Select a specific city first'); return }
                    const res = await fetch('/api/fixed-days', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ city: citySlug, days: newFixedDays.days, label: newFixedDays.label })
                    })
                    if (res.ok) {
                      const data = await res.json()
                      setFixedDaysOptions(prev => [...prev, { id: data.option.id, days: data.option.days, label: data.option.label || '' }].sort((a,b)=>a.days-b.days))
                      setShowAddFixedDaysModal(false)
                      ;(setNewPackage as any)((prev: any) => ({ ...prev, fixedDaysId: data.option.id }))
                      setNewFixedDays({ days: 1, label: '' })
                    } else {
                      const err = await res.json()
                      alert(err.error || 'Failed to add days')
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded"
                >Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Fixed Plan Modal */}
      {showAddFixedPlanModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Plan</h3>
                <button onClick={() => setShowAddFixedPlanModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={newFixedPlanName}
                    onChange={(e) => setNewFixedPlanName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Standard, Deluxe, Premium"
                  />
                </div>
                </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddFixedPlanModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button
                  onClick={async () => {
                    if (!newFixedPlanName.trim() || !(newPackage as any).fixedLocationId) {
                      alert('Enter plan name and select a fixed location first')
                      return
                    }
                    const res = await fetch('/api/fixed-plans', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ city: citySlug, locationId: (newPackage as any).fixedLocationId, name: newFixedPlanName.trim() })
                    })
                    if (res.ok) {
                      const data = await res.json()
                      setFixedPlans(prev => [{ id: data.plan.id, name: data.plan.name }, ...prev])
                      setNewPackage(prev => ({ ...(prev as any), fixedPlanId: data.plan.id }))
                      setNewFixedPlanName('')
                      setShowAddFixedPlanModal(false)
                    } else {
                      const err = await res.json().catch(async () => ({ message: await res.text() }))
                      alert(err.error || err.message || 'Failed to add plan')
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded"
                >Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Variant Modal */}
      {showAddVariantModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Variant</h3>
                <button onClick={() => setShowAddVariantModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Adults</label>
                  <input type="number" min={1} value={newVariant.adults} onChange={(e) => setNewVariant({ ...newVariant, adults: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person (₹)</label>
                  <input type="number" min={0} value={newVariant.pricePerPerson} onChange={(e) => setNewVariant({ ...newVariant, pricePerPerson: Number(e.target.value) })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rooms & Vehicle</label>
                  <input type="text" value={newVariant.roomsVehicle} onChange={(e) => setNewVariant({ ...newVariant, roomsVehicle: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 1 Room + Sedan" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setShowAddVariantModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button
                  onClick={async () => {
                    if (!(newPackage as any).fixedPlanId || !(newPackage as any).fixedLocationId) {
                      alert('Select a fixed location and plan first')
                      return
                    }
                    const res = await fetch('/api/fixed-plan-options', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        city: citySlug,
                        locationId: (newPackage as any).fixedLocationId,
                        planId: (newPackage as any).fixedPlanId,
                        adults: newVariant.adults,
                        pricePerPerson: newVariant.pricePerPerson,
                        roomsVehicle: newVariant.roomsVehicle
                      })
                    })
                    if (res.ok) {
                      const data = await res.json()
                      setFixedPlanVariants(prev => [data.option, ...prev])
                      setNewPackage(prev => ({ ...(prev as any), fixedVariantId: data.option.id }))
                      setNewVariant({ adults: 2, pricePerPerson: 0, roomsVehicle: '' })
                      setShowAddVariantModal(false)
                    } else {
                      const err = await res.json().catch(async () => ({ message: await res.text() }))
                      alert(err.error || err.message || 'Failed to add variant')
                    }
                  }}
                  className="px-4 py-2 bg-primary text-white rounded"
                >Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Packages
