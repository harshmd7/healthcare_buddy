import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const doctors = [
  { name: "Dr. Anjali Sharma", specialization: "Cardiologist" },
  { name: "Dr. Rohan Mehta", specialization: "Neurologist" },
  { name: "Dr. Priya Nair", specialization: "Pulmonologist" },
  { name: "Dr. Karan Verma", specialization: "General Physician" },
  { name: "Dr. Sneha Kulkarni", specialization: "Endocrinologist" },
];

const clerkUserIds: Record<string, string> = process.env.DOCTOR_CLERK_USER_IDS
  ? JSON.parse(process.env.DOCTOR_CLERK_USER_IDS)
  : {};

const demoCases = [
  {
    doctorName: "Dr. Anjali Sharma",
    patientName: "Aarav Kapoor",
    status: "pending",
    predictedDisease: "Heart Disease",
    confidence: 0.87,
    symptoms: { chest_pain: 1, shortness_of_breath: 1, fatigue: 1, age: 58 },
    top3: [
      { disease: "Heart Disease", confidence: 0.87 },
      { disease: "Pneumonia", confidence: 0.08 },
      { disease: "No Disease", confidence: 0.05 },
    ],
  },
  {
    doctorName: "Dr. Rohan Mehta",
    patientName: "Meera Iyer",
    status: "in_review",
    predictedDisease: "Brain Stroke",
    confidence: 0.79,
    symptoms: { weakness: 1, dizziness: 1, speech_problems: 1, age: 66 },
    top3: [
      { disease: "Brain Stroke", confidence: 0.79 },
      { disease: "Dizziness", confidence: 0.12 },
      { disease: "No Disease", confidence: 0.09 },
    ],
  },
  {
    doctorName: "Dr. Priya Nair",
    patientName: "Kabir Singh",
    status: "completed",
    predictedDisease: "Pneumonia",
    confidence: 0.91,
    confirmedDisease: "Pneumonia",
    doctorNote: "Continue prescribed medication and return for follow-up if breathing worsens.",
    symptoms: { cough: 1, fever: 1, shortness_of_breath: 1, age: 42 },
    top3: [
      { disease: "Pneumonia", confidence: 0.91 },
      { disease: "COVID-19", confidence: 0.06 },
      { disease: "Tuberculosis", confidence: 0.03 },
    ],
  },
];

async function main() {
  for (const doctor of doctors) {
    const existingDoctor = await prisma.doctor.findFirst({
      where: { name: doctor.name },
    });

    const clerkUserId = clerkUserIds[doctor.name];
    if (!existingDoctor) {
      await prisma.doctor.create({ data: { ...doctor, clerkUserId } });
    } else if (clerkUserId && existingDoctor.clerkUserId !== clerkUserId) {
      await prisma.doctor.update({
        where: { id: existingDoctor.id },
        data: { clerkUserId },
      });
    }
  }

  for (const demoCase of demoCases) {
    const doctor = await prisma.doctor.findFirst({
      where: { name: demoCase.doctorName },
    });

    if (!doctor) continue;

    const existingCase = await prisma.case.findFirst({
      where: {
        doctorId: doctor.id,
        patientName: demoCase.patientName,
      },
    });

    if (!existingCase) {
      await prisma.case.create({
        data: {
          doctorId: doctor.id,
          patientName: demoCase.patientName,
          status: demoCase.status,
          symptomsJson: JSON.stringify(demoCase.symptoms),
          predictedDisease: demoCase.predictedDisease,
          confidence: demoCase.confidence,
          top3Json: JSON.stringify(demoCase.top3),
          confirmedDisease: demoCase.confirmedDisease,
          doctorNote: demoCase.doctorNote,
        },
      });
    }
  }

  console.log("Demo doctors and review cases are ready");

  const existing = await prisma.prediction.count();

  if (existing === 0) {
    await prisma.prediction.create({
      data: {
        userId: null,
        disease: "No Disease",
        confidence: "demo",
        inputData: { seeded: true },
      },
    });
    console.log("Created demo prediction seed");
  } else {
    console.log("Skipped seed, prediction data already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
