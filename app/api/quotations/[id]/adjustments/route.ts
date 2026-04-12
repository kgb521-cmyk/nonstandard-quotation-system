import { NextResponse } from "next/server";
import { saveManualModuleAdjustment } from "../../../../../src/server/db/quotation-repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as {
    moduleId?: string;
    operatorUserId?: string;
    quantity?: number;
    unitPrice?: number;
    reason?: string;
  };

  if (!body.moduleId || !body.operatorUserId || body.quantity == null || body.unitPrice == null) {
    return NextResponse.json({ error: "Missing adjustment payload" }, { status: 400 });
  }

  const result = await saveManualModuleAdjustment({
    projectId: id,
    moduleId: body.moduleId,
    operatorUserId: body.operatorUserId,
    quantity: Number(body.quantity),
    unitPrice: Number(body.unitPrice),
    reason: body.reason?.trim() || "人工校正"
  });

  return NextResponse.json(result);
}
