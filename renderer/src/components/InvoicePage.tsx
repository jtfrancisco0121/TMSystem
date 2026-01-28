import React from 'react'
import { useFinancials } from '../hooks/useFinancials'
import { useInventory } from '../hooks/useInventory'

export default function InvoicePage(){
  const { products, updateStock, setInventory } = useInventory()
  const emptyHeader = { date: new Date().toISOString().slice(0,10), customer:'', address:'', tin:'' }
  const { header, setHeader, items, updateItem, totals, saveRecord, preview, setPreview, openPreview, clear } = useFinancials<typeof emptyHeader>(emptyHeader, 'savedInvoices')

  function saveInvoice(){ saveRecord(); alert('Saved invoice to local state') }
  function printInvoice(){ window.print() }
  function clearForm(){ if(!confirm('Clear form?')) return; clear() }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Invoice</h3>
        <div className="flex items-center gap-2">
          <button onClick={saveInvoice} className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save Invoice</button>
          <button onClick={openPreview} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Preview</button>
          <button onClick={printInvoice} className="px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Print</button>
          <button onClick={clearForm} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Clear</button>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((it,i)=> {
              // Get selected SKUs in other rows to prevent duplicates
              const selectedSKUs = items.map(row => row.sku).filter((sku, idx) => sku && idx !== i)
              return (
                <tr key={i} className={i%2===0? 'bg-white':'bg-gray-50'}>
                  <td className="px-3 py-2 w-40">
                    <select
                      className="w-full px-2 py-1 border rounded-md text-sm"
                      value={it.sku || ''}
                      onChange={e => {
                        const sku = e.target.value
                        const prod = products.find(p => p.sku === sku)
                        if (prod) {
                          updateItem(i, 'sku', prod.sku)
                          updateItem(i, 'desc', prod.name)
                          updateItem(i, 'unit', prod.category)
                          updateItem(i, 'price', prod.price)
                        }
                      }}
                    >
                      <option value="">Select product</option>
                      {products.filter(p => !selectedSKUs.includes(p.sku)).map(prod => (
                        <option key={prod.sku} value={prod.sku}>{prod.name} ({prod.sku})</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input
                      className="w-full px-2 py-1 border rounded-md text-sm"
                      type="number"
                      min={1}
                      max={(() => {
                        const prod = products.find(p => p.sku === it.sku)
                        return prod ? prod.stock : 9999
                      })()}
                      value={String(it.qty)}
                      onChange={e => {
                        const prod = products.find(p => p.sku === it.sku)
                        const qty = Number(e.target.value)
                        if (prod && qty > prod.stock) {
                          alert('Quantity exceeds available stock!')
                          return
                        }
                        updateItem(i, 'qty', qty)
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 w-24">
                    <input className="w-full px-2 py-1 border rounded-md text-sm" value={it.unit || ''} onChange={e=>updateItem(i,'unit', e.target.value)} />
                  </td>
                  <td className="px-3 py-2">
                    <input className="w-full px-2 py-1 border rounded-md text-sm" value={it.desc || ''} onChange={e=>updateItem(i,'desc', e.target.value)} />
                  </td>
                  <td className="px-3 py-2 w-32 text-right">
                    <input className="w-full px-2 py-1 border rounded-md text-sm text-right" type="number" step="0.01" value={String(it.price || '')} onChange={e=>updateItem(i,'price', e.target.value)} />
                  </td>
                  <td className="px-3 py-2 w-32 text-right text-sm font-medium">{(it.total||0).toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <div className="w-full md:w-1/3 bg-white shadow rounded-lg p-4">
          <div className="flex justify-between py-1"><div className="text-sm text-gray-600">Subtotal</div><div className="font-medium">{totals.subtotal.toFixed(2)}</div></div>
          <div className="flex justify-between py-1"><div className="text-sm text-gray-600">EW Tax</div><div className="font-medium">{totals.ewTax.toFixed(2)}</div></div>
          <div className="flex justify-between py-1"><div className="text-sm text-gray-600">Without VAT</div><div className="font-medium">{totals.withoutVAT.toFixed(2)}</div></div>
          <div className="flex justify-between py-1"><div className="text-sm text-gray-600">With VAT</div><div className="font-medium">{totals.withVAT.toFixed(2)}</div></div>
          <div className="flex justify-between py-2 border-t mt-2"><div className="text-lg font-semibold">Grand Total</div><div className="text-lg font-bold">{totals.grandTotal.toFixed(2)}</div></div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setPreview(null)}></div>
          <div className="relative bg-white w-[90%] max-w-3xl rounded-lg shadow-lg p-6 overflow-auto max-h-[90%] printable-invoice">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <button onClick={()=>setPreview(null)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{preview.header.customer}</div>
                  <div className="text-sm text-gray-600">{preview.header.address}</div>
                  <div className="text-sm text-gray-600">TIN: {preview.header.tin}</div>
                </div>
                <div className="text-sm text-gray-600">Date: {preview.header.date}</div>
              </div>

              <table className="w-full mt-4 text-sm border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Unit</th>
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Unit Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.items.map((it:any, idx:number)=> (
                    <tr key={idx} className="border-t">
                      <td className="py-2 align-top">{it.qty}</td>
                      <td className="py-2 align-top">{it.unit}</td>
                      <td className="py-2 align-top">{it.desc}</td>
                      <td className="py-2 text-right align-top">{(parseFloat(String(it.price))||0).toFixed(2)}</td>
                      <td className="py-2 text-right align-top">{(parseFloat(String(it.total))||0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 w-full flex justify-end">
                <div className="w-full md:w-1/3">
                  <div className="flex justify-between py-1"><div className="text-sm text-gray-600">Subtotal</div><div className="font-medium">{preview.totals.subtotal.toFixed(2)}</div></div>
                  <div className="flex justify-between py-1"><div className="text-sm text-gray-600">EW Tax (12%)</div><div className="font-medium">{preview.totals.ewTax.toFixed(2)}</div></div>
                  <div className="flex justify-between py-1"><div className="text-sm text-gray-600">Without VAT</div><div className="font-medium">{preview.totals.withoutVAT.toFixed(2)}</div></div>
                  <div className="flex justify-between py-1"><div className="text-sm text-gray-600">With VAT</div><div className="font-medium">{preview.totals.withVAT.toFixed(2)}</div></div>
                  <div className="flex justify-between py-2 border-t mt-2"><div className="text-lg font-semibold">Grand Total</div><div className="text-lg font-bold">{preview.totals.grandTotal.toFixed(2)}</div></div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>window.print()} className="px-3 py-2 bg-indigo-600 text-white rounded">Print</button>
                <button onClick={()=>setPreview(null)} className="px-3 py-2 bg-gray-200 text-gray-700 rounded">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
