import { NextResponse } from "next/server";
import { prisma } from "../../../src/server/db/client";
import { listCustomers } from "../../../src/server/db/quotation-repository";

export async function GET() {
  const customers = await listCustomers();
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    company?: string;
    contactName?: string;
    contactPhone?: string;
    industry?: string;
    region?: string;
    address?: string;
  };

  if (!body.company?.trim() || !body.contactName?.trim()) {
    return NextResponse.json({ error: "Missing customer fields" }, { status: 400 });
  }

  const created = await prisma.customer.create({
    data: {
      name: body.company.trim(),
      company: body.company.trim(),
      contactName: body.contactName.trim(),
      contactPhone: body.contactPhone?.trim() || "-",
      industry: body.industry?.trim() || "未分类",
      region: body.region?.trim() || "未设置",
      address: body.address?.trim() || "-"
    }
  });

  return NextResponse.json(created, { status: 201 });
}
