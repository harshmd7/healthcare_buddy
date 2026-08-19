import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { specializationFor } from "@/lib/specialization";

// POST /api/cases
// body: { patientName?, symptoms, predictedDisease, confidence, top3 }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, symptoms, predictedDisease, confidence, top3 } = body;

    if (!predictedDisease || !top3) {
      return NextResponse.json(
        { success: false, error: "Missing prediction data" },
        { status: 400 }
      );
    }

    const specialization = specializationFor(predictedDisease);

    // naive load-balancing: pick the available doctor of the right
    // specialization with the fewest open (pending/in_review) cases
    const doctors = await prisma.doctor.findMany({
      where: { specialization, available: true },
      include: {
        cases: { where: { status: { in: ["pending", "in_review"] } } },
      },
    });

    const chosenDoctor = doctors.sort(
      (a, b) => a.cases.length - b.cases.length
    )[0];

    const newCase = await prisma.case.create({
      data: {
        patientName: patientName || "Anonymous Patient",
        symptomsJson: JSON.stringify(symptoms ?? {}),
        predictedDisease,
        confidence: confidence ?? 0,
        top3Json: JSON.stringify(top3),
        doctorId: chosenDoctor?.id,
        status: "pending",
      },
      include: { doctor: true },
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Create case error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET /api/cases?doctorId=xxx&status=pending
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get("doctorId");
  const status = searchParams.get("status");

  const cases = await prisma.case.findMany({
    where: {
      ...(doctorId ? { doctorId } : {}),
      ...(status ? { status } : {}),
    },
    include: { doctor: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, cases });
}
