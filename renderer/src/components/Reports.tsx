import React, { useState } from 'react'

export default function Reports(){
  const [from, setFrom] = useState(new Date().toISOString().slice(0,10))
  const [to, setTo] = useState(new Date().toISOString().slice(0,10))
  const [results, setResults] = useState<any|null>(null)

  function genSales(){ setResults({ type:'sales', from, to, rows: [{ id:1, total:100 }] }) }
  function genInventory(){ setResults({ type:'inventory', from, to, rows:[{ sku:'P001', name:'Widget A', stock:120 }] }) }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Reports</h3>
        <div className="flex items-center gap-2">
          <input className="px-3 py-2 border rounded-md text-sm" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          <input className="px-3 py-2 border rounded-md text-sm" type="date" value={to} onChange={e=>setTo(e.target.value)} />
          <button onClick={genSales} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Sales Report</button>
          <button onClick={genInventory} className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">Inventory Report</button>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold mb-2">{results.type} Results</h4>
            <div className="text-sm text-gray-500">Range: {results.from} → {results.to}</div>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-xs text-gray-500">SKU</th><th className="px-3 py-2 text-left text-xs text-gray-500">Name</th><th className="px-3 py-2 text-right text-xs text-gray-500">Stock</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {results.rows.map((r:any)=> (
                    <tr key={r.sku||r.id}><td className="px-3 py-2 text-sm">{r.sku||''}</td><td className="px-3 py-2 text-sm">{r.name||''}</td><td className="px-3 py-2 text-sm text-right">{r.stock||r.total||''}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold">Placeholder Chart</h4>
            <div className="h-40 bg-gray-50 rounded-md mt-3 flex items-center justify-center text-sm text-gray-400">Chart / summary placeholder</div>
          </div>
        </div>
      )}
    </div>
  )
}
