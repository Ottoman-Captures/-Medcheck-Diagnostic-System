import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const srcPath = path.join(process.cwd(), "prisma", "dev.db");
    const destPath = "/tmp/dev.db";

    const srcExists = fs.existsSync(srcPath);
    const destExists = fs.existsSync(destPath);

    const srcStats = srcExists ? fs.statSync(srcPath) : null;
    const destStats = destExists ? fs.statSync(destPath) : null;

    // Read jwks rows
    const jwksRows = await prisma.jwks.findMany();

    return NextResponse.json({
      success: true,
      files: {
        srcExists,
        destExists,
        srcSize: srcStats?.size || 0,
        destSize: destStats?.size || 0,
        srcMtime: srcStats?.mtime || null,
        destMtime: destStats?.mtime || null,
      },
      jwksCount: jwksRows.length,
      jwks: jwksRows.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        expiresAt: r.expiresAt,
        publicKeyLength: r.publicKey?.length || 0,
        privateKeyLength: r.privateKey?.length || 0,
        publicKeyStart: r.publicKey ? r.publicKey.substring(0, 30) : null,
        privateKeyStart: r.privateKey ? r.privateKey.substring(0, 30) : null,
      })),
      env: {
        VERCEL: process.env.VERCEL,
        VERCEL_REGION: process.env.VERCEL_REGION,
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
      }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
