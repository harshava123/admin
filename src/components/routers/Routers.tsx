import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import Leads from '../pages/crm/Leads'
import Bookings from '../pages/crm/Bookings'
import Payments from '../pages/crm/Payments'
import Reports from '../pages/crm/Reports'
import Packages from '../pages/cms/Packages'
import Blogs from '../pages/cms/Blogs'
import Settings from '../pages/Settings'
import WebsiteEdit from '../pages/cms/WebsiteEdit'
import Employees from '../pages/Employees'

const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/website-edit" element={<WebsiteEdit />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default Routers
