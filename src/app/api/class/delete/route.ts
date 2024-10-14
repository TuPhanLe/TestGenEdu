import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// API DELETE để xóa một lớp học dựa trên classId
export async function DELETE(req: Request) {
  try {
    // Lấy classId từ body của request
    const { classId } = await req.json();

    // Kiểm tra xem classId có được truyền hay không
    if (!classId) {
      return NextResponse.json(
        { error: "Thiếu classId trong yêu cầu" },
        { status: 400 }
      );
    }

    // Kiểm tra xem lớp học có tồn tại trong cơ sở dữ liệu hay không
    const existingClass = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!existingClass) {
      return NextResponse.json(
        { error: "Lớp học không tồn tại" },
        { status: 404 }
      );
    }

    // Xóa lớp học và các liên kết trong bảng UserClass
    await prisma.class.delete({
      where: { id: classId },
    });

    return NextResponse.json(
      { message: "Lớp học đã được xóa thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa lớp học:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa lớp học" },
      { status: 500 }
    );
  }
}
