import React, { useMemo, useState } from 'react'
import ProductModal from './ProductModal'

type Prod = {
  sku: string
  name: string
  category: string
  stock: number
  price: number
}

const sample: Prod[] = [
  { sku: 'P001', name: 'Widget A', category: 'Gadgets', stock: 120, price: 9.9 },
  { sku: 'P002', name: 'Widget B', category: 'Gadgets', stock: 45, price: 14.5 },
  { sku: 'P003', name: 'Gizmo', category: 'Tools', stock: 200, price: 5.25 },
]

export default function Inventory(): JSX.Element {
  // Products state
  const [products, setProducts] = useState<Prod[]>(sample)
  const [q, setQ] = useState<string>('') // search query
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalInitial, setModalInitial] = useState<Prod | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Generate unique SKU
  function generateUniqueSKU(existing: Prod[], len = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let sku = ''
    do {
      sku = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    } while (existing.some(p => p.sku === sku))
    return sku
  }

  // Filtered products based on search
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter(
      (p) => p.sku.toLowerCase().includes(s) || p.name.toLowerCase().includes(s),
    )
  }, [q, products])

  // Open Add Product modal
  function openAdd() {
    setEditingIndex(null)
    const sku = generateUniqueSKU(products)
    setModalInitial({ sku, name: '', category: '', stock: 0, price: 0 })
    setModalOpen(true)
  }

  // Open Edit Product modal
  function openEdit(index: number) {
    setEditingIndex(index)
    setModalInitial(products[index])
    setModalOpen(true)
  }

  // Save Product (Add or Edit)
  function saveProduct(p: Prod) {
    if (editingIndex === null) {
      setProducts((s) => [p, ...s])
    } else {
      setProducts((s) => s.map((it, idx) => (idx === editingIndex ? p : it)))
    }
    setModalOpen(false)
    setModalInitial(null)
  }

  // Delete Product
  function deleteProduct(index: number) {
    if (!confirm('Delete this product?')) return
    setProducts((s) => s.filter((_, idx) => idx !== index))
  }

  return (
    <div>
      {/* Header + Search */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Products</h3>
        <div className="flex items-center gap-2">
          <input
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Search SKU or name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={openAdd}
            className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((p) => {
              const idx = products.findIndex(prod => prod.sku === p.sku) // map filtered -> original
              return (
                <tr key={p.sku} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{p.sku}</td>
                  <td className="px-4 py-3 text-sm">{p.name}</td>
                  <td className="px-4 py-3 text-sm">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-sm text-right">{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    <button
                      onClick={() => openEdit(idx)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(idx)}
                      className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <ProductModal
  open={modalOpen}
  initial={modalInitial ?? undefined} // converts null to undefined
  onSave={saveProduct}
  onClose={() => { setModalOpen(false); setModalInitial(null) }}
/>

    </div>
  )
}
