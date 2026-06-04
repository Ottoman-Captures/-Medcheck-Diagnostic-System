const { PrismaClient } = require("@prisma/client");

async function main() {
  console.log("Cleaning build-time Jwks rows from SQLite database...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "file:./prisma/dev.db"
      }
    }
  });

  try {
    await prisma.jwks.deleteMany();
    console.log("Database clean: Jwks table cleared successfully.");
  } catch (err) {
    console.error("Failed to clean Jwks table during build:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Fatal database cleanup error:", err);
  process.exit(1);
});
