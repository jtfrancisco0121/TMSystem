import React from 'react'

export default function Sidebar({ onNavigate, active }: { onNavigate: (r:string)=>void, active:string }){
  const links = [
    ['dashboard','Dashboard'],
    ['inventory','Inventory'],
    ['invoices','Invoices'],
    ['receipts','Receipts'],
    ['reports','Reports'],
    ['settings','Settings']
  ] as [string,string][]

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 hidden md:flex flex-col">
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-700">
        <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>
        <div className="font-semibold text-lg">Inventory • Invoice</div>
      </div>
      <nav className="p-4 space-y-1">
        {links.map(([key,label])=> (
          <button key={key} onClick={()=>onNavigate(key)} className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm ${active===key? 'bg-slate-700 text-white':'text-slate-300 hover:bg-slate-700'}`}>
            <span className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-xs">{label.charAt(0)}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">v0.1.0</div>
      </div>
    </aside>
  )
}
