import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Dashboard from './Dashboard'
import Inventory from './Inventory'
import InvoicePage from './InvoicePage'
import Reports from './Reports'
import Settings from './Settings'

export default function App(){
  const [route, setRoute] = useState<'dashboard'|'inventory'|'invoices'|'reports'|'settings'>('dashboard')
  const [updateState, setUpdateState] = useState<{status: string, info?: any} | null>(null)

  React.useEffect(() => {
    const api = (window as any).electronAPI
    if (!api) return

    api.onUpdateChecking(() => setUpdateState({ status: 'checking' }))
    api.onUpdateAvailable((info:any) => setUpdateState({ status: 'available', info }))
    api.onUpdateProgress((p:any) => setUpdateState({ status: 'downloading', info: p }))
    api.onUpdateDownloaded((info:any) => setUpdateState({ status: 'ready', info }))
    api.onUpdateError((err:any) => setUpdateState({ status: 'error', info: err }))
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Update banner */}
      {updateState && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded shadow">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                {updateState.status === 'checking' && 'Checking for updates...'}
                {updateState.status === 'available' && 'Update available — downloading...'}
                {updateState.status === 'downloading' && `Downloading: ${Math.round((updateState.info.percent||0))}%`}
                {updateState.status === 'ready' && 'Update ready to install'}
                {updateState.status === 'error' && `Update error: ${String(updateState.info)}`}
              </div>
              {updateState.status === 'ready' && (
                <button className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => (window as any).electronAPI.installUpdate()}>Restart to install</button>
              )}
            </div>
          </div>
        </div>
      )}
      <Sidebar onNavigate={setRoute} active={route} />
      <div className="flex-1 flex flex-col">
        <Header title={route.charAt(0).toUpperCase() + route.slice(1)} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {route === 'dashboard' && <Dashboard />}
            {route === 'inventory' && <Inventory />}
            {route === 'invoices' && <InvoicePage />}
            {route === 'reports' && <Reports />}
            {route === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  )
}
