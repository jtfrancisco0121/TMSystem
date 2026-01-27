import React, { useEffect, useState } from 'react'

type Item = { qty:string|number, unit:string, desc:string, price:string|number, total:number }

export default function InvoicePage(){
  const emptyHeader = { date: new Date().toISOString().slice(0,10), customer:'', address:'', tin:'' }
  const emptyItems: Item[] = Array.from({length:15}).map(()=>({ qty:'', unit:'', desc:'', price:'', total:0 }))

  const [header, setHeader] = useState(emptyHeader)
  const [items, setItems] = useState<Item[]>(emptyItems)
  const [savedInvoices, setSavedInvoices] = useState<any[]>([])
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
    const ewTaxRate = 0.12
    const vatRate = 0.12
    const ewTax = +(subtotal * ewTaxRate)
    const withoutVAT = +(subtotal - ewTax)
    const withVAT = +(withoutVAT * vatRate)
    const grandTotal = +(withoutVAT + withVAT)
    setTotals({ subtotal, ewTax, withoutVAT, withVAT, grandTotal })
  }

  function saveInvoice(){
    const payload = { id:Date.now(), header, items, totals }
    setSavedInvoices(s=>[payload,...s])
    alert('Saved invoice to local state')
  }

  function printInvoice(){ setPreview({ header, items, totals }) }
  function clearForm(){ if(!confirm('Clear form?')) return; setHeader(emptyHeader); setItems(emptyItems) }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Invoice</h3>
        <div className="flex items-center gap-2">
          <button onClick={saveInvoice} className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Save</button>
          <button onClick={printInvoice} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Print</button>
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
        <div>
          <div className="modal-backdrop" onClick={()=>setPreview(null)}>
            <div className="modal">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <div className="mt-2"><strong>{preview.header.customer}</strong> — {preview.header.address}</div>
              <div className="mt-2 text-sm">Subtotal: {preview.totals.subtotal.toFixed(2)}</div>
              <div className="mt-2 text-right"><button onClick={()=>{ console.log('Print', preview); window.print() }} className="px-3 py-2 bg-indigo-600 text-white rounded">Print</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
