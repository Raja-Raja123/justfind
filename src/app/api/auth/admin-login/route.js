import { NextResponse } from "next/server";
import { ensureAdminUser, verifyAdminCredentials } from "@/lib/adminAuth";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/adminSession";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email ?? "";
    const password = body?.password ?? "";

    await ensureAdminUser();
    const adminUser = await verifyAdminCredentials(email, password);
    if (!adminUser) {
      const response = NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
      clearSessionCookie(response);
      return response;
    }

    const token = createSessionToken(adminUser.id);
    const response = NextResponse.json({ success: true, adminId: adminUser.id });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("/api/admin/auth/login", error);
    return NextResponse.json(
      { error: "Unable to login" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
