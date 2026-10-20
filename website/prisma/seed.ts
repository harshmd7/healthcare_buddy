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

type DoctorSeed = {
  name: string;
  specialization: string;
  clerkUserId: string;
};

const doctors: DoctorSeed[] = process.env.DOCTORS_JSON
  ? JSON.parse(process.env.DOCTORS_JSON)
  : [];

const demoDoctorNames = [
  "Dr. Anjali Sharma",
  "Dr. Rohan Mehta",
  "Dr. Priya Nair",
  "Dr. Karan Verma",
  "Dr. Sneha Kulkarni",
];

async function main() {
  const demoDoctors = await prisma.doctor.findMany({
    where: { name: { in: demoDoctorNames } },
    select: { id: true },
  });
  const demoDoctorIds = demoDoctors.map(({ id }) => id);

  if (demoDoctorIds.length > 0) {
    await prisma.case.deleteMany({ where: { doctorId: { in: demoDoctorIds } } });
    await prisma.doctor.deleteMany({ where: { id: { in: demoDoctorIds } } });
  }

  await prisma.prediction.deleteMany({
    where: { confidence: "demo", inputData: { path: ["seeded"], equals: true } },
  });

  for (const doctor of doctors) {
    const existingDoctor = await prisma.doctor.findFirst({
      where: { clerkUserId: doctor.clerkUserId },
    });

    if (!existingDoctor) {
      await prisma.doctor.create({ data: doctor });
    } else {
      await prisma.doctor.update({
        where: { id: existingDoctor.id },
        data: { name: doctor.name, specialization: doctor.specialization },
      });
    }
  }

  console.log(`Configured ${doctors.length} real doctor account(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
