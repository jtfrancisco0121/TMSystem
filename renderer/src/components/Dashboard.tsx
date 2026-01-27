import React from 'react'

export default function Dashboard(){
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Welcome</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Card 1</div>
        <div className="bg-white p-4 rounded shadow">Card 2</div>
        <div className="bg-white p-4 rounded shadow">Card 3</div>
      </div>
    </div>
  )
}
