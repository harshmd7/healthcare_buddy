import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward the full payload (all 40+ features already computed client-side) to FastAPI
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("FastAPI error:", text);
      return NextResponse.json(
        { success: false, error: "ML backend error: " + text },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      disease: data.disease,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Prediction API Error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "Could not reach the ML backend. Is FastAPI running on port 8000?",
      },
      { status: 500 }
    );
  }
}
