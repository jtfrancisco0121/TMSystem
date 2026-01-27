import React from 'react'

export default function Header({ title }: { title: string }){
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Hello, User</div>
        <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
      </div>
    </header>
  )
}
