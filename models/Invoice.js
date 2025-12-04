import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: Number,
  date: String,
  clientName: String,
  clientPhone: String,
  clientAddress: String,
  clientGst: String,
  items: Array,
  totals: Object,
  amountPaid: Number,
  status: String,
  supplyType: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
