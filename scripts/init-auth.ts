import { auth } from "../src/lib/auth";

async function main() {
  console.log("Forcing Better Auth to generate JWKS key pair (cache-busted)...");
  try {
    const res = await auth.handler(
      new Request("http://localhost:3000/api/auth/jwks", {
        method: "GET"
      })
    );
    console.log("JWKS response status:", res.status);
    console.log("Better Auth initialized and JWKS generated successfully.");

    // Query and log the JWKS rows written to the database during build time
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "file:./prisma/dev.db"
        }
      }
    });
    const rows = await prisma.jwks.findMany();
    console.log("BUILD TIME JWKS ROWS:", JSON.stringify(rows, null, 2));
    await prisma.$disconnect();
  } catch (err) {
    console.error("Failed to initialize Better Auth JWKS:", err);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
