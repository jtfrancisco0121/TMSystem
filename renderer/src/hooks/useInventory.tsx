import { useState, useEffect } from 'react'

export type Product = {
  sku: string
  name: string
  category: string
  stock: number
  price: number
}

const STORAGE_KEY = 'inventoryProducts'

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  function updateStock(sku: string, qty: number) {
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku ? { ...p, stock: Math.max(0, p.stock - qty) } : p
      )
    )
  }

  function setInventory(newProducts: Product[]) {
    setProducts(newProducts)
  }

  return { products, setInventory, updateStock }
}
