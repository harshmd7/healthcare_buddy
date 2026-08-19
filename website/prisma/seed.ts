import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const doctors = [
  { name: "Dr. Anjali Sharma", specialization: "Cardiologist" },
  { name: "Dr. Rohan Mehta", specialization: "Neurologist" },
  { name: "Dr. Priya Nair", specialization: "Pulmonologist" },
  { name: "Dr. Karan Verma", specialization: "General Physician" },
  { name: "Dr. Sneha Kulkarni", specialization: "Endocrinologist" },
];

async function main() {
  for (const doc of doctors) {
    const existing = await prisma.doctor.findFirst({
      where: { name: doc.name },
    });
    if (!existing) {
      await prisma.doctor.create({ data: doc });
      console.log(`Created ${doc.name} (${doc.specialization})`);
    } else {
      console.log(`Skipped ${doc.name}, already exists`);
    }
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
