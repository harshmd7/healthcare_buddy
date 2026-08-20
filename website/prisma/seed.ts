import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
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
