import React, { useEffect, useState } from 'react'
import Modal from './Modal'

type Product = { sku:string, name:string, category:string, stock:number, price:number }

export default function ProductModal({ open, onClose, onSave, initial }: { open:boolean, onClose:()=>void, onSave:(p:Product)=>void, initial?:Product|null }){
  const [form, setForm] = useState<Product>(initial || { sku:'', name:'', category:'', stock:0, price:0 })

  useEffect(()=> setForm(initial || { sku:'', name:'', category:'', stock:0, price:0 }), [initial])

  function submit(){
    if(!form.sku || !form.name) return alert('SKU and Name required')
    onSave({ ...form, stock: Number(form.stock), price: Number(form.price) })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-2">{initial? 'Edit Product':'Add Product'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block"><div className="text-sm text-gray-600">SKU</div><input className="mt-1 w-full px-3 py-2 border rounded" value={form.sku} onChange={e=>setForm(f=>({...f, sku:e.target.value}))} /></label>
        <label className="block"><div className="text-sm text-gray-600">Name</div><input className="mt-1 w-full px-3 py-2 border rounded" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} /></label>
        <label className="block"><div className="text-sm text-gray-600">Category</div><input className="mt-1 w-full px-3 py-2 border rounded" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} /></label>
        <label className="block"><div className="text-sm text-gray-600">Stock</div><input type="number" className="mt-1 w-full px-3 py-2 border rounded" value={form.stock} onChange={e=>setForm(f=>({...f, stock:Number(e.target.value)}))} /></label>
        <label className="block md:col-span-2"><div className="text-sm text-gray-600">Unit Price</div><input type="number" step="0.01" className="mt-1 w-full px-3 py-2 border rounded" value={form.price} onChange={e=>setForm(f=>({...f, price: Number(e.target.value)}))} /></label>
      </div>
      <div className="mt-4 text-right">
        <button className="px-3 py-2 mr-2" onClick={onClose}>Cancel</button>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={submit}>Save</button>
      </div>
    </Modal>
  )
}
