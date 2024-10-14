import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { hash } from "bcrypt-ts";
import { lecturerSchema } from "@/schemas/form/lecturer";
import { prisma } from "@/lib/db";
import { UserStatus } from "@prisma/client";

// API PUT để cập nhật thông tin giảng viên
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const session = await getAuthSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập" },
        { status: 403 }
      );
    }

    const lecturer = await prisma.user.findUnique({
      where: { userName: body.userName },
    });

    if (!lecturer) {
      return NextResponse.json(
        { error: "Giảng viên không tồn tại" },
        { status: 404 }
      );
    }

    const hashedPassword = await hash(body.password, 10);

    const updatedLecturer = await prisma.user.update({
      where: { userName: body.userName },
      data: {
        name: body.name,
        email: body.email || null,
        status: UserStatus.ACTIVE,
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    return NextResponse.json(updatedLecturer, { status: 200 });
  } catch (error) {
    console.error("Error updating lecturer:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
