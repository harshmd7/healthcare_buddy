This app now connects the Next.js frontend, Clerk authentication, Prisma persistence, and the FastAPI ML backend.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

Before running the app, make sure you have:

- set `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, and `CLERK_SECRET_KEY` in `.env`
- generated the Prisma client and applied the migration for the `Prediction` table
- started the FastAPI server from the `ml/` folder with `python -m uvicorn app:app --reload`

### Doctor admin access

Doctor review access is restricted to Clerk accounts explicitly linked to a doctor record. Create the doctor accounts in Clerk, then add their IDs to `.env` using a JSON object keyed by the seeded doctor name:

```env
DOCTOR_CLERK_USER_IDS={"Dr. Anjali Sharma":"user_...","Dr. Rohan Mehta":"user_..."}
```

Run `npm run db:seed` after setting the variable. Doctors sign in at `/doctor/sign-in`; the review queue is available at `/doctor`. Patient accounts cannot access another doctor&apos;s queue or update cases.

To generate and migrate the database schema:

```bash
npx prisma migrate dev --name add-predictions
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
