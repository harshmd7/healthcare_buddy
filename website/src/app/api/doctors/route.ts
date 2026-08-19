import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/doctors?specialization=Cardiologist
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const specialization = searchParams.get("specialization");

  const doctors = await prisma.doctor.findMany({
    where: specialization
      ? { specialization, available: true }
      : { available: true },
  });

  return NextResponse.json({ success: true, doctors });
}
