import { useEffect, useState } from 'react'

export type Item = { sku?: string, qty: string|number, unit: string, desc: string, price: string|number, total: number }

export function createEmptyItems(count = 15): Item[] {
  return Array.from({ length: count }).map(() => ({ sku: '', qty: '', unit: '', desc: '', price: '', total: 0 }))
}

export function useFinancials<THeader extends Record<string, any>>(initialHeader: THeader, storageKey = 'records') {
  const [header, setHeader] = useState<THeader>(initialHeader)
  const [items, setItems] = useState<Item[]>(() => createEmptyItems())
  const [totals, setTotals] = useState({ subtotal:0, ewTax:0, withoutVAT:0, withVAT:0, grandTotal:0 })
  const [savedRecords, setSavedRecords] = useState<any[]>(() => {
    try { 
      const raw = localStorage.getItem(storageKey); 
      return raw ? JSON.parse(raw) : [] 
    } catch { 
      return [] 
    }
  })
  const [preview, setPreview] = useState<any|null>(null)

  useEffect(()=> computeTotals(), [items])

  function updateItem(i:number, field:keyof Item, value:any){
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

  function saveRecord(){
    const payload = { id: Date.now(), header, items, totals }
    setSavedRecords(s=>{
      const next = [payload, ...s]
      try{ localStorage.setItem(storageKey, JSON.stringify(next)) }catch{}
      return next
    })
  }

  function clear(){ 
    setHeader(initialHeader); 
    setItems(createEmptyItems()) 
  }

  function openPreview(){ 
    setPreview({ header, items, totals }) 
  }

  return {
    header, setHeader,
    items, setItems, updateItem,
    totals,
    savedRecords,
    saveRecord,
    clear,
    preview, setPreview, openPreview
  }
}
