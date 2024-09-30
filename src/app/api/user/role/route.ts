// pages/api/userinfo.ts

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";

// Đổi thành GET vì chỉ lấy dữ liệu
export async function GET(req: Request) {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  // Trả về role của người dùng
  return NextResponse.json({ role: session.user.role });
}
