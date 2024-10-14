import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthSession } from "@/lib/nextauth";
import { hash } from "bcrypt-ts";
import { studentSchema } from "@/schemas/form/student"; // Sử dụng schema của sinh viên để validate
import { prisma } from "@/lib/db";
import { UserStatus } from "@prisma/client";

// API PUT để cập nhật thông tin sinh viên
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Xác thực session và quyền ADMIN
    const session = await getAuthSession();
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Bạn không có quyền truy cập" },
        { status: 403 }
      );
    }

    // Tìm sinh viên dựa trên userName
    const student = await prisma.user.findUnique({
      where: { userName: body.userName },
    });

    // Nếu không tìm thấy sinh viên, trả về lỗi 404
    if (!student) {
      return NextResponse.json(
        { error: "Sinh viên không tồn tại" },
        { status: 404 }
      );
    }

    // Mã hóa mật khẩu nếu có thay đổi mật khẩu
    const hashedPassword = body.password ? await hash(body.password, 10) : null;

    // Cập nhật thông tin sinh viên
    const updatedStudent = await prisma.user.update({
      where: { userName: body.userName },
      data: {
        name: body.name,
        email: body.email || null,
        status: body.status ? body.status : UserStatus.ACTIVE,
        studentId: body.studentId, // Thêm trường mã sinh viên
        class: body.class, // Thêm trường lớp
        department: body.department, // Thêm trường khoa
        ...(hashedPassword ? { password: hashedPassword } : {}),
      },
    });

    // Trả về thông tin sinh viên đã cập nhật
    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);

    // Xử lý lỗi validate Zod
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Xử lý các lỗi khác
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
