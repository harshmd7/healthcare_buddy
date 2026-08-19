import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();

      console.error("FastAPI error:", text);

      return NextResponse.json(
        {
          success: false,
          error: "ML backend error: " + text,
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      disease: data.disease,
      top3:
        data.top3 ?? [
          {
            disease: data.disease,
            confidence: 1,
          },
        ],
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Prediction API Error:", msg);

    return NextResponse.json(
      {
        success: false,
        error:
          "Could not reach the ML backend. Make sure FastAPI is running: python -m uvicorn app:app --reload",
      },
      { status: 500 }
    );
  }
}