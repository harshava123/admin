'use client'

import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './layout/Layout'
import Routers from './routers/Routers'

const ClientApp: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routers />
        </Layout>
      </div>
    </Router>
  )
}

export default ClientApp
