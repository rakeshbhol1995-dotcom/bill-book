"use client"; // Eita line bahut important

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Trash2, Printer, Settings, 
  FileText, Save, ArrowLeft, Search, 
  User, CheckCircle, Smartphone, Image as ImageIcon, Loader,
  CreditCard, Calendar, PieChart, BarChart3, LogOut, Box, Wallet, TrendingUp, History, Download, Phone
} from 'lucide-react';

// ... (Card, Input, Button components au helper functions puruna pari rakhibe) ...
// ... (Tale paste kariba purbe, tala code ku dekhi modify karantu) ...

export default function App() {
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  // ... anya states (view, currentInvoice etc.) ...

  // 1. Data Load (Fetch from API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch('/api/invoices');
        const invData = await invRes.json();
        if(invData.success) setInvoices(invData.data);

        const prodRes = await fetch('/api/products');
        const prodData = await prodRes.json();
        if(prodData.success) setProducts(prodData.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  // 2. Save Invoice (Send to API)
  const handleSaveInvoice = async () => {
    // ... (Validation logic same rahiba) ...

    const totals = calculateTotals(currentInvoice.items, currentInvoice.supplyType);
    const invoiceData = { 
        ...currentInvoice,
        invoiceNo: parseInt(currentInvoice.invoiceNo),
        totals 
    };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (res.ok) {
         alert("Bill Saved to Database!");
         window.location.reload(); 
      }
    } catch (error) {
      alert("Failed to save");
    }
  };

  // ... (Baki UI code same rahiba) ...
  // Note: LocalStorage logic ku hataidebe.
  
  return (
    // ... JSX code same rahiba ...
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
       {/* UI Content */}
    </div>
  );
}
