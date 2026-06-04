import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prismaClient: PrismaClient;

if (
  process.env.VERCEL === "1" &&
  (process.env.VERCEL_REGION ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NOW_REGION)
) {
  const srcPath = path.join(process.cwd(), "prisma", "dev.db");
  const destPath = "/tmp/dev.db";

  try {
    const prismaDir = path.join(process.cwd(), "prisma");
    console.log(`Checking database files. process.cwd: ${process.cwd()}`);
    if (fs.existsSync(prismaDir)) {
      console.log(`Files in ${prismaDir}:`, fs.readdirSync(prismaDir));
    } else {
      console.warn(`Directory ${prismaDir} does not exist.`);
    }
  } catch (e) {
    console.error("Listing directory error:", e);
  }

  const globalObj = globalThis as typeof globalThis & {
    hasCopiedDb?: boolean;
  };
  if (!globalObj.hasCopiedDb) {
    try {
      console.log(`Copying database from ${srcPath} to ${destPath}...`);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        fs.chmodSync(destPath, 0o666);
        console.log("Database copied successfully to /tmp!");
        globalObj.hasCopiedDb = true;
      } else {
        console.warn(`Source database at ${srcPath} not found!`);
      }
    } catch (error) {
      console.error("Failed to copy database to /tmp:", error);
    }
  } else {
    console.log("Database already copied in this container instance.");
  }

  prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: "file:/tmp/dev.db"
      }
    },
    log: ["error"]
  });
} else {
  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }
}

export const prisma = prismaClient;
