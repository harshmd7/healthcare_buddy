import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";

const [clerkUserId, name, specialization] = process.argv.slice(2);

if (!clerkUserId || !name || !specialization) {
  console.error(
    'Usage: npm run doctor:link -- user_... "Dr. Name" "Specialization"'
  );
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { clerkUserId },
  });

  const doctor = existingDoctor
    ? await prisma.doctor.update({
        where: { id: existingDoctor.id },
        data: { name, specialization, available: true },
      })
    : await prisma.doctor.create({
        data: { clerkUserId, name, specialization, available: true },
      });

  console.log(`Doctor role linked: ${doctor.name} (${doctor.specialization})`);
  console.log(`Clerk user: ${doctor.clerkUserId}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
