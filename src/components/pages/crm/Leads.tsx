import React, { useState, useEffect } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  destination: string
  number_of_travelers: string
  travel_dates: string
  custom_notes: string
  created_at: string
}


type FilterType = 'all' | 'Kashmir' | 'Ladakh' | 'Kerala' | 'Gokarna' | 'Meghalaya' | 'Mysore' | 'Singapore'

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leads')
        const data = await response.json()
        
        if (response.ok) {
          setLeads(data.leads || [])
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch leads')
        }
      } catch (err) {
        setError('Failed to fetch leads')
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true
    return lead.destination === filter
  })

  const getSourceColor = (source: string): string => {
    switch (source) {
      case 'enquiry': return 'bg-primary/10 text-primary'
      case 'google_ads': return 'bg-blue-100 text-blue-800'
      case 'website': return 'bg-green-100 text-green-800'
      case 'whatsapp': return 'bg-green-100 text-green-800'
      case 'phone': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDestinationColor = (destination: string): string => {
    switch (destination) {
      case 'Kashmir': return 'bg-blue-100 text-blue-800'
      case 'Ladakh': return 'bg-purple-100 text-purple-800'
      case 'Kerala': return 'bg-green-100 text-green-800'
      case 'Gokarna': return 'bg-yellow-100 text-yellow-800'
      case 'Meghalaya': return 'bg-indigo-100 text-indigo-800'
      case 'Mysore': return 'bg-pink-100 text-pink-800'
      case 'Singapore': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const openLeadDetails = (lead: Lead): void => {
    setSelectedLead(lead)
    setShowModal(true)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600">Manage and track customer inquiries</p>
        </div>
       
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">L</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                  <dd className="text-lg font-medium text-gray-900">{leads.length}</dd>
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
                  <span className="text-white text-sm font-medium">E</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Enquiries</dt>
                  <dd className="text-lg font-medium text-gray-900">{leads.filter(l => l.source === 'enquiry').length}</dd>
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
                  <span className="text-white text-sm font-medium">G</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Google Ads</dt>
                  <dd className="text-lg font-medium text-gray-900">{leads.filter(l => l.source === 'google_ads').length}</dd>
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
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {leads.filter(l => {
                      const today = new Date().toDateString()
                      const leadDate = new Date(l.created_at).toDateString()
                      return today === leadDate
                    }).length}
                  </dd>
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
            All ({leads.length})
          </button>
          <button
            onClick={() => setFilter('Kashmir')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Kashmir' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kashmir ({leads.filter(l => l.destination === 'Kashmir').length})
          </button>
          <button
            onClick={() => setFilter('Ladakh')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Ladakh' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ladakh ({leads.filter(l => l.destination === 'Ladakh').length})
          </button>
          <button
            onClick={() => setFilter('Kerala')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Kerala' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kerala ({leads.filter(l => l.destination === 'Kerala').length})
          </button>
          <button
            onClick={() => setFilter('Gokarna')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Gokarna' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Gokarna ({leads.filter(l => l.destination === 'Gokarna').length})
          </button>
          <button
            onClick={() => setFilter('Meghalaya')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Meghalaya' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Meghalaya ({leads.filter(l => l.destination === 'Meghalaya').length})
          </button>
          <button
            onClick={() => setFilter('Mysore')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Mysore' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mysore ({leads.filter(l => l.destination === 'Mysore').length})
          </button>
          <button
            onClick={() => setFilter('Singapore')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filter === 'Singapore' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Singapore ({leads.filter(l => l.destination === 'Singapore').length})
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading leads...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">No leads found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travelers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{lead.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceColor(lead.source)}`}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.number_of_travelers || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.travel_dates || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDestinationColor(lead.destination)}`}>
                        {lead.destination || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openLeadDetails(lead)}
                        className="text-primary hover:opacity-80"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Details Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Lead Details</h3>
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
                  <p className="text-sm text-gray-900">{selectedLead.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedLead.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedLead.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Source</label>
                  <p className="text-sm text-gray-900">{selectedLead.source}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination</label>
                  <p className="text-sm text-gray-900">{selectedLead.destination || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Number of Travelers</label>
                  <p className="text-sm text-gray-900">{selectedLead.number_of_travelers || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travel Dates</label>
                  <p className="text-sm text-gray-900">{selectedLead.travel_dates || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{selectedLead.custom_notes || 'No notes'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedLead.created_at)}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90">
                  Contact Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Leads
