import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import bcrypt from 'bcryptjs'

// Type definitions
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  destination: string
  role: string
  status: 'Active' | 'Inactive'
}

interface NewEmployee {
  name: string
  email: string
  phone: string
  destination: string
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
    destination: '',
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
          destination: e.destination,
          role: e.role || 'employee',
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
              destination: e.destination,
              role: e.role || 'employee',
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
    
    // Check if email already exists
    const { data: existingEmployees, error: checkError } = await supabase
      .from('employees')
      .select('email')
      .eq('email', newEmployee.email)
    
    if (checkError) {
      console.error('Error checking email:', checkError)
    }
    
    if (existingEmployees && existingEmployees.length > 0) {
      alert('An employee with this email already exists. Please use a different email address.')
      return
    }
    
    const passwordHash = await bcrypt.hash(newEmployee.password, 10)

    // Create employee record first
    const payload = { 
      name: newEmployee.name,
      email: newEmployee.email,
      phone: newEmployee.phone,
      destination: newEmployee.destination,
      role: 'employee', 
      status: 'Active',
      password_hash: passwordHash
    }
    
    const { data, error } = await supabase
      .from('employees')
      .insert(payload)
      .select()
      .single()
    
    if (error) {
      let errorMessage = 'Unknown error'
      if (error.message) {
        if (error.message.includes('duplicate key value violates unique constraint "employees_email_key"')) {
          errorMessage = 'An employee with this email already exists. Please use a different email address.'
        } else {
          errorMessage = error.message
        }
      }
      alert(`Failed to save employee: ${errorMessage}`)
      return
    }

    if (!data) {
      alert('Failed to save employee: No data returned')
      return
    }

    // Create Supabase Auth user using admin API
    try {
      console.log('Creating Supabase Auth user for:', newEmployee.email)
      const authResponse = await fetch('/api/auth/create-employee-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmployee.email,
          password: newEmployee.password,
          name: newEmployee.name,
          employeeId: data.id
        }),
      })

      const authResult = await authResponse.json()
      
      if (!authResponse.ok) {
        console.error('Auth user creation failed:', authResult)
        // Employee was created but auth user failed - continue with email sending
      } else {
        console.log('Auth user created successfully:', authResult)
        // Update employee with Supabase user ID
        await supabase
          .from('employees')
          .update({ supabase_user_id: authResult.userId })
          .eq('id', data.id)
      }
    } catch (authError) {
      console.error('Error creating auth user:', authError)
      // Continue with email sending even if auth user creation fails
    }

    if (data) {
      // Send email with credentials
      try {
        const emailResponse = await fetch('/api/email/send-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newEmployee.name,
            email: newEmployee.email,
            password: newEmployee.password,
            role: 'employee',
            destination: newEmployee.destination
          }),
        })

        const emailResult = await emailResponse.json()

        setEmployees(prev => [{
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          destination: data.destination,
          role: data.role,
          status: data.status
        }, ...prev])
        setShowCreateModal(false)
        setNewEmployee({ name: '', email: '', phone: '', destination: '', password: '' })
        
        if (emailResult.success) {
          alert('Employee created successfully! Credentials have been sent to their email.')
        } else {
          alert('Employee created successfully! However, there was an issue sending the email. Please share credentials manually.')
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        setEmployees(prev => [{
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          destination: data.destination,
          role: data.role,
          status: data.status
        }, ...prev])
        setShowCreateModal(false)
        setNewEmployee({ name: '', email: '', phone: '', destination: '', password: '' })
        alert('Employee created successfully! However, there was an issue sending the email. Please share credentials manually.')
      }
    } else {
      let errorMessage = 'Unknown error'
      if (error?.message) {
        if (error.message.includes('duplicate key value violates unique constraint "employees_email_key"')) {
          errorMessage = 'An employee with this email already exists. Please use a different email address.'
        } else {
          errorMessage = error.message
        }
      }
      alert(`Failed to save employee: ${errorMessage}`)
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
                    {emp.destination && <div className="text-xs text-gray-400">{emp.destination}</div>}
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
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">Add Employee</h3>
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
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
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10-digit number"
                    title="Enter a 10-digit phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    value={newEmployee.destination}
                    onChange={(e) => setNewEmployee({ ...newEmployee, destination: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Preferred destination"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)} 
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEmployee}
                  className="px-3 py-1.5 bg-primary text-white rounded-md hover:opacity-90 text-sm"
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
