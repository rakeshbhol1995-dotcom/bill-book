"use client"; // Next.js App Router pain eita jaruri

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Printer, Settings, 
  FileText, Save, ArrowLeft, Search, 
  User, CheckCircle, Smartphone, Image as ImageIcon, Loader,
  CreditCard, Calendar, PieChart, BarChart3, LogOut, Box, Wallet, TrendingUp, History, Download, Phone
} from 'lucide-react';

// --- SHARED COMPONENTS ---

const Card = ({ children, className = "", id = "" }: any) => (
  <div id={id} className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
    {children}
  </div>
);

const Input = ({ label, className = "", ...props }: any) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
    <input 
      className={`w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent transition-all ${className}`}
      {...props}
    />
  </div>
);

const Button = ({ children, variant = 'primary', className = "", ...props }: any) => {
  const baseStyle = "px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: any = {
    primary: "bg-[#1e3a5f] text-white hover:bg-[#152a45] shadow-md",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-md",
    accent: "bg-[#c9a227] text-[#1e3a5f] hover:bg-[#b08d1f] shadow-md",
    outline: "bg-transparent text-[#1e3a5f] border border-[#1e3a5f] hover:bg-blue-50"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- HELPER FUNCTIONS ---
const calculateTotals = (items: any[], supplyType: string) => {
  let subtotal = 0;
  let totalTax = 0;
  items.forEach(item => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const lineTotal = qty * price;
    const taxRate = parseFloat(item.gst) || 0;
    subtotal += lineTotal;
    totalTax += lineTotal * (taxRate / 100);
  });
  return { subtotal, totalTax, grandTotal: subtotal + totalTax };
};

const numberToWords = (num: any) => {
  const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if ((num = num.toString()).length > 9) return 'Overflow';
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  // FIX: Comparing Number(n[x]) instead of n[x] directly
  str += (Number(n[1]) != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str ? str + 'Only' : '';
};

// --- DATA MANAGER ---
const STORAGE_KEYS = {
  USER: 'billing_app_user',
  EXPENSES: 'billing_app_expenses',
  COMPANY: 'billing_app_company'
};

const getData = (key: string) => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

const saveData = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// --- SUB-COMPONENTS ---

const LoginView = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const fakeUser = { uid: 'local-user-123', email };
      saveData(STORAGE_KEYS.USER, fakeUser);
      onLogin(fakeUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1e3a5f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#c9a227] rounded-xl flex items-center justify-center text-[#1e3a5f] mx-auto mb-4 shadow-lg">
            <FileText size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#1e3a5f]">BillPro Offline</h1>
          <p className="text-slate-500">Fast & Secure Billing</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          <Input label="Email Address" type="email" value={email} onChange={(e:any) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? <Loader className="animate-spin"/> : 'Login to Dashboard'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const ExpensesView = ({ expenses, setExpenses, setView }: any) => {
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], category: '', amount: '', note: '' });

  const handleSaveExpense = (e: any) => {
    e.preventDefault();
    const expense = { id: Date.now().toString(), ...newExpense, amount: parseFloat(newExpense.amount) || 0, createdAt: new Date().toISOString() };
    const updated = [expense, ...expenses];
    setExpenses(updated);
    saveData(STORAGE_KEYS.EXPENSES, updated);
    setNewExpense({ date: new Date().toISOString().split('T')[0], category: '', amount: '', note: '' });
  };

  return (
    <div className="pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Expense Manager</h2>
      </div>
      <Card className="p-6 mb-6 border-t-4 border-t-red-500">
          <h3 className="font-bold text-red-600 mb-4">Add New Expense</h3>
          <form onSubmit={handleSaveExpense} className="space-y-4">
            <Input type="date" label="Date" value={newExpense.date} onChange={(e:any) => setNewExpense({...newExpense, date: e.target.value})} required />
            <Input label="Category" value={newExpense.category} onChange={(e:any) => setNewExpense({...newExpense, category: e.target.value})} required />
            <Input type="number" label="Amount" value={newExpense.amount} onChange={(e:any) => setNewExpense({...newExpense, amount: e.target.value})} required />
            <Button type="submit" variant="danger" className="w-full">Record Expense</Button>
          </form>
      </Card>
      {expenses.map((exp: any) => (
         <div key={exp.id} className="bg-white p-4 rounded-xl border mb-2 flex justify-between">
            <span>{exp.category}</span>
            <span className="font-bold text-red-600">- ₹{exp.amount}</span>
         </div>
      ))}
    </div>
  );
};

const DashboardView = ({ invoices, expenses, setView, startNewInvoice, searchQuery, setSearchQuery }: any) => {
  const totalSales = invoices.reduce((acc: number, curr: any) => acc + (curr.totals?.grandTotal || 0), 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sales</p>
            <h3 className="text-2xl font-bold text-[#1e3a5f]">₹{totalSales.toLocaleString('en-IN')}</h3>
         </div>
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 cursor-pointer" onClick={() => setView('expenses')}>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Expenses</p>
            <h3 className="text-2xl font-bold text-red-600">Click to View</h3>
         </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={startNewInvoice} variant="accent" className="h-12"><Plus size={18}/> NEW BILL</Button>
        <Button onClick={() => setView('inventory')} variant="outline" className="h-12 bg-white"><Box size={18}/> STOCK</Button>
      </div>
      <Card className="overflow-hidden min-h-[400px]">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-[#1e3a5f]">Recent Invoices</h3>
          <input type="search" placeholder="Search..." className="pl-3 pr-3 py-1 border rounded text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 uppercase text-xs">
              <tr><th className="p-4">Bill No</th><th className="p-4">Client</th><th className="p-4 text-right">Amount</th></tr>
            </thead>
            <tbody>
              {invoices.filter((i: any) => i.clientName.toLowerCase().includes(searchQuery.toLowerCase())).map((inv: any) => (
                <tr key={inv._id || inv.id} className="border-b">
                  <td className="p-4">#{inv.invoiceNo}</td>
                  <td className="p-4">{inv.clientName}</td>
                  <td className="p-4 text-right">₹{inv.totals?.grandTotal?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CreateInvoiceView = ({ currentInvoice, setCurrentInvoice, setView, handleSaveInvoice, products }: any) => {
  const handleAddItem = () => {
       setCurrentInvoice((prev: any) => ({
         ...prev, 
         items: [...prev.items, { id: Date.now(), name: '', hsn: '', qty: 1, price: 0, gst: 0 }]
       }));
  };

  const updateItem = (id: number, field: string, val: any) => {
       setCurrentInvoice((prev: any) => {
         const newItems = prev.items.map((i: any) => {
             if (i.id === id) {
                if (field === 'name') {
                   const product = products.find((p: any) => p.name.toLowerCase() === val.toLowerCase());
                   if (product) return { ...i, name: val, price: product.price, hsn: product.hsn, gst: product.gst };
                }
                return { ...i, [field]: val };
             }
             return i;
         });
         return { ...prev, items: newItems };
       });
  };

  const totals = calculateTotals(currentInvoice.items, currentInvoice.supplyType);

  return (
    <div className="pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Create New Bill</h2>
      </div>
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Customer Name" value={currentInvoice.clientName} onChange={(e:any) => setCurrentInvoice({...currentInvoice, clientName: e.target.value})} />
            <Input label="Phone" value={currentInvoice.clientPhone} onChange={(e:any) => setCurrentInvoice({...currentInvoice, clientPhone: e.target.value})} />
            <Input label="Bill No" type="number" value={currentInvoice.invoiceNo} onChange={(e:any) => setCurrentInvoice({...currentInvoice, invoiceNo: e.target.value})} />
            <Input label="Date" type="date" value={currentInvoice.date} onChange={(e:any) => setCurrentInvoice({...currentInvoice, date: e.target.value})} />
          </div>
        </Card>
        <Card className="p-4">
           <div className="flex justify-between mb-4">
             <h3 className="font-bold">Items</h3>
             <Button size="sm" onClick={handleAddItem}><Plus size={16}/> Add</Button>
           </div>
           {currentInvoice.items.map((item: any) => (
             <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-4"><Input placeholder="Item" value={item.name} onChange={(e:any) => updateItem(item.id, 'name', e.target.value)} list="prods" /></div>
                <div className="col-span-2"><Input placeholder="Qty" type="number" value={item.qty} onChange={(e:any) => updateItem(item.id, 'qty', e.target.value)} /></div>
                <div className="col-span-3"><Input placeholder="Price" type="number" value={item.price} onChange={(e:any) => updateItem(item.id, 'price', e.target.value)} /></div>
                <div className="col-span-3 text-right font-bold pt-2">₹{(item.qty * item.price).toFixed(0)}</div>
             </div>
           ))}
           <datalist id="prods">{products.map((p:any) => <option key={p._id} value={p.name}/>)}</datalist>
        </Card>
        <Card className="p-4">
           <div className="flex justify-between text-xl font-bold text-[#1e3a5f]">
             <span>Grand Total</span>
             <span>₹{totals.grandTotal.toFixed(2)}</span>
           </div>
        </Card>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-20">
         <Button onClick={handleSaveInvoice} className="w-full md:w-auto"><Save size={18}/> SAVE BILL</Button>
      </div>
    </div>
  );
};

const InventoryView = ({ products, setProducts, setView }: any) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  const handleSaveProduct = async () => {
     try {
       const res = await fetch('/api/products', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price), stock: parseFloat(newProduct.stock) })
       });
       if (res.ok) {
         alert("Product Saved!");
         window.location.reload();
       } else {
         throw new Error("API failed");
       }
     } catch (e) { alert("Error saving (Backend is needed)"); }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-200 rounded-full"><ArrowLeft size={24}/></button>
        <h2 className="text-2xl font-bold text-[#1e3a5f]">Inventory</h2>
      </div>
      <Card className="p-6 mb-6">
         <div className="grid gap-4">
           <Input label="Name" value={newProduct.name} onChange={(e:any) => setNewProduct({...newProduct, name: e.target.value})} />
           <Input label="Price" type="number" value={newProduct.price} onChange={(e:any) => setNewProduct({...newProduct, price: e.target.value})} />
           <Input label="Stock" type="number" value={newProduct.stock} onChange={(e:any) => setNewProduct({...newProduct, stock: e.target.value})} />
           <Button onClick={handleSaveProduct}>Add Product</Button>
         </div>
      </Card>
      <div className="grid gap-4">
        {products.map((p:any) => (
          <Card key={p._id} className="p-4 flex justify-between">
             <span className="font-bold">{p.name}</span>
             <span>Stock: {p.stock} | ₹{p.price}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [currentInvoice, setCurrentInvoice] = useState({
    id: '', invoiceNo: 101, date: new Date().toISOString().split('T')[0],
    clientName: '', clientPhone: '', items: [], supplyType: 'intra'
  });

  useEffect(() => {
    const u = getData(STORAGE_KEYS.USER);
    if (u && u.uid) setUser(u);

    // Safe fetch to prevent crash in Preview
    const safeFetch = async (url: string) => {
        try {
            const res = await fetch(url);
            return await res.json();
        } catch (e) {
            console.warn("API Fetch Failed (Expected in Preview Mode):", e);
            return { success: false, data: [] };
        }
    };

    const fetchData = async () => {
      const invData = await safeFetch('/api/invoices');
      if(invData.success) setInvoices(invData.data);

      const prodData = await safeFetch('/api/products');
      if(prodData.success) setProducts(prodData.data);
    };
    fetchData();
    
    setExpenses(getData(STORAGE_KEYS.EXPENSES));
  }, []);

  const handleSaveInvoice = async () => {
    if (!currentInvoice.clientName) return alert("Client Name Required");
    
    const totals = calculateTotals(currentInvoice.items, currentInvoice.supplyType);
    const payload = { ...currentInvoice, invoiceNo: parseInt(currentInvoice.invoiceNo as any), totals };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(res.ok) {
         alert("Invoice Saved!");
         window.location.reload();
      } else {
        throw new Error("API failed");
      }
    } catch(e) { alert("Failed to save (Backend is needed)"); }
  };

  const startNewInvoice = () => {
    const nextNo = invoices.length > 0 ? Math.max(...invoices.map((i:any) => i.invoiceNo || 0)) + 1 : 101;
    setCurrentInvoice({
      id: '', invoiceNo: nextNo, date: new Date().toISOString().split('T')[0],
      clientName: '', clientPhone: '', items: [{ id: Date.now(), name: '', qty: 1, price: 0, gst: 0 }], supplyType: 'intra'
    });
    setView('create');
  };

  if (!user) return <LoginView onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 container mx-auto p-4">
       {view === 'dashboard' && <DashboardView invoices={invoices} expenses={expenses} setView={setView} startNewInvoice={startNewInvoice} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
       {view === 'create' && <CreateInvoiceView currentInvoice={currentInvoice} setCurrentInvoice={setCurrentInvoice} setView={setView} handleSaveInvoice={handleSaveInvoice} products={products} />}
       {view === 'inventory' && <InventoryView products={products} setProducts={setProducts} setView={setView} />}
       {view === 'expenses' && <ExpensesView expenses={expenses} setExpenses={setExpenses} setView={setView} />}
    </div>
  );
}