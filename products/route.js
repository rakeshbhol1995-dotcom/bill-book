import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const products = await Product.find({});
  return NextResponse.json({ success: true, data: products });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json({ success: true, data: product }, { status: 201 });
}