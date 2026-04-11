import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { age, gender, bmi, symptoms, userId } = body;

    // Call FastAPI ML backend
    const response = await axios.post("http://127.0.0.1:8000/predict", {
      age,
      gender,
      bmi,
      symptoms,
    });

    const disease = response.data.disease;

    // Save to database (optional)
    /*
    await db.prediction.create({
      data: {
        userId,
        age,
        gender,
        bmi,
        symptoms: JSON.stringify(symptoms),
        result: disease,
      },
    });
    */

    return NextResponse.json({
      success: true,
      disease,
    });

  } catch (error: any) {
    console.error("Prediction API Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Prediction failed",
      },
      { status: 500 }
    );
  }
}