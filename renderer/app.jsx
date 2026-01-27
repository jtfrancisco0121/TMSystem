const { useState, useMemo, useEffect } = React;

function App() {
  const [route, setRoute] = useState('dashboard');

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <Sidebar onNavigate={setRoute} active={route} />
      <div className="flex-1 flex flex-col">
        <Header title={route.charAt(0).toUpperCase() + route.slice(1)} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {route === 'dashboard' && <Dashboard />}
            {route === 'inventory' && <Inventory />}
            {route === 'invoices' && <InvoicePage />}
            {route === 'reports' && <Reports />}
            {route === 'settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate, active }) {
  const links = [
    ['dashboard', 'Dashboard'],
    ['inventory', 'Inventory'],
    ['invoices', 'Invoices'],
    ['reports', 'Reports'],
    ['settings', 'Settings']
  ];

  return (
    <aside className="w-64 bg-slate-800 text-slate-100 hidden md:flex flex-col">
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-700">
        <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" /></svg>
        <div className="font-semibold text-lg">Inventory • Invoice</div>
      </div>
      <nav className="p-4 space-y-1">
        {links.map(([key, label]) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className={"w-full text-left px-3 py-2 rounded-md flex items-center gap-2 text-sm " + (active === key ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700')}
          >
            <span className="w-5 h-5 bg-slate-600 rounded flex items-center justify-center text-xs">{label.charAt(0)}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-slate-700">
        <div className="text-sm text-slate-400">v0.1.0</div>
      </div>
    </aside>
  );
}

function Header({ title }) {
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
  );
}

function Dashboard() {
  return (
    <div>
      <h3>Welcome</h3>
      <p>Quick stats and shortcuts will appear here.</p>
    </div>
  );
}

/* ---------------- Inventory ---------------- */
const sampleProducts = [
  { sku: 'P001', name: 'Widget A', category: 'Gadgets', stock: 120, price: 9.99 },
  { sku: 'P002', name: 'Widget B', category: 'Gadgets', stock: 45, price: 14.5 },
  { sku: 'P003', name: 'Gizmo', category: 'Tools', stock: 200, price: 5.25 }
];

function Modal({ children, open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function ProductModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { sku: '', name: '', category: '', stock: 0, price: 0 });

  useEffect(() => setForm(initial || { sku: '', name: '', category: '', stock: 0, price: 0 }), [initial]);

  function submit() {
    if (!form.sku || !form.name) return alert('SKU and Name are required');
    onSave({ ...form, stock: parseInt(form.stock || 0, 10), price: parseFloat(form.price || 0) });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h3>{initial ? 'Edit Product' : 'Add Product'}</h3>
      <div className="form-grid">
        <label>SKU<input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} /></label>
        <label>Name<input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></label>
        <label>Category<input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} /></label>
        <label>Stock<input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} /></label>
        <label>Unit Price<input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></label>
      </div>
      <div style={{ marginTop: 12, textAlign: 'right' }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={submit} style={{ marginLeft: 8 }}>Save</button>
      </div>
    </Modal>
  );
}

function Inventory() {
  const [products, setProducts] = useState(sampleProducts);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(p =>
      (p.sku || '').toString().toLowerCase().includes(s) ||
      (p.name || '').toLowerCase().includes(s) ||
      (p.category || '').toLowerCase().includes(s)
    );
  }, [q, products]);

  function openAdd() {
    setEditingIndex(null);
    setModalOpen(true);
  }

  function openEdit(idx) {
    setEditingIndex(idx);
    setModalOpen(true);
  }

  function saveProduct(prod) {
    if (editingIndex === null) {
      setProducts(p => [prod, ...p]);
    } else {
      setProducts(p => p.map((it, i) => (i === editingIndex ? prod : it)));
    }
  }

  function deleteProduct(idx) {
    if (!confirm('Delete this product?')) return;
    setProducts(p => p.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Products</h3>
        <div className="flex items-center gap-2">
          <input className="px-3 py-2 border rounded-md text-sm" placeholder="Search SKU or name" value={q} onChange={e => setQ(e.target.value)} />
          <button onClick={openAdd} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Product</button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((p, i) => {
              const idx = products.indexOf(p);
              return (
                <tr key={p.sku + i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">{(p.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-right space-x-2">
                    <button onClick={() => openEdit(idx)} className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500">Edit</button>
                    <button onClick={() => deleteProduct(idx)} className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">No products</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveProduct}
        initial={editingIndex !== null ? products[editingIndex] : null}
      />
    </div>
  );
}

/* ---------------- Invoice Page ---------------- */
function InvoicePage() {
  const emptyHeader = { date: new Date().toISOString().slice(0, 10), customer: '', address: '', tin: '' };
  const emptyItems = Array.from({ length: 15 }).map(() => ({ qty: '', unit: '', desc: '', price: '', total: 0 }));

  const [header, setHeader] = useState(emptyHeader);
  const [items, setItems] = useState(emptyItems);

  const [savedInvoices, setSavedInvoices] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => computeTotals(), [items]);

  function updateItem(i, field, value) {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    const qty = parseFloat(next[i].qty) || 0;
    const price = parseFloat(next[i].price) || 0;
    next[i].total = +(qty * price).toFixed(2);
    setItems(next);
  }

  const [totals, setTotals] = useState({ subtotal: 0, ewTax: 0, withoutVAT: 0, withVAT: 0, grandTotal: 0 });

  function computeTotals() {
    const subtotal = items.reduce((s, it) => s + (parseFloat(it.total) || 0), 0);
    const ewTaxRate = 0.12; // EW tax rate (12%)
    const vatRate = 0.12; // VAT rate (12%)
    const ewTax = +(subtotal * ewTaxRate).toFixed(2);
    const withoutVAT = +(subtotal - ewTax).toFixed(2);
    const withVAT = +(withoutVAT * vatRate).toFixed(2);
    const grandTotal = +(withoutVAT + withVAT).toFixed(2);
    setTotals({ subtotal, ewTax, withoutVAT, withVAT, grandTotal });
  }

  function saveInvoice() {
    const payload = { id: Date.now(), header, items, totals };
    setSavedInvoices(s => [payload, ...s]);
    console.log('Saved invoice', payload);
    alert('Invoice saved to local state (placeholder).');
  }

  function printInvoice() {
    // open a simple preview modal
    setPreview({ header, items, totals });
  }

  function clearForm() {
    if (!confirm('Clear the invoice form?')) return;
    setHeader(emptyHeader);
    setItems(emptyItems);
  }

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
            <input className="mt-1 w-full px-3 py-2 border rounded-md" type="date" value={header.date} onChange={e => setHeader(h => ({ ...h, date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Customer Name</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.customer} onChange={e => setHeader(h => ({ ...h, customer: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Address</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.address} onChange={e => setHeader(h => ({ ...h, address: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">TIN</label>
            <input className="mt-1 w-full px-3 py-2 border rounded-md" value={header.tin} onChange={e => setHeader(h => ({ ...h, tin: e.target.value }))} />
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
            {items.map((it, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 w-24"><input className="w-full px-2 py-1 border rounded-md text-sm" type="number" value={it.qty} onChange={e => updateItem(i, 'qty', e.target.value)} /></td>
                <td className="px-3 py-2 w-24"><input className="w-full px-2 py-1 border rounded-md text-sm" value={it.unit} onChange={e => updateItem(i, 'unit', e.target.value)} /></td>
                <td className="px-3 py-2"><input className="w-full px-2 py-1 border rounded-md text-sm" value={it.desc} onChange={e => updateItem(i, 'desc', e.target.value)} /></td>
                <td className="px-3 py-2 w-32 text-right"><input className="w-full px-2 py-1 border rounded-md text-sm text-right" type="number" step="0.01" value={it.price} onChange={e => updateItem(i, 'price', e.target.value)} /></td>
                <td className="px-3 py-2 w-32 text-right text-sm font-medium">{Number.isFinite(it.total) ? it.total.toFixed(2) : (+it.total || 0).toFixed(2)}</td>
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
        <Modal open={!!preview} onClose={() => setPreview(null)}>
          <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <h3>Invoice Preview</h3>
            <div>
              <strong>{preview.header.customer}</strong> — {preview.header.address}
            </div>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Qty</th><th>Unit</th><th>Description</th><th>Unit Price</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {preview.items.map((it, i) => (
                  <tr key={i}>
                    <td>{it.qty}</td>
                    <td>{it.unit}</td>
                    <td>{it.desc}</td>
                    <td>{it.price}</td>
                    <td>{(it.total || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              <div>Subtotal: {preview.totals.subtotal.toFixed(2)}</div>
              <div>Grand Total: {preview.totals.grandTotal.toFixed(2)}</div>
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button onClick={() => { console.log('Print preview', preview); window.print(); }}>Print</button>
              <button onClick={() => setPreview(null)} style={{ marginLeft: 8 }}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------------- Reports ---------------- */
function Reports() {
  const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
  const [results, setResults] = useState(null);

  function genSales() {
    alert(`Generate Sales Report from ${from} to ${to} (placeholder)`);
  }

  function genInventory() {
    // placeholder results
    setResults({
      type: 'inventory',
      from,
      to,
      rows: [
        { sku: 'P001', name: 'Widget A', stock: 120 },
        { sku: 'P002', name: 'Widget B', stock: 45 }
      ]
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Reports</h3>
        <div className="flex items-center gap-2">
          <input className="px-3 py-2 border rounded-md text-sm" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <input className="px-3 py-2 border rounded-md text-sm" type="date" value={to} onChange={e => setTo(e.target.value)} />
          <button onClick={genSales} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Sales Report</button>
          <button onClick={genInventory} className="px-3 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700">Inventory Report</button>
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold mb-2">{results.type} Results</h4>
            <div className="text-sm text-gray-500">Range: {results.from} → {results.to}</div>
            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left text-xs text-gray-500">SKU</th><th className="px-3 py-2 text-left text-xs text-gray-500">Name</th><th className="px-3 py-2 text-right text-xs text-gray-500">Stock</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {results.rows.map(r => (
                    <tr key={r.sku}><td className="px-3 py-2 text-sm">{r.sku}</td><td className="px-3 py-2 text-sm">{r.name}</td><td className="px-3 py-2 text-sm text-right">{r.stock}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <h4 className="font-semibold">Placeholder Chart</h4>
            <div className="h-40 bg-gray-50 rounded-md mt-3 flex items-center justify-center text-sm text-gray-400">Chart / summary placeholder</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() {
  return <div>Settings (placeholder)</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
