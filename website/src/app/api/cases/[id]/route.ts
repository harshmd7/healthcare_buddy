import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedDoctor } from "@/lib/doctor-auth";

// GET /api/cases/:id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doctor = await getAuthenticatedDoctor();
  if (!doctor) {
    return NextResponse.json({ success: false, error: "Doctor access required" }, { status: 403 });
  }

  const found = await prisma.case.findUnique({
    where: { id, doctorId: doctor.id },
    include: { doctor: true },
  });

  if (!found) {
    return NextResponse.json(
      { success: false, error: "Case not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, case: found });
}

// PATCH /api/cases/:id
// body: { status?, confirmedDisease?, doctorNote? }
// This is the doctor-confirm step: confirmedDisease is stored as the
// verified label for future model retraining (the feedback loop).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await getAuthenticatedDoctor();
    if (!doctor) {
      return NextResponse.json({ success: false, error: "Doctor access required" }, { status: 403 });
    }

    const body = await req.json();
    const { status, confirmedDisease, doctorNote } = body;

    const current = await prisma.case.findUnique({
      where: { id, doctorId: doctor.id },
      select: { status: true, symptomsJson: true },
    });

    if (!current) {
      return NextResponse.json({ success: false, error: "Case not found" }, { status: 404 });
    }

    const allowedTransitions: Record<string, string[]> = {
      pending: ["in_review"],
      in_review: ["completed"],
      completed: [],
    };

    if (status && status !== current.status && !allowedTransitions[current.status]?.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid case transition from ${current.status} to ${status}` },
        { status: 409 }
      );
    }

    if (status === "completed" && (!confirmedDisease || !doctorNote?.trim())) {
      return NextResponse.json(
        { success: false, error: "A confirmed diagnosis and doctor note are required to complete a case" },
        { status: 400 }
      );
    }

    const updated = await prisma.case.update({
      where: { id, doctorId: doctor.id },
      data: {
        ...(status ? { status } : {}),
        ...(confirmedDisease ? { confirmedDisease } : {}),
        ...(doctorNote !== undefined ? { doctorNote } : {}),
      },
      include: { doctor: true },
    });

    let retrained = false;
    if (status === "completed" && confirmedDisease) {
      try {
        const feedbackResponse = await fetch("http://127.0.0.1:8000/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            case_id: id,
            disease: confirmedDisease,
            symptoms: JSON.parse(current.symptomsJson),
          }),
        });
        retrained = feedbackResponse.ok;
      } catch (feedbackError) {
        console.error("ML feedback error:", feedbackError);
      }
    }

    return NextResponse.json({ success: true, case: updated, retrained });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
