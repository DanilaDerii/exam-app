import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const customers = await Customer.find();
  return NextResponse.json(customers);
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const customer = new Customer(data);
  await customer.save();
  return NextResponse.json(customer);
}
