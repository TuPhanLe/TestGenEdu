import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// API GET để lấy thông tin giảng viên dựa trên userName
export async function GET(req: Request) {
  try {
    // Lấy thông tin userName từ query parameters
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("userName");
    console.log(userName);

    // Nếu không có userName, trả về lỗi
    if (!userName) {
      return NextResponse.json(
        { error: "Thiếu userName trong yêu cầu" },
        { status: 400 }
      );
    }

    // Tìm giảng viên trong cơ sở dữ liệu dựa trên userName
    const lecturer = await prisma.user.findUnique({
      where: { userName },
      select: {
        name: true,
        userName: true,
        email: true,
        status: true,
        password: true,
      },
    });

    // Nếu không tìm thấy giảng viên, trả về lỗi 404
    if (!lecturer) {
      return NextResponse.json(
        { error: "Không tìm thấy giảng viên với userName này" },
        { status: 404 }
      );
    }

    // Trả về thông tin của giảng viên
    return NextResponse.json(lecturer, { status: 200 });
  } catch (error) {
    // Xử lý các lỗi khác
    return NextResponse.json({ error: "Đã có lỗi xảy ra" }, { status: 500 });
  }
}
