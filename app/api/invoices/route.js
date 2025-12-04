import dbConnect from '@/lib/db';
import Invoice from '@/models/Invoice';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const invoice = await Invoice.create(body);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}