import { NextResponse } from "next/server";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(code: string, message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export function createSuccessResponse<T>(data: T, message?: string) {
  return { success: true, data, message };
}

export function createErrorResponse(message: string, status = 400, code = "ERROR") {
  return {
    success: false,
    message,
    error: { code, message, status },
  };
}
