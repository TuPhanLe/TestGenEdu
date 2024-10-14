import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// API GET để lấy thông tin sinh viên dựa trên userName
export async function GET(req: Request) {
  try {
    // Lấy thông tin userName từ query parameters
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName");

    // Nếu không có userName, trả về lỗi
    if (!userName) {
      return NextResponse.json(
        { error: "Thiếu userName trong yêu cầu" },
        { status: 400 }
      );
    }

    // Tìm sinh viên trong cơ sở dữ liệu dựa trên userName
    const student = await prisma.user.findUnique({
      where: { userName },
      select: {
        name: true,
        userName: true,
        email: true,
        status: true,
        password: true,
        studentId: true, // Thêm các trường liên quan đến sinh viên
        class: true,
        department: true,
      },
    });

    // Nếu không tìm thấy sinh viên, trả về lỗi 404
    if (!student) {
      return NextResponse.json(
        { error: "Không tìm thấy sinh viên với userName này" },
        { status: 404 }
      );
    }

    // Trả về thông tin của sinh viên
    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    // Xử lý các lỗi khác
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
