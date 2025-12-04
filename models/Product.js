import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  hsn: String,
  price: Number,
  gst: Number,
  stock: Number
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
