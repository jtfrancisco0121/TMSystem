import React, { useEffect, useState } from 'react'

type Item = { qty:string|number, unit:string, desc:string, price:string|number, total:number }

export default function InvoicePage(){
  const emptyHeader = { date: new Date().toISOString().slice(0,10), customer:'', address:'', tin:'' }
  const emptyItems: Item[] = Array.from({length:15}).map(()=>({ qty:'', unit:'', desc:'', price:'', total:0 }))

  const [header, setHeader] = useState(emptyHeader)
  const [items, setItems] = useState<Item[]>(emptyItems)
  const [savedInvoices, setSavedInvoices] = useState<any[]>(() => {
    try { const raw = localStorage.getItem('savedInvoices'); return raw ? JSON.parse(raw) : [] } catch { return [] }
  })
  const [preview, setPreview] = useState<any|null>(null)
  const [totals, setTotals] = useState({ subtotal:0, ewTax:0, withoutVAT:0, withVAT:0, grandTotal:0 })

  useEffect(()=> computeTotals(), [items])

  function updateItem(i:number, field:string, value:any){
    const next = [...items]
    // @ts-ignore
    next[i] = { ...next[i], [field]: value }
    const qty = parseFloat(String(next[i].qty)) || 0
    const price = parseFloat(String(next[i].price)) || 0
    next[i].total = +(qty * price)
    setItems(next)
  }

  function computeTotals(){
    const subtotal = items.reduce((s,it)=> s + (parseFloat(String(it.total))||0), 0)
    const ewTax = +(subtotal * 0.12)
    const withVAT = +(subtotal + ewTax)
    const withoutVAT = +(subtotal / 1.12)
    const grandTotal = withVAT
    setTotals({ subtotal, ewTax, withoutVAT, withVAT, grandTotal })
  }

  function saveInvoice(){
    const payload = { id:Date.now(), header, items, totals }
    setSavedInvoices(s=>{
      const next = [payload,...s]
      try{ localStorage.setItem('savedInvoices', JSON.stringify(next)) }catch{}
      return next
    })
    alert('Saved invoice to local state')
  }

  function openPreview(){ setPreview({ header, items, totals }) }
  function printInvoice(){ window.print() }
  function clearForm(){ if(!confirm('Clear form?')) return; setHeader(emptyHeader); setItems(emptyItems) }

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

      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Date</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" type="date" value={header.date} onChange={e=>setHeader(h=>({...h, date:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Customer Name</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.customer} onChange={e=>setHeader(h=>({...h, customer:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Address</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.address} onChange={e=>setHeader(h=>({...h, address:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">TIN</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.tin} onChange={e=>setHeader(h=>({...h, tin:e.target.value}))} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {items.map((it,i)=> (
              <tr key={i} className={i%2===0? 'bg-white':'bg-gray-50'}>
                <td className="px-3 py-2 w-24"><input className="w-full px-2 py-1 border rounded-md text-sm" type="number" value={String(it.qty)} onChange={e=>updateItem(i,'qty', e.target.value)} /></td>
                <td className="px-3 py-2 w-24"><input className="w-full px-2 py-1 border rounded-md text-sm" value={it.unit} onChange={e=>updateItem(i,'unit', e.target.value)} /></td>
                <td className="px-3 py-2"><input className="w-full px-2 py-1 border rounded-md text-sm" value={it.desc} onChange={e=>updateItem(i,'desc', e.target.value)} /></td>
                <td className="px-3 py-2 w-32 text-right"><input className="w-full px-2 py-1 border rounded-md text-sm text-right" type="number" step="0.01" value={String(it.price)} onChange={e=>updateItem(i,'price', e.target.value)} /></td>
                <td className="px-3 py-2 w-32 text-right text-sm font-medium">{(it.total||0).toFixed(2)}</td>
              </tr>
            ))}
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
