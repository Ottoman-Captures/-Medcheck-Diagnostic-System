import { NextResponse } from "next/server";
import { ZodError, type ZodType, type ZodTypeDef } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "API_ERROR"
  ) {
    super(message);
  }
}

export async function parseJson<Output, Def extends ZodTypeDef = ZodTypeDef, Input = unknown>(
  request: Request,
  schema: ZodType<Output, Def, Input>
): Promise<Output> {
  const payload = await request.json().catch(() => {
    throw new ApiError(400, "Request body must be valid JSON.", "INVALID_JSON");
  });

  return schema.parse(payload);
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: error.status }
    );
  }

  if (error instanceof ZodError) {
    console.error("Validation error:", error.format());
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "The request payload is invalid.",
          issues: error.flatten()
        }
      },
      { status: 422 }
    );
  }

  console.error(error);
  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong."
      }
    },
    { status: 500 }
  );
}
