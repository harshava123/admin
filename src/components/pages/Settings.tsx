import React, { useState } from 'react'

interface GeneralSettings {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  timezone: string
  currency: string
}

interface WebsiteSettings {
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  logo: string
  favicon: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  newLeadAlert: boolean
  bookingAlert: boolean
  paymentAlert: boolean
  weeklyReport: boolean
}

interface IntegrationSettings {
  googleAnalytics: string
  facebookPixel: string
  whatsappBusiness: string
  paymentGateway: string
}

interface SettingsData {
  general: GeneralSettings
  website: WebsiteSettings
  notifications: NotificationSettings
  integrations: IntegrationSettings
}

interface Tab {
  id: string
  name: string
  icon: string
}

interface User {
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive'
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      companyName: 'Travel Dreams Agency',
      companyEmail: 'info@traveldreams.com',
      companyPhone: '+1-555-0123',
      companyAddress: '123 Travel Street, Adventure City, AC 12345',
      timezone: 'UTC-5',
      currency: 'USD'
    },
    website: {
      siteTitle: 'Travel Dreams - Your Gateway to Adventure',
      siteDescription: 'Discover amazing destinations and book your dream vacation with Travel Dreams Agency.',
      siteKeywords: 'travel, vacation, tours, destinations, booking',
      logo: '/api/placeholder/200/100',
      favicon: '/api/placeholder/32/32'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newLeadAlert: true,
      bookingAlert: true,
      paymentAlert: true,
      weeklyReport: true
    },
    integrations: {
      googleAnalytics: 'GA-XXXXXXXXX',
      facebookPixel: 'FB-XXXXXXXXX',
      whatsappBusiness: '+1-555-0123',
      paymentGateway: 'stripe'
    }
  })

  const updateSetting = <K extends keyof SettingsData>(
    section: K,
    key: keyof SettingsData[K],
    value: SettingsData[K][keyof SettingsData[K]]
  ): void => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const tabs: Tab[] = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'website', name: 'Website', icon: '🌐' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'backup', name: 'Backup', icon: '💾' }
  ]

  const users: User[] = [
    { name: 'Sarah Wilson', email: 'sarah@traveldreams.com', role: 'Admin', status: 'Active' },
    { name: 'Mike Johnson', email: 'mike@traveldreams.com', role: 'Agent', status: 'Active' },
    { name: 'Lisa Davis', email: 'lisa@traveldreams.com', role: 'Agent', status: 'Active' },
    { name: 'David Brown', email: 'david@traveldreams.com', role: 'Manager', status: 'Inactive' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your system settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={settings.general.companyName}
                      onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Email</label>
                    <input
                      type="email"
                      value={settings.general.companyEmail}
                      onChange={(e) => updateSetting('general', 'companyEmail', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Phone</label>
                    <input
                      type="tel"
                      value={settings.general.companyPhone}
                      onChange={(e) => updateSetting('general', 'companyPhone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                  <textarea
                    value={settings.general.companyAddress}
                    onChange={(e) => updateSetting('general', 'companyAddress', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Website Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.website.siteTitle}
                    onChange={(e) => updateSetting('website', 'siteTitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                  <textarea
                    value={settings.website.siteDescription}
                    onChange={(e) => updateSetting('website', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Keywords</label>
                  <input
                    type="text"
                    value={settings.website.siteKeywords}
                    onChange={(e) => updateSetting('website', 'siteKeywords', e.target.value)}
                    placeholder="travel, vacation, tours, destinations"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <div className="h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                        <span className="text-gray-500">Logo Preview</span>
                      </div>
                      <button className="text-primary hover:opacity-80 text-sm">Upload Logo</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center mb-2 mx-auto">
                        <span className="text-gray-500 text-xs">Icon</span>
                      </div>
                      <button className="text-primary hover:opacity-80 text-sm">Upload Favicon</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">New Lead Alert</h4>
                      <p className="text-sm text-gray-500">Get notified when a new lead comes in</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.newLeadAlert}
                      onChange={(e) => updateSetting('notifications', 'newLeadAlert', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Booking Alert</h4>
                      <p className="text-sm text-gray-500">Get notified when a new booking is made</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.bookingAlert}
                      onChange={(e) => updateSetting('notifications', 'bookingAlert', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Payment Alert</h4>
                      <p className="text-sm text-gray-500">Get notified about payment updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.paymentAlert}
                      onChange={(e) => updateSetting('notifications', 'paymentAlert', e.target.checked)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Weekly Report</h4>
                      <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReport}
                      onChange={(e) => updateSetting('notifications', 'weeklyReport', e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Third-party Integrations</h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                  <input
                    type="text"
                    value={settings.integrations.googleAnalytics}
                    onChange={(e) => updateSetting('integrations', 'googleAnalytics', e.target.value)}
                    placeholder="GA-XXXXXXXXX"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={settings.integrations.facebookPixel}
                    onChange={(e) => updateSetting('integrations', 'facebookPixel', e.target.value)}
                    placeholder="FB-XXXXXXXXX"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Business Number</label>
                  <input
                    type="tel"
                    value={settings.integrations.whatsappBusiness}
                    onChange={(e) => updateSetting('integrations', 'whatsappBusiness', e.target.value)}
                    placeholder="+1-555-0123"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                  <select
                    value={settings.integrations.paymentGateway}
                    onChange={(e) => updateSetting('integrations', 'paymentGateway', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="razorpay">Razorpay</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors">
                    Add User
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          {user.role}
                        </span>
                        <button className="text-primary hover:opacity-80 text-sm font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Backup & Data</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Export Data</h4>
                    <p className="text-sm text-primary mb-3">Download all your data in CSV format</p>
                    <button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition-colors">
                      Export All Data
                    </button>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-medium text-primary mb-2">Database Backup</h4>
                    <p className="text-sm text-primary mb-3">Create a complete database backup</p>
                    <button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition-colors">
                      Create Backup
                    </button>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Import Data</h4>
                    <p className="text-sm text-yellow-700 mb-3">Import data from CSV files</p>
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
                      Import Data
                    </button>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Reset System</h4>
                    <p className="text-sm text-red-700 mb-3">Reset all data (irreversible)</p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                      Reset System
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
