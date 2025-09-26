import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import bcrypt from 'bcryptjs'

// Type definitions
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  location: string
  role: string
  status: 'Active' | 'Inactive'
}

interface NewEmployee {
  name: string
  email: string
  phone: string
  location: string
  password: string
}

type FilterType = 'all' | 'active' | 'inactive'

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [newEmployee, setNewEmployee] = useState<NewEmployee>({ 
    name: '', 
    email: '', 
    phone: '', 
    location: '',
    password: ''
  })

  const getStatusPill = (status: string): string => 
    status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-800'

  const filtered = employees.filter(e => 
    filter === 'all' ? true : e.status.toLowerCase() === filter
  )

  useEffect(() => {
    const fetchEmployees = async (): Promise<void> => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: false })
      
      if (!error && data) {
        setEmployees(data.map(e => ({
          id: e.id,
          name: e.name,
          email: e.email,
          phone: e.phone,
          location: e.location,
          role: e.role || 'Agent',
          status: e.status || 'Active'
        })))
      } else if (error && (error.code === '42P01' || /relation .* employees .* does not exist/i.test(error.message))) {
        // Table missing → call our provisioning endpoint then retry
        try {
          await fetch('/api/provision-employees')
          const retry = await supabase
            .from('employees')
            .select('*')
            .order('id', { ascending: false })
          
          if (!retry.error && retry.data) {
            setEmployees(retry.data.map(e => ({
              id: e.id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              location: e.location,
              role: e.role || 'Agent',
              status: e.status || 'Active'
            })))
          }
        } catch (_) {
          // Silently handle provisioning errors
        }
      } else if (error) {
        alert(`Employees fetch failed: ${error.message || 'Unknown error'}`)
      }
    }
    fetchEmployees()
  }, [])

  const handleCreateEmployee = async (): Promise<void> => {
    if (!newEmployee.phone || newEmployee.phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number')
      return
    }
    if (!newEmployee.password || newEmployee.password.length < 6) {
      alert('Please enter a password with at least 6 characters')
      return
    }
    
    const passwordHash = await bcrypt.hash(newEmployee.password, 10)

    const payload = { 
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      location: newEmployee.location,
      role: 'Agent', 
      status: 'Active',
      password_hash: passwordHash
    }
    const { data, error } = await supabase
      .from('employees')
      .insert(payload)
      .select()
      .single()
    
    if (!error && data) {
      setEmployees(prev => [{
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        role: data.role,
        status: data.status
      }, ...prev])
      setShowCreateModal(false)
      setNewEmployee({ name: '', email: '', phone: '', location: '', password: '' })
    } else {
      alert(`Failed to save employee: ${error?.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage employees, roles, and statuses</p>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          Add Employee
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'all' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')} 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'active' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('inactive')} 
            className={`px-3 py-1 rounded-full text-sm ${
              filter === 'inactive' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filtered.map((emp) => (
            <li key={emp.id}>
              <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                    <div className="text-sm text-gray-500">{emp.email}</div>
                    {emp.location && <div className="text-xs text-gray-400">{emp.location}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">{emp.role}</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(emp.status)}`}>
                    {emp.status}
                  </span>
                  <button className="text-primary text-sm hover:opacity-80">Edit</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Employee</h3>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="\\d{10}"
                    maxLength={10}
                    value={newEmployee.phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                      setNewEmployee({ ...newEmployee, phone: digitsOnly })
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10-digit number"
                    title="Enter a 10-digit phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
                >
                  Save Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Employees
